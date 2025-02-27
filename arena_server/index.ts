import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();

let players: any = {};

const io = new Server(httpServer, {
  cors: {
    origin: "*", // Change this to your frontend URL for security
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.emit("currentPlayers", players);

  socket.on("newPlayer", (data) => {
    players[socket.id] = { id: socket.id, x: data.x, y: data.y };

    console.log(players[socket.id]);

    io.emit("newPlayer", players); // Broadcast to all clients
  });

  //   socket.on("playerMove", (data) => {
  //     players[socket.id] = {
  //       ...players[socket.id],
  //       id: socket.id,
  //       x: data.x,
  //       y: data.y,
  //     };

  //     console.log(players[socket.id]);

  //     socket.broadcast.emit("playerMove", players[socket.id]); // Broadcast to all clients
  //   });

  socket.on("disconnect", () => {
    delete players[socket.id];
    console.log("A user disconnected:", socket.id);
    socket.broadcast.emit("playerDisconnected", socket.id);
  });
});

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
