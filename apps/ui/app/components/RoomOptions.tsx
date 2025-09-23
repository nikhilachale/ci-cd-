"use client";

import { useState } from "react";

type Props = {
  socket: WebSocket | null;
  player: { username: string } | null;
};

export default function RoomOptions({ socket, player }: Props) {
  const [roomChoice, setRoomChoice] = useState<"create" | "join" | "">("");
  const [showJoinPopup, setShowJoinPopup] = useState(false);
  const [joinRoomName, setJoinRoomName] = useState("");

  // Handle create room
  const handleCreateRoom = () => {
    if (!socket || !player?.username) return;
    setRoomChoice("create");
    socket.send(
      JSON.stringify({
        type: "create_room",
        username: player.username,
      })
    );
  };

  // Handle join room button click
  const handleJoinRoomClick = () => setShowJoinPopup(true);

  // Handle actual join room with entered room name
  const handleConfirmJoinRoom = () => {
    if (!socket || !player?.username || !joinRoomName.trim()) return;
    setRoomChoice("join");
    setShowJoinPopup(false);
    socket.send(
      JSON.stringify({
        type: "join_room",
        roomName: joinRoomName.trim(),
        playerId: "black", // force black
      })
    );
  };

  const handleCancelJoinRoom = () => {
    setShowJoinPopup(false);
    setJoinRoomName("");
  };

  return (
    <div className="relative w-full min-h-screen">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/bg.png')" }}
      />
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative flex items-center justify-center min-h-screen px-8">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-10 shadow-2xl max-w-md w-full text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
            Chess Rooms
          </h1>
          <p className="text-gray-700 mb-6">
            Welcome,{" "}
            <span className="font-semibold text-blue-600">
              {player?.username}
            </span>
            !
          </p>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleCreateRoom}
              disabled={!socket || roomChoice === "create"}
              className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white text-lg font-bold rounded-lg shadow-md transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {roomChoice === "create" ? "Creating Room..." : "Create Room"}
            </button>

            <button
              onClick={handleJoinRoomClick}
              disabled={!socket || roomChoice === "join"}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-lg shadow-md transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {roomChoice === "join" ? "Joining Room..." : "Join Room"}
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            Create a new room or join an existing one
          </p>
        </div>
      </div>

      {/* Join Room Popup */}
      {showJoinPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 shadow-xl flex flex-col gap-4">
            <h2 className="text-xl font-bold text-center">Join Room</h2>
            <p className="text-sm text-gray-600 text-center">
              Enter the room name you want to join
            </p>
            <input
              type="text"
              value={joinRoomName}
              onChange={(e) => setJoinRoomName(e.target.value)}
              className="border-2 border-gray-300 p-3 rounded-lg focus:border-blue-500 focus:outline-none"
              placeholder="Room name (e.g., ABC123)"
              onKeyDown={(e) =>
                e.key === "Enter" && handleConfirmJoinRoom()
              }
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleCancelJoinRoom}
                className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmJoinRoom}
                disabled={!joinRoomName.trim()}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}