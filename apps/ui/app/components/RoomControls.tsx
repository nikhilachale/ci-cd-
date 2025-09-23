"use client";

import { useChessStore } from "../store/chessStore";


export default function RoomControls() {
  const { roomName, setRoomName, socket } = useChessStore();

  const handleCreateRoom = () => {
    socket?.send(JSON.stringify({ type: "create_room" }));
  };

  return (
    <div className="flex flex-row gap-4 w-full">
      <input
        type="text"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        placeholder="Enter room name..."
        className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
      />
      <button
        onClick={handleCreateRoom}
        className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200"
      >
        Create Room
      </button>
    </div>
  );
}