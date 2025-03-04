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
  player1: string;
  player2: string;
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

  socket.on("findMatch", (data) => {
    waitingsUsers = [...new Set<string>([...waitingsUsers, socket.id])];

    if (waitingsUsers.length >= 2) {
      const player1 = waitingsUsers.pop();
      const player2 = waitingsUsers.pop();

      const room = `match_${numberOfMatches}`;

      if (!player1 || !player2) {
        return;
      }

      matches[numberOfMatches] = {
        player1,
        player2,
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

    // Remove from waiting list if user disconnects

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
