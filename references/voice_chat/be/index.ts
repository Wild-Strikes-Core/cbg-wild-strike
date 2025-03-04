import { createServer } from "http";
import { Server } from "socket.io";

const server = createServer();

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("offer", (data) => {
    console.log(data);

    socket.broadcast.emit("offer", data);
  });

  socket.on("answer", (data) => {
    console.log(data);

    socket.broadcast.emit("answer", data);
  });

  socket.on("ice-candidate", (data) => {
    console.log(data);

    socket.broadcast.emit("ice-candidate", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(4000, () => console.log("Socket.IO Server running on port 4000"));
