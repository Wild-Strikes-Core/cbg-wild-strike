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
    animState?: string;
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
    animState?: string;
  };
  roomId: string;
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
      
      // Update animState if provided
      if (data.animState) {
        currentMatch.player1.animState = data.animState;
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
      
      if (data.animState) {
        currentMatch.player2.animState = data.animState;
      }
    }

    // Broadcast updated match state to both players
    // Include full animation state in updates
    io.to(currentRoomId).emit("arenaStateChanged", { ...currentMatch });
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
          x: 608,
          y: 752,
          id: player2,
        },
        roomId: room,
      };

      if (player1 && player2) {
        io.sockets.sockets.get(player1)?.join(room);
        io.sockets.sockets.get(player2)?.join(room);
      }

      console.log("Player 1", player1);
      console.log("Player 2", player2);
      console.log(`Match #${numberOfMatches} has started`);

      numberOfMatches++;

      console.log(matches);
      console.log(numberOfMatches);

      io.to(room).emit("matchFound", { room, player1, player2 });
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

    // Remove from waiting list if user disconnects~

    // When user is in match then disconnects
    const tempMatches = Object.entries(matches);

    for (let i: number = 0; i < tempMatches.length; i++) {
      const currentMatchState: any = tempMatches[i][1];
      const currentMatchId: any = tempMatches[i][0];
      console.log(currentMatchState.player1);
      console.log(currentMatchState.player2);

      if (socket.id == currentMatchState.player1) {
        console.log("Player 2 Won");

        delete matches[currentMatchId];
      }

      if (socket.id == currentMatchState.player2) {
        console.log("Player 1 Won");
        delete matches[currentMatchId];
      }
      console.log(`Match #${currentMatchId} has ended`);
    }
  });
});

server.listen(3001, () => console.log("Socket.IO Server running on port 3001"));
