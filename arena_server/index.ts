import { createServer } from "http";
import { Server } from "socket.io";

const server = createServer();

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

interface Match {
  player1: {
    id: string;
    x: number;
    y: number;
    animation?: string;
    flipX?: boolean;
    velocityX?: number;
    velocityY?: number;
    isAttacking?: boolean;
    animState?: any;
  };
  player2: {
    id: string;
    x: number;
    y: number;
    animation?: string;
    flipX?: boolean;
    velocityX?: number;
    velocityY?: number;
    isAttacking?: boolean;
    animState?: any;
  };
  roomId: string;
  timer: NodeJS.Timeout | null;
  remainingTime: number;
}

interface Matches {
  [matchId: number]: Match;
}

let matches: Matches = {};
let numberOfMatches = 0;
let waitingsUsers: string[] = [];

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Process player movement updates
  socket.on("playerMovement", (data) => {
    const currentRoomId = [...socket.rooms][1];
    if (!currentRoomId) {
      return;
    }
    
    const matchId = Number(currentRoomId.split("_")[1]);
    const currentMatch = matches[matchId];
    
    if (!currentMatch) {
      return;
    }

    const currentPlayer = socket.id;
    
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
      if (data.flipX !== undefined) currentMatch.player1.flipX = data.flipX;
      if (data.velocityX !== undefined) currentMatch.player1.velocityX = data.velocityX;
      if (data.velocityY !== undefined) currentMatch.player1.velocityY = data.velocityY;
      
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
      
      if (data.flipX !== undefined) currentMatch.player2.flipX = data.flipX;
      if (data.velocityX !== undefined) currentMatch.player2.velocityX = data.velocityX;
      if (data.velocityY !== undefined) currentMatch.player2.velocityY = data.velocityY;
      
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
    const safeMatchData = {
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
    const playerData = {
      id: socket.id,
      x: data.x,
      y: data.y,
      animation: data.animation,
      flipX: data.flipX,
      velocityX: data.velocityX,
      velocityY: data.velocityY,
      animState: data.animState && typeof data.animState === 'object' ? { ...data.animState } : undefined
    };
    
    // Send to all other clients in the room
    socket.to(currentRoomId).emit("playerMoved", playerData);
  });

  // Handle direct attack notifications
  socket.on("playerAttack", (data) => {
    const currentRoomId = [...socket.rooms][1];
    if (!currentRoomId) {
      // Player not in a room, ignore
      return;
    }
    
    const matchId = Number(currentRoomId.split("_")[1]);
    const currentMatch = matches[matchId];
    
    if (!currentMatch) {
      // Match not found, ignore
      return;
    }
    
    // Add the socket ID and match info to the data
    const attackData = {
      ...data,
      id: socket.id,
      matchId
    };
    
    // Broadcast the attack to the other player in the room
    socket.to(currentRoomId).emit("playerAttack", attackData);
    
    console.log(`Player ${socket.id} attacked with type: ${data.attackType || 'unknown'}`);
  });

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

  // Add this helper function to safely serialize objects that may contain circular references
  function safeStringify(obj: any): string {
    const seen = new WeakSet();
    return JSON.stringify(obj, (key, value) => {
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

  socket.on("findMatch", (data) => {
    console.log("Finding match");

    waitingsUsers = [...new Set<string>([...waitingsUsers, socket.id])];

    if (waitingsUsers.length >= 2) {
      const player1 = waitingsUsers.pop();
      const player2 = waitingsUsers.pop();

      const room = `match_${numberOfMatches}`;

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
          x: 900,  // Position player 2 a bit to the right
          y: 752,
          id: player2,
        },
        roomId: room,
        timer: null,
        remainingTime: 120 // 2 minutes in seconds
      };

      if (player1 && player2) {
        io.sockets.sockets.get(player1)?.join(room);
        io.sockets.sockets.get(player2)?.join(room);
      }

      console.log("Player 1", player1);
      console.log("Player 2", player2);
      console.log(`Match #${numberOfMatches} has started`);

      // Start match timer
      const matchId = numberOfMatches;
      matches[matchId].timer = setInterval(() => {
        if (matches[matchId]) {
          matches[matchId].remainingTime--;
          io.to(room).emit("timerUpdate", { remainingTime: matches[matchId].remainingTime });

          if (matches[matchId].remainingTime <= 0) {
            clearInterval(matches[matchId].timer!);
            io.to(room).emit("matchEnded");
            delete matches[matchId];
          }
        }
      }, 1000);

      numberOfMatches++;

      // Use our safe stringify function instead of JSON.stringify directly
      console.log(safeStringify(matches));
      console.log(numberOfMatches);

      // Send only the necessary data to clients
      const matchData = {
        room,
        player1: player1,
        player2: player2
      };
      
      io.to(room).emit("matchFound", matchData);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);

    // Remove from waiting list if user disconnects
    waitingsUsers = waitingsUsers.filter((waitingUser: string) => {
      if (waitingUser == socket.id) {
        console.log("user removed from waiting list");
      }
      return waitingUser != socket.id;
    });

    // When user is in match then disconnects
    const tempMatches = Object.entries(matches);

    for (let i: number = 0; i < tempMatches.length; i++) {
      const currentMatchState: any = tempMatches[i][1];
      const currentMatchId: any = tempMatches[i][0];
      
      // Check if this socket was in the match
      if (
        currentMatchState.player1?.id === socket.id || 
        currentMatchState.player2?.id === socket.id
      ) {
        // Notify the other player about the disconnection
        io.to(currentMatchState.roomId).emit("playerDisconnected", socket.id);
        
        // Clean up the match
        if (currentMatchState.timer) {
          clearInterval(currentMatchState.timer);
        }
        delete matches[currentMatchId];
        console.log(`Match #${currentMatchId} has ended due to player disconnection`);
      }
    }
  });
});

server.listen(3001, () => console.log("Socket.IO Server running on port 3001"));
