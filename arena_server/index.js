"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var socket_io_1 = require("socket.io");
// Constants for configuration
var PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
var MATCH_DURATION = 120; // 2 minutes in seconds
var UPDATE_THROTTLE = 50; // milliseconds between position updates
var MAX_PLAYERS_PER_MATCH = 2;
// Create HTTP server and Socket.IO instance
var server = (0, http_1.createServer)();
var io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
// Maps to store match data and waiting users
var matches = {};
var matchCount = 0;
var waitingUsers = [];
// Map of player IDs to their match IDs for quick lookups
var playerToMatch = new Map();
// Track last update timestamp per player to throttle updates
var lastPlayerUpdate = new Map();
/**
 * Extract match ID from room ID string
 */
function getMatchIdFromRoomId(roomId) {
    if (!roomId)
        return null;
    var parts = roomId.split('_');
    if (parts.length !== 2 || parts[0] !== 'match')
        return null;
    return Number(parts[1]);
}
/**
 * Get match for a player ID
 */
function getMatchForPlayer(playerId) {
    var matchId = playerToMatch.get(playerId);
    if (matchId === undefined)
        return null;
    return matches[matchId] || null;
}
/**
 * Send current match state to players
 */
function broadcastMatchState(match) {
    // Create a sanitized version of the match state to send to clients
    var safeMatchData = {
        player1: __assign({}, match.player1),
        player2: __assign({}, match.player2),
        roomId: match.roomId
    };
    // Broadcast to all players in the match
    io.to(match.roomId).emit("arenaStateChanged", safeMatchData);
}
/**
 * Create a new match between two players
 */
function createMatch(player1Id, player2Id) {
    var player1Socket = io.sockets.sockets.get(player1Id);
    var player2Socket = io.sockets.sockets.get(player2Id);
    if (!player1Socket || !player2Socket) {
        return null;
    }
    var matchId = matchCount++;
    var roomId = "match_".concat(matchId);
    // Create match data
    var match = {
        player1: {
            id: player1Id,
            x: 608,
            y: 752,
        },
        player2: {
            id: player2Id,
            x: 900, // Position player 2 a bit to the right
            y: 752,
        },
        roomId: roomId,
        timer: null,
        remainingTime: MATCH_DURATION
    };
    // Store the match
    matches[matchId] = match;
    // Add players to the match room
    player1Socket.join(roomId);
    player2Socket.join(roomId);
    // Set up quick lookup from player ID to match ID
    playerToMatch.set(player1Id, matchId);
    playerToMatch.set(player2Id, matchId);
    // Start match timer
    startMatchTimer(match);
    // Generate more friendly player names
    var player1Name = "Player ".concat(player1Id.substring(0, 4));
    var player2Name = "Player ".concat(player2Id.substring(0, 4));
    // Notify players with enhanced player information
    io.to(roomId).emit("matchFound", {
        room: roomId,
        players: {
            player1: {
                id: player1Id,
                name: player1Name,
                position: 'left'
            },
            player2: {
                id: player2Id,
                name: player2Name,
                position: 'right'
            }
        }
    });
    console.log("Match #".concat(matchId, " started between ").concat(player1Name, " (").concat(player1Id, ") and ").concat(player2Name, " (").concat(player2Id, ")"));
    // Also send individualized messages to each player with their socket ID identified
    player1Socket.emit("yourPlayerId", player1Id);
    player2Socket.emit("yourPlayerId", player2Id);
    return match;
}
/**
 * Start the timer for a match
 */
function startMatchTimer(match) {
    // Clear any existing timer
    if (match.timer) {
        clearInterval(match.timer);
    }
    // Set up interval for timer updates
    match.timer = setInterval(function () {
        if (match.remainingTime > 0) {
            match.remainingTime--;
            io.to(match.roomId).emit("timerUpdate", { remainingTime: match.remainingTime });
        }
        else {
            endMatch(match);
        }
    }, 1000);
}
/**
 * End a match and clean up resources
 */
function endMatch(match) {
    // Stop the timer
    if (match.timer) {
        clearInterval(match.timer);
        match.timer = null;
    }
    // Notify clients
    io.to(match.roomId).emit("matchEnded");
    // Clean up player to match mappings
    playerToMatch.delete(match.player1.id);
    playerToMatch.delete(match.player2.id);
    // Find and remove the match from the matches object
    var matchId = getMatchIdFromRoomId(match.roomId);
    if (matchId !== null) {
        delete matches[matchId];
    }
    console.log("Match in room ".concat(match.roomId, " has ended"));
}
/**
 * Process movement update for a player
 */
function processPlayerMovement(playerId, data) {
    // Skip updates that are too frequent
    var now = Date.now();
    var lastUpdate = lastPlayerUpdate.get(playerId) || 0;
    if (now - lastUpdate < UPDATE_THROTTLE) {
        return;
    }
    // Update the timestamp
    lastPlayerUpdate.set(playerId, now);
    // Get the match for this player
    var match = getMatchForPlayer(playerId);
    if (!match)
        return;
    // Validate data
    if (typeof data !== 'object' || typeof data.x !== 'number' || typeof data.y !== 'number') {
        console.log("Invalid movement data from player", playerId);
        return;
    }
    // Update player state based on which player in the match they are
    var isPlayer1 = match.player1.id === playerId;
    var playerState = isPlayer1 ? match.player1 : match.player2;
    // Update position
    playerState.x = data.x;
    playerState.y = data.y;
    // Update optional properties
    if (data.flipX !== undefined)
        playerState.flipX = data.flipX;
    if (data.velocityX !== undefined)
        playerState.velocityX = data.velocityX;
    if (data.velocityY !== undefined)
        playerState.velocityY = data.velocityY;
    if (data.isDodging !== undefined)
        playerState.isDodging = data.isDodging; // Add dodge state handling
    // Handle animation and attack state carefully
    if (data.animation) {
        // Handle attack animations
        if (data.animation.includes('_Attack')) {
            playerState.isAttacking = true;
            playerState.animation = data.animation;
        }
        // Handle transition out of attacking state
        else if (playerState.isAttacking && data.isAttacking === false) {
            playerState.isAttacking = false;
            playerState.animation = data.animation;
        }
        // Update animation if not in attacking state
        else if (!playerState.isAttacking) {
            playerState.animation = data.animation;
        }
    }
    // Update animation state if provided
    if (data.animState && typeof data.animState === 'object') {
        playerState.animState = __assign(__assign({}, playerState.animState), { idle: !!data.animState.idle, running: !!data.animState.running, jumping: !!data.animState.jumping, falling: !!data.animState.falling, attacking: !!data.animState.attacking, crouching: !!data.animState.crouching, isMoving: !!data.animState.isMoving, onGround: data.animState.onGround !== false, doubleJumping: !!data.animState.doubleJumping, isDodging: !!data.animState.isDodging });
    }
    // Broadcast updated state to all players in the match
    broadcastMatchState(match);
    // Also emit a direct movement update that other clients can use
    var playerData = {
        id: playerId,
        x: data.x,
        y: data.y,
        animation: data.animation,
        flipX: data.flipX,
        velocityX: data.velocityX,
        velocityY: data.velocityY,
        isDodging: data.isDodging, // Include dodge state in the broadcast
        animState: data.animState ? __assign({}, data.animState) : undefined,
        soundEvent: data.soundEvent || null
    };
    // Send to all other clients in the room
    io.to(match.roomId).emit("playerMoved", playerData);
}
/**
 * Handle cleanup when a player disconnects
 */
function handlePlayerDisconnect(playerId) {
    console.log("Player disconnected: ".concat(playerId));
    // Remove from waiting list
    waitingUsers = waitingUsers.filter(function (id) { return id !== playerId; });
    // Check if player was in a match
    var matchId = playerToMatch.get(playerId);
    if (matchId !== undefined && matches[matchId]) {
        var match = matches[matchId];
        // Notify remaining players
        io.to(match.roomId).emit("playerDisconnected", playerId);
        // End the match
        endMatch(match);
    }
    // Clean up tracking data
    playerToMatch.delete(playerId);
    lastPlayerUpdate.delete(playerId);
}
// Socket event handlers
io.on("connection", function (socket) {
    console.log("User connected: ".concat(socket.id));
    // Handle player movement updates
    socket.on("playerMovement", function (data) {
        processPlayerMovement(socket.id, data);
    });
    // Handle attack notifications
    socket.on("playerAttack", function (data) {
        var match = getMatchForPlayer(socket.id);
        if (!match)
            return;
        // Add the socket ID and match info to the data
        var attackData = __assign(__assign({}, data), { id: socket.id, matchId: getMatchIdFromRoomId(match.roomId) });
        // Broadcast the attack to other players in the match
        socket.to(match.roomId).emit("playerAttack", attackData);
    });
    // Handle player joining the game
    socket.on("playerJoined", function (data) {
        var _a;
        console.log("Player ".concat(socket.id, " joined at position:"), data.x, data.y);
        // Let the client know about other players
        socket.emit("currentPlayers", (_a = {},
            _a[socket.id] = {
                id: socket.id,
                x: data.x,
                y: data.y,
                animation: data.animation || '_Idle_Idle'
            },
            _a));
        // Notify all other clients about the new player
        socket.broadcast.emit("newPlayer", {
            id: socket.id,
            x: data.x,
            y: data.y,
            animation: data.animation || '_Idle_Idle'
        });
    });
    // Handle match finding
    socket.on("findMatch", function () {
        console.log("Player ".concat(socket.id, " is looking for a match"));
        // Ensure player is only in waiting list once
        waitingUsers = __spreadArray([], new Set(__spreadArray(__spreadArray([], waitingUsers, true), [socket.id], false)), true);
        // Check if we have enough players to start a match
        if (waitingUsers.length >= MAX_PLAYERS_PER_MATCH) {
            // Get the first two waiting players
            var player1 = waitingUsers.shift();
            var player2 = waitingUsers.shift();
            if (player1 && player2) {
                createMatch(player1, player2);
            }
        }
    });
    // Handle disconnections
    socket.on("disconnect", function () {
        handlePlayerDisconnect(socket.id);
    });
});
// Start the server
server.listen(PORT, function () { return console.log("Socket.IO Server running on port ".concat(PORT)); });
