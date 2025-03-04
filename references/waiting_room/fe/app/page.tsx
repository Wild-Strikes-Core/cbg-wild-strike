"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
export default function Home() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [room, setRoom] = useState<string | null>(null);
  const [player1, setPlayer1] = useState<string | null>(null);
  const [player2, setPlayer2] = useState<string | null>(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // useEffect(() => {
  //   const newSocket = io("http://localhost:3001"); // Connect to the Node.js WebSocket server

  //   newSocket.on("paired", (roomId) => {
  //     setRoom(roomId);
  //     setMessages([]);
  //   });

  //   newSocket.on("message", ({ sender, message }) => {
  //     setMessages((prev) => [...prev, { sender, text: message }]);
  //   });

  //   setSocket(newSocket);
  //   return () => newSocket.disconnect();
  // }, []);

  useEffect(() => {
    const newSocket = io("http://localhost:3001");

    newSocket.on("matchFound", ({ room, player1, player2 }) => {
      console.log("Match Found");
      setRoom(room);
      setPlayer1(player1);
      setPlayer2(player2);
      console.log("Room", room);
      console.log("Player 1", player1);
      console.log("Player 2", player2);
    });

    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const onFindMatch = () => {
    socket!.emit("findMatch");
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <button onClick={onFindMatch}>Find Match</button>
    </div>
  );
}
