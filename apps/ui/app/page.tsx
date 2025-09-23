"use client";
import { useState } from "react";
import { useChessStore } from "./store/chessStore";

export default function ChessApp() {
  const [showPlayPopup, setShowPlayPopup] = useState(false);
  const { username, setUsername, setPlayer } = useChessStore();

  // --- Play Button Handler ---
  const handlePlay = () => setShowPlayPopup(true);

  const handleConfirmPlay = () => {
    if (!username.trim()) return;
    setShowPlayPopup(false);

    // Set player info
    setPlayer({ username: username.trim(), color: "white" });

    // Redirect to room page with a random room ID

    window.location.href = `/room/${username}`;
  };

  return (
    <div className="relative w-full min-h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/bg.png')" }}
      />
      <div className="absolute inset-0 bg-black/15" />

      <div className="relative flex items-center min-h-screen px-8 md:px-16">
        <div className="text-left max-w-lg z-10">
          <h1 className="text-6xl md:text-7xl font-extrabold text-[#1f1f1f] mb-4">
            Multiplayer Chess
          </h1>
          <p className="text-xl md:text-2xl font-medium text-[#383838] mb-8 drop-shadow-md">
            Play chess online with friends or challenge opponents worldwide in real time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handlePlay}
              className="px-12 py-4 bg-[#383838] hover:bg-blue-700 text-[#e6e6e6] font-bold rounded-lg shadow-lg transition duration-200 text-xl"
            >
              Play
            </button>
          </div>
        </div>
      </div>

      {/* --- Play Popup --- */}
      {showPlayPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 shadow-xl flex flex-col gap-4">
            <h2 className="text-xl font-bold text-center">Enter Username</h2>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border-2 border-gray-300 p-3 rounded-lg focus:border-blue-500 focus:outline-none"
              placeholder="Your username"
              onKeyPress={(e) => e.key === 'Enter' && handleConfirmPlay()}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowPlayPopup(false)}
                className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPlay}
                disabled={!username.trim()}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Play
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}