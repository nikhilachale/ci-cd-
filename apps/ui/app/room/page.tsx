"use client";
import { useState } from "react";


function RoomPageContent() {

  const [roomCode, setRoomCode] = useState("");


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-200 via-gray-300 to-gray-500 px-4">
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 drop-shadow-md">
        Waiting for other players...
      </h2>
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-gray-200 p-6 rounded-xl shadow-lg border border-gray-300">
        <input
          type="text"
          placeholder="Enter room code"
          className="px-4 py-2 w-64 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
        />
        
        
      </div>
    </div>
  )
}

export default function Page() {
  return (

      <RoomPageContent />

  );
}
