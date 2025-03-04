const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();

// Store player data
const players = {};

const io = new Server(httpServer, {
  cors: {
    origin: "*", // Change this to your frontend URL in production
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Send current players to the newly connected client
  socket.emit("currentPlayers", players);
  
  // Log how many players are currently connected
  console.log(`Total players connected: ${Object.keys(players).length}`);
  console.log("Current players:", Object.keys(players));

  // Handle new player joining
  socket.on("playerJoined", (playerInfo) => {
    console.log(`Player ${socket.id} joined at position:`, playerInfo.x, playerInfo.y);
    
    // Store player info
    players[socket.id] = {
      id: socket.id,
      x: playerInfo.x,
      y: playerInfo.y,
      animation: playerInfo.animation || 'Idle'
    };
    
    // Send list of all current players to the new player
    socket.emit("currentPlayers", players);
    
    // Broadcast the new player to everyone else
    socket.broadcast.emit("newPlayer", {
      id: socket.id,
      ...players[socket.id]
    });
    
    console.log(`After join - Total players: ${Object.keys(players).length}`);
  });

  // Handle player movement
  socket.on("playerMovement", (movementData) => {
    // Update player position in our data
    if (players[socket.id]) {
      players[socket.id].x = movementData.x;
      players[socket.id].y = movementData.y;
      players[socket.id].animation = movementData.animation;
      players[socket.id].flipX = movementData.flipX;
      players[socket.id].velocityX = movementData.velocityX;
      players[socket.id].velocityY = movementData.velocityY;
      
      // Important: emit to ALL clients except sender
      socket.broadcast.emit("playerMoved", {
        id: socket.id,
        ...players[socket.id]
      });
    }
  });

  // Handle player disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    delete players[socket.id];
    io.emit("playerDisconnected", socket.id); // Using io.emit instead of socket.broadcast
    console.log(`After disconnect - Total players: ${Object.keys(players).length}`);
  });
});

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`Arena server running on port ${PORT}`);
});
