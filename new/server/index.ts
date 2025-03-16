import { createServer } from "http";
import { Server } from "socket.io";
import { MATCHES, PLAYER_MATCH } from "./states";
import { Match } from "./types";

// Constants for configuration
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
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

// Maps to store match data and waiting users
let matchCount = 0;
let waitingUsers: string[] = [];

// Map of player IDs to their match IDs for quick lookups

// Track last update timestamp per player to throttle updates
const lastPlayerUpdate: Map<string, number> = new Map();

/**
 * Extract match ID from room ID string
 */
function getMatchIdFromRoomId(roomId: string): number | null {
  if (!roomId) return null;
  const parts = roomId.split("_");
  if (parts.length !== 2 || parts[0] !== "match") return null;
  return Number(parts[1]);
}

/**
 * Send current match state to players
 */
function broadcastMatchState(match: Match): void {
  // Create a sanitized version of the match state to send to clients
  const safeMatchData = {
    player1: { ...match.player1 },
    player2: { ...match.player2 },
    roomId: match.roomId,
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
      connected: false,
    },
    player2: {
      id: player2Id,
      connected: false,
    },
    roomId,
    timer: null,
    remainingTime: MATCH_DURATION,
  };

  // Store the match
  MATCHES[matchId] = match;

  // Add players to the match room
  player1Socket.join(roomId);
  player2Socket.join(roomId);

  // Set up quick lookup from player ID to match ID
  PLAYER_MATCH.set(player1Id, matchId);
  PLAYER_MATCH.set(player2Id, matchId);

  // Start match timer
  // startMatchTimer(match);

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
        position: "left",
      },
      player2: {
        id: player2Id,
        name: player2Name,
        position: "right",
      },
    },
  });

  console.log(
    `Match #${matchId} started between ${player1Name} (${player1Id}) and ${player2Name} (${player2Id})`
  );

  // Also send individualized messages to each player with their socket ID identified
  player1Socket.emit("yourPlayerId", player1Id);
  player2Socket.emit("yourPlayerId", player2Id);

  return match;
}

// Socket event handlers
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("playerMoved", (data) => {
    const matchId = PLAYER_MATCH.get(socket.id);

    if (!matchId) {
      return;
    }

    const match = MATCHES[matchId];

    if (!match) {
      return;
    }

    const currentPlayerId = socket.id;

    if (match.player1.id == currentPlayerId) {
      match.player1.connected = true;
      match.player1.x = data.x;
      match.player1.y = data.y;
      match.player1.velocityX = data.velocityX;
      match.player1.velocityY = data.velocityY;
      match.player1.flipX = data.flipX;
    }

    if (match.player2.id == currentPlayerId) {
      match.player2.connected = true;
      match.player2.x = data.x;
      match.player2.y = data.y;
      match.player2.velocityX = data.velocityX;
      match.player2.velocityY = data.velocityY;
      match.player2.flipX = data.flipX;
    }

    console.log({
      id: currentPlayerId,
      x: data.x,
      y: data.y,
      velocityX: data.velocityX,
      velocityY: data.velocityY,
      flipX: data.flipX,
    });

    io.to(match.roomId).emit("playerMoved", {
      id: currentPlayerId,
      x: data.x,
      y: data.y,
      velocityX: data.velocityX,
      velocityY: data.velocityY,
      flipX: data.flipX,
    });

    console.log(match.roomId);
  });

  socket.on("playerReady", (data) => {
    const matchId = PLAYER_MATCH.get(socket.id);

    if (!matchId) {
      return;
    }

    const match = MATCHES[matchId];

    if (!match) {
      return;
    }

    const currentPlayerId = socket.id;

    if (match.player1.id == currentPlayerId) {
      match.player1.connected = true;
      match.player1.x = data.player1.x;
      match.player1.y = data.player1.y;
    }

    if (match.player2.id == currentPlayerId) {
      match.player2.connected = true;
      match.player2.x = data.player2.x;
      match.player2.y = data.player2.y;
    }

    if (match.player2.connected && match.player1.connected) {
      io.to(match.roomId).emit("playersConnected", {
        room: match.roomId,
        player1: {
          position: "left",
          flipX: false,
          ...match.player1,
        },
        player2: {
          position: "right",
          flipX: true,

          ...match.player2,
        },
      });

      console.log(match.roomId);
    }
  });

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
    // handlePlayerDisconnect(socket.id);
  });
});

// Start the server
server.listen(PORT, () =>
  console.log(`Socket.IO Server running on port ${PORT}`)
);
