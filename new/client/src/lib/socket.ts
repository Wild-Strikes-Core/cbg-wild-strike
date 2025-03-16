import { io } from "socket.io-client";

export const SOCKET = io("https://cbg-wild-strike.onrender.com", {
    autoConnect: false, // Prevents auto connection on import
    reconnection: false, // Disables auto-reconnection
});

