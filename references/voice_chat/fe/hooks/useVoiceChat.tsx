import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

export default function useVoiceChat() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    const setupMedia = async () => {
      const localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      setStream(localStream);
    };

    setupMedia();

    peerConnection.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    socket.on("offer", async ({ offer }) => {
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(offer)
        );
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        socket.emit("answer", { answer });
      }
    });

    socket.on("answer", async ({ answer }) => {
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
      }
    });

    socket.on("ice-candidate", ({ candidate }) => {
      if (peerConnection.current) {
        peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return { stream };
}
