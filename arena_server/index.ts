import { createServer } from "http";
import { Server } from "socket.io";

// Constants for configuration
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
const MATCH_DURATION = 120; // 2 minutes in seconds
const UPDATE_THROTTLE = 50; // milliseconds between position updates
const MAX_PLAYERS_PER_MATCH = 2;

// Create HTTP server and Socket.IO instance
const server = createServer();

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Type definitions for better safety
interface PlayerState {
  id: string;
  x: number;
  y: number;
  animation?: string;
  flipX?: boolean;
  velocityX?: number;
  velocityY?: number;
  isAttacking?: boolean;
  isDodging?: boolean; // Add the dodge state flag
  animState?: {
    idle?: boolean;
    running?: boolean;
    jumping?: boolean;
    falling?: boolean;
    attacking?: boolean;
    crouching?: boolean;
    isMoving?: boolean;
    onGround?: boolean;
    doubleJumping?: boolean;
    isDodging?: boolean; // Also add to animState for consistency
  };
  lastUpdate?: number; // Timestamp of last update
}

interface Match {
  player1: PlayerState;
  player2: PlayerState;
  roomId: string;
  timer: NodeJS.Timeout | null;
  remainingTime: number;
}

// Maps to store match data and waiting users
const matches: { [matchId: number]: Match } = {};
let matchCount = 0;
let waitingUsers: string[] = [];

// Map of player IDs to their match IDs for quick lookups
const playerToMatch: Map<string, number> = new Map();

// Track last update timestamp per player to throttle updates
const lastPlayerUpdate: Map<string, number> = new Map();

/**
 * Extract match ID from room ID string
 */
function getMatchIdFromRoomId(roomId: string): number | null {
  if (!roomId) return null;
  const parts = roomId.split('_');
  if (parts.length !== 2 || parts[0] !== 'match') return null;
  return Number(parts[1]);
}

/**
 * Get match for a player ID
 */
function getMatchForPlayer(playerId: string): Match | null {
  const matchId = playerToMatch.get(playerId);
  if (matchId === undefined) return null;
  return matches[matchId] || null;
}

/**
 * Send current match state to players
 */
function broadcastMatchState(match: Match): void {
  // Create a sanitized version of the match state to send to clients
  const safeMatchData = {
    player1: { ...match.player1 },
    player2: { ...match.player2 },
    roomId: match.roomId
  };
  
  // Broadcast to all players in the match
  io.to(match.roomId).emit("arenaStateChanged", safeMatchData);
}

/**
 * Create a new match between two players
 */
function createMatch(player1Id: string, player2Id: string): Match | null {
  const player1Socket = io.sockets.sockets.get(player1Id);
  const player2Socket = io.sockets.sockets.get(player2Id);
  
  if (!player1Socket || !player2Socket) {
    return null;
  }
  
  const matchId = matchCount++;
  const roomId = `match_${matchId}`;
  
  // Create match data
  const match: Match = {
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
    roomId,
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
  const player1Name = `Player ${player1Id.substring(0, 4)}`;
  const player2Name = `Player ${player2Id.substring(0, 4)}`;
  
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
  
  console.log(`Match #${matchId} started between ${player1Name} (${player1Id}) and ${player2Name} (${player2Id})`);
  
  // Also send individualized messages to each player with their socket ID identified
  player1Socket.emit("yourPlayerId", player1Id);
  player2Socket.emit("yourPlayerId", player2Id);
  
  return match;
}

/**
 * Start the timer for a match
 */
function startMatchTimer(match: Match): void {
  // Clear any existing timer
  if (match.timer) {
    clearInterval(match.timer);
  }
  
  // Set up interval for timer updates
  match.timer = setInterval(() => {
    if (match.remainingTime > 0) {
      match.remainingTime--;
      io.to(match.roomId).emit("timerUpdate", { remainingTime: match.remainingTime });
    } else {
      endMatch(match);
    }
  }, 1000);
}

/**
 * End a match and clean up resources
 */
function endMatch(match: Match): void {
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
  const matchId = getMatchIdFromRoomId(match.roomId);
  if (matchId !== null) {
    delete matches[matchId];
  }
  
  console.log(`Match in room ${match.roomId} has ended`);
}

/**
 * Process movement update for a player
 */
function processPlayerMovement(playerId: string, data: any): void {
  // Skip updates that are too frequent
  const now = Date.now();
  const lastUpdate = lastPlayerUpdate.get(playerId) || 0;
  if (now - lastUpdate < UPDATE_THROTTLE) {
    return;
  }
  
  // Update the timestamp
  lastPlayerUpdate.set(playerId, now);
  
  // Get the match for this player
  const match = getMatchForPlayer(playerId);
  if (!match) return;
  
  // Validate data
  if (typeof data !== 'object' || typeof data.x !== 'number' || typeof data.y !== 'number') {
    console.log("Invalid movement data from player", playerId);
    return;
  }
  
  // Update player state based on which player in the match they are
  const isPlayer1 = match.player1.id === playerId;
  const playerState = isPlayer1 ? match.player1 : match.player2;
  
  // Update position
  playerState.x = data.x;
  playerState.y = data.y;
  
  // Update optional properties
  if (data.flipX !== undefined) playerState.flipX = data.flipX;
  if (data.velocityX !== undefined) playerState.velocityX = data.velocityX;
  if (data.velocityY !== undefined) playerState.velocityY = data.velocityY;
  if (data.isDodging !== undefined) playerState.isDodging = data.isDodging; // Add dodge state handling
  
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
    playerState.animState = {
      ...playerState.animState,
      idle: !!data.animState.idle,
      running: !!data.animState.running,
      jumping: !!data.animState.jumping,
      falling: !!data.animState.falling,
      attacking: !!data.animState.attacking,
      crouching: !!data.animState.crouching,
      isMoving: !!data.animState.isMoving,
      onGround: data.animState.onGround !== false, // Default to true
      doubleJumping: !!data.animState.doubleJumping,
      isDodging: !!data.animState.isDodging, // Add dodge state to animState
    };
  }
  
  // Broadcast updated state to all players in the match
  broadcastMatchState(match);
  
  // Also emit a direct movement update that other clients can use
  const playerData = {
    id: playerId,
    x: data.x,
    y: data.y,
    animation: data.animation,
    flipX: data.flipX,
    velocityX: data.velocityX,
    velocityY: data.velocityY,
    isDodging: data.isDodging, // Include dodge state in the broadcast
    animState: data.animState ? { ...data.animState } : undefined,
    soundEvent: data.soundEvent || null
  };
  
  // Send to all other clients in the room
  io.to(match.roomId).emit("playerMoved", playerData);
}

/**
 * Handle cleanup when a player disconnects
 */
function handlePlayerDisconnect(playerId: string): void {
  console.log(`Player disconnected: ${playerId}`);
  
  // Remove from waiting list
  waitingUsers = waitingUsers.filter(id => id !== playerId);
  
  // Check if player was in a match
  const matchId = playerToMatch.get(playerId);
  if (matchId !== undefined && matches[matchId]) {
    const match = matches[matchId];
    
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
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle player movement updates
  socket.on("playerMovement", (data) => {
    processPlayerMovement(socket.id, data);
  });

  // Handle attack notifications
  socket.on("playerAttack", (data) => {
    const match = getMatchForPlayer(socket.id);
    if (!match) return;
    
    // Add the socket ID and match info to the data
    const attackData = {
      ...data,
      id: socket.id,
      matchId: getMatchIdFromRoomId(match.roomId)
    };
    
    // Broadcast the attack to other players in the match
    socket.to(match.roomId).emit("playerAttack", attackData);
  });

  // Handle player joining the game
  socket.on("playerJoined", (data) => {
    console.log(`Player ${socket.id} joined at position:`, data.x, data.y);
    
    // Let the client know about other players
    socket.emit("currentPlayers", {
      [socket.id]: {
        id: socket.id,
        x: data.x,
        y: data.y,
        animation: data.animation || '_Idle_Idle'
      }
    });
    
    // Notify all other clients about the new player
    socket.broadcast.emit("newPlayer", {
      id: socket.id,
      x: data.x,
      y: data.y,
      animation: data.animation || '_Idle_Idle'
    });
  });

  // Handle match finding
  socket.on("findMatch", () => {
    console.log(`Player ${socket.id} is looking for a match`);

    // Ensure player is only in waiting list once
    waitingUsers = [...new Set([...waitingUsers, socket.id])];

    // Check if we have enough players to start a match
    if (waitingUsers.length >= MAX_PLAYERS_PER_MATCH) {
      // Get the first two waiting players
      const player1 = waitingUsers.shift();
      const player2 = waitingUsers.shift();

      if (player1 && player2) {
        createMatch(player1, player2);
      }
    }
  });

  // Handle disconnections
  socket.on("disconnect", () => {
    handlePlayerDisconnect(socket.id);
  });
});

// Start the server
server.listen(PORT, () => console.log(`Socket.IO Server running on port ${PORT}`));
