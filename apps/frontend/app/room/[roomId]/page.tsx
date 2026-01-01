"use client";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export default function RoomPage() {
  const params = useParams();
  const roomId = params.roomId as string;
  const [code, setCode] = useState("");
  const isLocalChange = useRef(false);

  useEffect(() => {
    console.log("page loaded");
    socket = io("http://localhost:3001", {
      transports: ["websocket"],
    });
    socket.on("connect", () => {
      console.log("Connected:", socket?.id);
      socket?.emit("join_room", { roomId });
    });
    socket.emit("room_state", (data: { code: string }) => {
      setCode(data.code);
    });
    socket.on("code_change", (data: { code: string }) => {
      if (!isLocalChange.current) setCode(data.code);
    });
    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, [roomId]);
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    console.log(newCode);
    setCode(newCode);

    socket?.emit("code_change", {
      roomId,
      code: newCode,
    });
  };
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <h1 className="text-xl font-semibold mb-4">
        Room: <span className="text-emerald-400">{roomId}</span>
      </h1>

      <textarea
        className="w-full h-[70vh] bg-slate-900 border border-slate-700 rounded-md p-4 font-mono text-sm outline-none focus:ring-2 focus:ring-emerald-500"
        value={code}
        onChange={handleChange}
        placeholder="// Type here. Open this room in another tab."
      />
    </main>
  );
}
