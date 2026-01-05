"use client";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import CodeEditor from "@/app/components/Editor";

export default function RoomPage() {
  const socketRef = useRef<Socket | null>(null);
  const params = useParams();
  const roomId = params.roomId as string;
  const [code, setCode] = useState("");
  const isLocalChange = useRef(false);

  useEffect(() => {
    // To handle unmount behaviour of React(use this instead of global behaviour)
    if (socketRef.current) return;
    console.log("page loaded");
    socketRef.current = io("http://localhost:3001", {
      transports: ["websocket"],
    });
    socketRef.current.on("connect", () => {
      console.log("Connected:", socketRef.current?.id);
      socketRef.current?.emit("join_room", { roomId });
    });
    socketRef.current.emit("room_state", (data: { code: string }) => {
      setCode(data.code);
    });
    socketRef.current.on("code_change", (data: { code: string }) => {
      if (!isLocalChange.current) setCode(data.code);
    });
    return () => {
      //optional in dev, REQUIRED in prod
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [roomId]);
  const handleChange = (value: string) => {
    setCode(value);
    socketRef.current?.emit("code_change", {
      roomId,
      code: value,
    });
  };
  return (
    <>
      <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
        <h1 className="text-xl font-semibold mb-4">
          Room: <span className="text-emerald-400">{roomId}</span>
        </h1>
        <div className="flex gap-2 h-[70vh]">
          <CodeEditor code={code} onChange={handleChange} />
          <aside className="w-80 border border-red-800 rounded-md p-4 text-sm text-slate-400">
            <p className="font-semibold mb-2">Interview Panel</p>
            <p>Chat, hints, AI feedback coming next.</p>
          </aside>
        </div>
      </main>
    </>
  );
}
