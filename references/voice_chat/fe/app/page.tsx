"use client";
import useVoiceChat from "@/hooks/useVoiceChat";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
export default function Home() {
  const { stream } = useVoiceChat();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    if (audioRef.current && stream) {
      audioRef.current.srcObject = stream;
    }
  }, [stream]);
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h2>WebRTC Voice Chat</h2>
      <audio ref={audioRef} autoPlay />
    </div>
  );
}
