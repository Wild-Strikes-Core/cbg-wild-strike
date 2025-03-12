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
var server = (0, http_1.createServer)();
var io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
var matches = {};
var numberOfMatches = 0;
var waitingsUsers = [];
io.on("connection", function (socket) {
    console.log("User connected: ".concat(socket.id));
    // Process player movement updates
    socket.on("playerMovement", function (data) {
        var currentRoomId = __spreadArray([], socket.rooms, true)[1];
        if (!currentRoomId) {
            return;
        }
        var matchId = Number(currentRoomId.split("_")[1]);
        var currentMatch = matches[matchId];
        if (!currentMatch) {
            return;
        }
        var currentPlayer = socket.id;
        // Validate incoming data has at least x and y coordinates
        if (typeof data !== 'object' || typeof data.x !== 'number' || typeof data.y !== 'number') {
            console.log("Invalid movement data received from", currentPlayer);
            return;
        }
        // Handle animation state carefully to prevent flickering
        if (currentMatch.player1.id === currentPlayer) {
            // Update player 1 position
            currentMatch.player1.x = data.x;
            currentMatch.player1.y = data.y;
            // Always update these properties if provided
            if (data.flipX !== undefined)
                currentMatch.player1.flipX = data.flipX;
            if (data.velocityX !== undefined)
                currentMatch.player1.velocityX = data.velocityX;
            if (data.velocityY !== undefined)
                currentMatch.player1.velocityY = data.velocityY;
            // Special handling for animation and attack state
            // Only update animation if explicitly provided or if player is not attacking
            if (data.animation) {
                // If this is an attack animation, set isAttacking to true
                if (data.animation.includes('_Attack')) {
                    currentMatch.player1.isAttacking = true;
                    currentMatch.player1.animation = data.animation;
                }
                // If previously attacking and now not, allow animation update
                else if (currentMatch.player1.isAttacking && data.isAttacking === false) {
                    currentMatch.player1.isAttacking = false;
                    currentMatch.player1.animation = data.animation;
                }
                // If not attacking or was not attacking before, update animation
                else if (!currentMatch.player1.isAttacking) {
                    currentMatch.player1.animation = data.animation;
                }
            }
            // Update animState if provided - but prevent storing circular references
            if (data.animState && typeof data.animState === 'object') {
                // Create a shallow copy of the animation state to prevent circular references
                currentMatch.player1.animState = {
                    idle: data.animState.idle || false,
                    running: data.animState.running || false,
                    jumping: data.animState.jumping || false,
                    falling: data.animState.falling || false,
                    attacking: data.animState.attacking || false,
                    crouching: data.animState.crouching || false,
                    isMoving: data.animState.isMoving || false
                };
            }
        }
        if (currentMatch.player2.id === currentPlayer) {
            // Update player 2 position with the same logic as player 1
            currentMatch.player2.x = data.x;
            currentMatch.player2.y = data.y;
            if (data.flipX !== undefined)
                currentMatch.player2.flipX = data.flipX;
            if (data.velocityX !== undefined)
                currentMatch.player2.velocityX = data.velocityX;
            if (data.velocityY !== undefined)
                currentMatch.player2.velocityY = data.velocityY;
            // Same special handling for animation and attack state
            if (data.animation) {
                if (data.animation.includes('_Attack')) {
                    currentMatch.player2.isAttacking = true;
                    currentMatch.player2.animation = data.animation;
                }
                else if (currentMatch.player2.isAttacking && data.isAttacking === false) {
                    currentMatch.player2.isAttacking = false;
                    currentMatch.player2.animation = data.animation;
                }
                else if (!currentMatch.player2.isAttacking) {
                    currentMatch.player2.animation = data.animation;
                }
            }
            // Update animState if provided - but prevent storing circular references
            if (data.animState && typeof data.animState === 'object') {
                // Create a shallow copy of the animation state to prevent circular references
                currentMatch.player2.animState = {
                    idle: data.animState.idle || false,
                    running: data.animState.running || false,
                    jumping: data.animState.jumping || false,
                    falling: data.animState.falling || false,
                    attacking: data.animState.attacking || false,
                    crouching: data.animState.crouching || false,
                    isMoving: data.animState.isMoving || false
                };
            }
        }
        // Create a sanitized version of the match state to send to clients
        // This prevents circular references that can cause stack overflows
        var safeMatchData = {
            player1: {
                id: currentMatch.player1.id,
                x: currentMatch.player1.x,
                y: currentMatch.player1.y,
                animation: currentMatch.player1.animation,
                flipX: currentMatch.player1.flipX,
                velocityX: currentMatch.player1.velocityX,
                velocityY: currentMatch.player1.velocityY,
                isAttacking: currentMatch.player1.isAttacking,
                animState: currentMatch.player1.animState
            },
            player2: {
                id: currentMatch.player2.id,
                x: currentMatch.player2.x,
                y: currentMatch.player2.y,
                animation: currentMatch.player2.animation,
                flipX: currentMatch.player2.flipX,
                velocityX: currentMatch.player2.velocityX,
                velocityY: currentMatch.player2.velocityY,
                isAttacking: currentMatch.player2.isAttacking,
                animState: currentMatch.player2.animState
            },
            roomId: currentMatch.roomId
        };
        // Broadcast updated match state to both players
        io.to(currentRoomId).emit("arenaStateChanged", safeMatchData);
        // Also emit a specific movement update for this player that other clients can use
        var playerData = {
            id: socket.id,
            x: data.x,
            y: data.y,
            animation: data.animation,
            flipX: data.flipX,
            velocityX: data.velocityX,
            velocityY: data.velocityY,
            animState: data.animState && typeof data.animState === 'object' ? __assign({}, data.animState) : undefined
        };
        // Send to all other clients in the room
        socket.to(currentRoomId).emit("playerMoved", playerData);
    });
    // Handle direct attack notifications
    socket.on("playerAttack", function (data) {
        var currentRoomId = __spreadArray([], socket.rooms, true)[1];
        if (!currentRoomId) {
            // Player not in a room, ignore
            return;
        }
        var matchId = Number(currentRoomId.split("_")[1]);
        var currentMatch = matches[matchId];
        if (!currentMatch) {
            // Match not found, ignore
            return;
        }
        // Add the socket ID and match info to the data
        var attackData = __assign(__assign({}, data), { id: socket.id, matchId: matchId });
        // Broadcast the attack to the other player in the room
        socket.to(currentRoomId).emit("playerAttack", attackData);
        console.log("Player ".concat(socket.id, " attacked with type: ").concat(data.attackType || 'unknown'));
    });
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
    // Add this helper function to safely serialize objects that may contain circular references
    function safeStringify(obj) {
        var seen = new WeakSet();
        return JSON.stringify(obj, function (key, value) {
            // Skip timer objects entirely
            if (key === 'timer' && value && typeof value.refresh === 'function') {
                return '[Timeout]';
            }
            // Handle circular references
            if (typeof value === 'object' && value !== null) {
                if (seen.has(value)) {
                    return '[Circular]';
                }
                seen.add(value);
            }
            return value;
        }, 2);
    }
    socket.on("findMatch", function (data) {
        var _a, _b;
        console.log("Finding match");
        waitingsUsers = __spreadArray([], new Set(__spreadArray(__spreadArray([], waitingsUsers, true), [socket.id], false)), true);
        if (waitingsUsers.length >= 2) {
            var player1 = waitingsUsers.pop();
            var player2 = waitingsUsers.pop();
            var room_1 = "match_".concat(numberOfMatches);
            if (!player1 || !player2) {
                return;
            }
            matches[numberOfMatches] = {
                player1: {
                    x: 608,
                    y: 752,
                    id: player1,
                },
                player2: {
                    x: 900, // Position player 2 a bit to the right
                    y: 752,
                    id: player2,
                },
                roomId: room_1,
                timer: null,
                remainingTime: 120 // 2 minutes in seconds
            };
            if (player1 && player2) {
                (_a = io.sockets.sockets.get(player1)) === null || _a === void 0 ? void 0 : _a.join(room_1);
                (_b = io.sockets.sockets.get(player2)) === null || _b === void 0 ? void 0 : _b.join(room_1);
            }
            console.log("Player 1", player1);
            console.log("Player 2", player2);
            console.log("Match #".concat(numberOfMatches, " has started"));
            // Start match timer
            var matchId_1 = numberOfMatches;
            matches[matchId_1].timer = setInterval(function () {
                if (matches[matchId_1]) {
                    matches[matchId_1].remainingTime--;
                    io.to(room_1).emit("timerUpdate", { remainingTime: matches[matchId_1].remainingTime });
                    if (matches[matchId_1].remainingTime <= 0) {
                        clearInterval(matches[matchId_1].timer);
                        io.to(room_1).emit("matchEnded");
                        delete matches[matchId_1];
                    }
                }
            }, 1000);
            numberOfMatches++;
            // Use our safe stringify function instead of JSON.stringify directly
            console.log(safeStringify(matches));
            console.log(numberOfMatches);
            // Send only the necessary data to clients
            var matchData = {
                room: room_1,
                player1: player1,
                player2: player2
            };
            io.to(room_1).emit("matchFound", matchData);
        }
    });
    socket.on("disconnect", function () {
        var _a, _b;
        console.log("User disconnected: ".concat(socket.id));
        // Remove from waiting list if user disconnects
        waitingsUsers = waitingsUsers.filter(function (waitingUser) {
            if (waitingUser == socket.id) {
                console.log("user removed from waiting list");
            }
            return waitingUser != socket.id;
        });
        // When user is in match then disconnects
        var tempMatches = Object.entries(matches);
        for (var i = 0; i < tempMatches.length; i++) {
            var currentMatchState = tempMatches[i][1];
            var currentMatchId = tempMatches[i][0];
            // Check if this socket was in the match
            if (((_a = currentMatchState.player1) === null || _a === void 0 ? void 0 : _a.id) === socket.id ||
                ((_b = currentMatchState.player2) === null || _b === void 0 ? void 0 : _b.id) === socket.id) {
                // Notify the other player about the disconnection
                io.to(currentMatchState.roomId).emit("playerDisconnected", socket.id);
                // Clean up the match
                if (currentMatchState.timer) {
                    clearInterval(currentMatchState.timer);
                }
                delete matches[currentMatchId];
                console.log("Match #".concat(currentMatchId, " has ended due to player disconnection"));
            }
        }
    });
});
server.listen(3001, function () { return console.log("Socket.IO Server running on port 3001"); });
