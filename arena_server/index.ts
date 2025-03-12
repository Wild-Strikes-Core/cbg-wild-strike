/**
 * Arena Server - Real-time multiplayer game server using Socket.io
 * Handles player connections, movements, and game state synchronization
 */

import { createServer } from "http";
import { Server } from "socket.io";

/**
 * Represents a player in the game world
 * Contains position, animation state and movement data
 */
interface Player {
  id: string;          // Unique socket ID
  x: number;           // X position in the game world
  y: number;           // Y position in the game world
  animation: string;   // Current animation state (e.g., 'Idle', 'Walk')
  flipX?: boolean;     // Whether sprite is flipped horizontally
  velocityX?: number;  // Horizontal movement speed
  velocityY?: number;  // Vertical movement speed
  isAttacking?: boolean; // Whether player is currently attacking
}

/**
 * Initial player information received when a player joins the game
 */
interface PlayerInfo {
  x: number;           // Initial X position 
  y: number;           // Initial Y position
  animation?: string;  // Optional initial animation state
}

/**
 * Data structure for player movement updates
 */
interface MovementData {
  x: number;
  y: number;
  animation: string;
  flipX: boolean;
  velocityX?: number;
  velocityY?: number;
  isAttacking?: boolean; // Added to track attack state
}

/**
 * Collection of all active players indexed by their socket ID
 */
interface Players {
  [key: string]: Player;
}

// Create HTTP server
const httpServer = createServer();

// In-memory store for all connected players
const players: Players = {};

// Initialize Socket.io with CORS configuration
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow connections from any origin (consider restricting in production)
    methods: ["GET", "POST"],
  },
});

// Handle new socket connections
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  
  // Send current game state to the newly connected client
  socket.emit("currentPlayers", players);
  
  console.log(`Total players connected: ${Object.keys(players).length}`);
  console.log("Current players:", Object.keys(players));
  
  // Handle new player joining the game
  socket.on("playerJoined", (playerInfo) => {
    console.log(`Player ${socket.id} joined at position:`, playerInfo.x, playerInfo.y);
    
    // Create and store new player data
    players[socket.id] = {
      id: socket.id,
      x: playerInfo.x,
      y: playerInfo.y,
      animation: playerInfo.animation || 'Idle', // Default to Idle animation if not specified
      isAttacking: false // Initialize attack state to false
    };
    
    // Initialize the new player with the complete game state
    socket.emit("currentPlayers", players);
    
    // Notify all other players about the new player
    socket.broadcast.emit("newPlayer", players[socket.id]);
    
    console.log(`After join - Total players: ${Object.keys(players).length}`);
  });

  // Process player movement updates
  socket.on("playerMovement", (movementData) => {
    // Only update if the player exists
    if (players[socket.id]) {
      // Update the player's state with the latest data
      players[socket.id].x = movementData.x;
      players[socket.id].y = movementData.y;
      players[socket.id].animation = movementData.animation;
      players[socket.id].flipX = movementData.flipX;
      
      // Update velocities if provided
      if (movementData.velocityX !== undefined) {
        players[socket.id].velocityX = movementData.velocityX;
      }
      if (movementData.velocityY !== undefined) {
        players[socket.id].velocityY = movementData.velocityY;
      }
      
      // Update the attack state if provided
      if (movementData.isAttacking !== undefined) {
        players[socket.id].isAttacking = movementData.isAttacking;
        console.log(`Player ${socket.id} attack state: ${movementData.isAttacking}`);
      }
      
      // Broadcast the updated position to all other players
      socket.broadcast.emit("playerMoved", players[socket.id]);
    }
  });

  // Clean up when a player disconnects
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    
    // Remove the player from the game state
    delete players[socket.id];
    
    // Notify all clients (including new connections) about the disconnected player
    io.emit("playerDisconnected", socket.id);
    
    console.log(`After disconnect - Total players: ${Object.keys(players).length}`);
  });
});

// Start the server
const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`Arena server running on port ${PORT}`);
});
