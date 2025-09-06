"use client"
import { useEffect, useState } from "react";
import { Crown, Shield, Castle, Zap, Mountain } from "lucide-react";

const initialBoard = [
  ["r", "n", "b", "q", "k", "b", "n", "r"],
  ["p", "p", "p", "p", "p", "p", "p", "p"],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["P", "P", "P", "P", "P", "P", "P", "P"],
  ["R", "N", "B", "Q", "K", "B", "N", "R"]
];

const toChessNotation = ({ x, y }: { x: number; y: number }) => {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
  return `${files[y]}${ranks[x]}`;
};

export default function Home() {
  const [board, setBoard] = useState(initialBoard);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [canMove, setCanMove] = useState<{ x: number; y: number }[]>([]);
  const [roomName, setroomName] = useState<string>("");
  const [selectedPiece, setSelectedPiece] = useState<{ x: number; y: number } | null>(null);
  interface Move {
    fromPlayer: string;
    piece: string;
    from: { x: number; y: number };
    to: { x: number; y: number };
    captured?: string;
  }


  const [lastMove, setLastMove] = useState<Move[]>([]);
  const [playerId, setPlayerId] = useState<"white" | "black" | null>(null);
  const [currentTurn, setCurrentTurn] = useState<"white" | "black" | null>(null);

  const checkmove = (row: number, col: number) => {
    if (!playerId || currentTurn !== playerId) {
      return; // clicks disabled when not your turn
    }

    if (selectedPiece) {
      if (selectedPiece.x === row && selectedPiece.y === col) return;

      if (canMove.some(move => move.x === row && move.y === col) && socket) {
        socket.send(JSON.stringify({
          type: "make_move",
          roomName,
          playerId,
          from: selectedPiece,
          to: { x: row, y: col }
        }));
        setSelectedPiece(null);
        setCanMove([]);
        return;
      }

      if (board[row][col]) {
        if (socket) {
          socket.send(JSON.stringify({ type: "can_move", roomName, playerId, index: { row, col } }));
          setSelectedPiece({ x: row, y: col });
        }
      } else {
        setSelectedPiece(null);
        setCanMove([]);
      }
    } else {
      if (board[row][col] && socket) {
        socket.send(JSON.stringify({ type: "can_move", roomName, playerId, index: { row, col } }));
        setSelectedPiece({ x: row, y: col });
      }
    }
  };

  const getPieceIcon = (piece: string) => {
    const isWhite = piece === piece.toUpperCase();
    const colorClass = isWhite ? "text-yellow-200" : "text-gray-800";
    switch (piece.toLowerCase()) {
      case "k": return <Crown size={42} className={colorClass} fill={isWhite ? "yellow" : "black"} />;
      case "q": return <Crown size={42} className={colorClass} fill={isWhite ? "purple" : "black"} />;
      case "r": return <Castle size={42} className={colorClass} />;
      case "b": return <Mountain size={42} className={colorClass} />;
      case "n": return <Zap size={42} className={colorClass} />;
      case "p": return <Shield size={42} className={colorClass} />;
      default: return null;
    }
  };

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    setSocket(ws);

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "create_room" })); // creator is white
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received:", data);
      if (data.type === "room_created") {
        setroomName(data.roomName);
        setPlayerId("white");
        setCurrentTurn("white");
      }
      if (data.type === "room_joined") {
        setPlayerId("black");
         setroomName(data.roomName);
        setCurrentTurn("white");
      }
      if (data.type === "available_moves") {
        setCanMove(data.moves);
      }
      if (data.type === "move_made") {
        setBoard(data.board);
        setCanMove([]);
        setSelectedPiece(null);
        setLastMove(prev => {
          const newMoves = [...prev, {
            fromPlayer: data.fromPlayer,
            piece: data.piece,
            from: data.from,
            to: data.to,
            captured: data.captured,
          }];
          return newMoves.slice(-10);
        });
        setCurrentTurn(data.turn);
      }
    };

    return () => ws.close();
  }, []);

  return (
    <div className="flex flex-col items-center p-8 bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 min-h-screen">
      <h1 className="text-6xl font-extrabold text-yellow-900 mb-4">CHESS</h1>

      <div className="mb-6 text-xl font-semibold">
        {currentTurn === playerId ? "👉 Your Turn" : "⏳ Waiting for Opponent"}
      </div>

      <div>
        <input type="text"
         value={roomName}
         onChange={(e) => setroomName(e.target.value)}
        />
        <button onClick={()=>{
          if(socket && roomName){
            socket.send(JSON.stringify({ type: "join_room", roomName }));
          }
        }}> join</button>
      </div>
      <div className="flex flex-row items-start gap-10">
        <div className="grid grid-cols-8 border-4 border-yellow-800 rounded-xl">
          {board.map((row, rowIndex) =>
            row.map((piece, colIndex) => {
              const isBlack = (rowIndex + colIndex) % 2 === 1;
              const isSelected = selectedPiece?.x === rowIndex && selectedPiece?.y === colIndex;
              const isAvailableMove = canMove.some(move => move.x === rowIndex && move.y === colIndex);
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => checkmove(rowIndex, colIndex)}
                  className={`w-20 h-20 flex items-center justify-center cursor-pointer
                    ${isBlack ? "bg-yellow-700" : "bg-amber-100"}
                    ${isSelected ? "ring-4 ring-yellow-400" : ""}
                    ${!isSelected && isAvailableMove ? "ring-4 ring-green-400" : ""}`}
                >
                  {piece && getPieceIcon(piece)}
                </div>
              );
            })
          )}
        </div>

        <div className="w-96 shadow-lg rounded-xl bg-yellow-50 p-4 border border-yellow-300">
          <table className="min-w-full border border-yellow-300 text-yellow-900 text-center">
            <thead className="bg-yellow-700 text-yellow-100">
              <tr>
                <th className="border px-4 py-2">Piece</th>
                <th className="border px-4 py-2">From</th>
                <th className="border px-4 py-2">To</th>
                <th className="border px-4 py-2">Captured</th>
              </tr>
            </thead>
            <tbody>
              {lastMove.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-3 italic">No moves yet</td>
                </tr>
              ) : (
                lastMove.map((move, i) => (
                  <tr key={i} className="odd:bg-yellow-100 even:bg-yellow-200">
                    <td className="border px-2 py-1">{move.piece}</td>
                    <td className="border px-2 py-1">{toChessNotation(move.from)}</td>
                    <td className="border px-2 py-1">{toChessNotation(move.to)}</td>
                    <td className="border px-2 py-1">{move.captured ?? "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}