"use client";

interface Props {
  roomName: string;
  setRoomName: (name: string) => void;
  socket: WebSocket | null;
}

export default function RoomControls({ roomName, setRoomName, socket }: Props) {
  return (
    <div className="flex items-center space-x-2   ">
      <input
        type="text"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        className="rounded-full px-4 py-2 text-amber-900 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 border border-amber-300 transition"
        placeholder="Enter room name"
      />
      <button
        onClick={() => {
          if (socket && roomName) {
            socket.send(JSON.stringify({ type: "join_room", roomName }));
          }
        }}
        className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-2 rounded-full shadow transition-colors duration-200"
      >
        Join
      </button>
    </div>
  );
}