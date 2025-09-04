"use client"
import { useEffect, useState } from "react";
import { Crown, Shield, Castle, Zap, Mountain } from "lucide-react";

// Initial board setup with FEN-style simplified representation
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

// Map pieces to image paths (replace with your public images)
const pieceImages: Record<string, string> = {
  r: "/pieces/br.png",
  n: "/pieces/bn.png",
  b: "/pieces/bb.png",
  q: "/pieces/bq.png",
  k: "/pieces/bk.png",
  p: "/pieces/bp.png",
  R: "/pieces/wr.png",
  N: "/pieces/wn.png",
  B: "/pieces/wb.png",
  Q: "/pieces/wq.png",
  K: "/pieces/wk.png",
  P: "/pieces/wp.png",
};

// Helper function to convert matrix coordinates to chess notation
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
  const [lastMove, setLastMove] = useState<
    {
      fromPlayer: string;
      piece: string;
      from: { x: number; y: number };
      to: { x: number; y: number };
      captured?: string;
    }[]
  >([]);

  const checkmove = (row: number, col: number) => {
    if (selectedPiece) {
      // If clicked the selected piece, do nothing
      if (selectedPiece.x === row && selectedPiece.y === col) {
        return;
      }
      // If clicked a square in canMove, send make_move
      if (canMove.some(move => move.x === row && move.y === col) && socket) {
        socket.send(JSON.stringify({ type: "make_move", roomName: roomName, from: selectedPiece, to: { x: row, y: col } }));
        setSelectedPiece(null);
        setCanMove([]);
        return;
      }
      // Otherwise, select a new piece if there's a piece on that square
      if (board[row][col]) {
        if (socket) {
          socket.send(JSON.stringify({ type: "can_move", roomName: roomName, index: { row, col } }));
          setSelectedPiece({ x: row, y: col });
        }
      } else {
        // Clicked empty square that is not in canMove, reset selection
        setSelectedPiece(null);
        setCanMove([]);
      }
    } else {
      // No piece selected yet, select if there's a piece on that square
      if (board[row][col] && socket) {
        socket.send(JSON.stringify({ type: "can_move", roomName: roomName, index: { row, col } }));
        setSelectedPiece({ x: row, y: col });
      }
    }
  };

  // Internal function to get piece icon with color based on piece type
  const getPieceIcon = (piece: string, size: number) => {
    const isWhite = piece === piece.toUpperCase();
    const colorClass = isWhite ? "text-yellow-200 drop-shadow-lg" : "text-gray-800 drop-shadow-lg";
    const whiteKingColor = "yellow";
    const whiteQueenColor = "purple";

    switch (piece.toLowerCase()) {
      case "k":
        // King: Crown icon, yellow fill if white, black fill if black
        return (
          <Crown
            size={48}
            className={colorClass}
            fill={isWhite ? whiteKingColor : "black"}
            strokeWidth={2}
          />
        );
      case "q":
        // Queen: Crown icon, purple fill if white, black fill if black
        return (
          <Crown
            size={48}
            className={colorClass}
            fill={isWhite ? whiteQueenColor : "black"}
            strokeWidth={2}
          />
        );
      case "r":
        // Rook: Castle icon
        return <Castle size={48} className={colorClass} />;
      case "b":
        // Bishop: Mountain icon
        return <Mountain size={48} className={colorClass} />;
      case "n":
        // Knight: Zap icon
        return <Zap size={48} className={colorClass} />;
      case "p":
        // Pawn: Shield icon
        return <Shield size={48} className={colorClass} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    setSocket(ws);

    ws.onopen = () => {
      console.log("WebSocket connection established");
      ws.send(JSON.stringify({ type: "create_room" }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("data recieved :", data);
      if (data.type === "room_created") {
        setroomName(data.roomName);
        console.log("Room created:", data.roomName);
      }
      if (data.type === "available_moves") {
        setCanMove(data.moves);
        console.log("Available moves:", data.moves);
      }
      if (data.type === "move_made") {
        setBoard(data.board);
        setCanMove([]);
        setSelectedPiece(null);
        // Append last move info and limit to last 10 moves
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
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="flex flex-col items-center p-8 bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 min-h-screen">
      <h1 className="text-6xl font-extrabold text-yellow-900 mb-8 drop-shadow-xl tracking-wide">CHESS</h1>

      <div className="flex flex-row items-start gap-10">
        <div className="grid grid-cols-8 border-4 border-yellow-800 shadow-xl rounded-xl p-2 bg-yellow-50">
          {board.map((row, rowIndex) =>
            row.map((piece, colIndex) => {
              const isBlack = (rowIndex + colIndex) % 2 === 1;
              const isSelected = selectedPiece?.x === rowIndex && selectedPiece?.y === colIndex;
              const isAvailableMove = canMove.some(move => move.x === rowIndex && move.y === colIndex);
              return (
                <div
                  onClick={() => checkmove(rowIndex, colIndex)}
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-20 h-20 flex items-center justify-center cursor-pointer transition-shadow duration-300 rounded-md shadow-sm
              ${isBlack ? "bg-yellow-700" : "bg-amber-100"}
              ${isSelected ? "ring-4 ring-yellow-400 ring-opacity-80 shadow-yellow-400/70" : ""}
              ${!isSelected && isAvailableMove ? "ring-4 ring-green-400 ring-opacity-80 shadow-green-400/70" : ""}
              hover:shadow-lg hover:ring-2 hover:ring-yellow-300
            `}
                >
                  {piece && getPieceIcon(piece, 48)}
                </div>
              );
            })
          )}
        </div>

        <div className="w-96 overflow-x-auto shadow-lg rounded-xl bg-yellow-50 p-4 border border-yellow-300">
          <table className="min-w-full border border-yellow-300 text-yellow-900 text-center rounded-md">
            <thead className="bg-yellow-700 text-yellow-100 rounded-t-md">
              <tr>
                <th className="border border-yellow-400 px-4 py-2 font-semibold tracking-wide">Piece</th>
                <th className="border border-yellow-400 px-4 py-2 font-semibold tracking-wide">From</th>
                <th className="border border-yellow-400 px-4 py-2 font-semibold tracking-wide">To</th>
                <th className="border border-yellow-400 px-4 py-2 font-semibold tracking-wide">Captured</th>
              </tr>
            </thead>
            <tbody>
              {lastMove.length === 0 ? (
                <tr className="bg-yellow-100 text-yellow-800">
                  <td colSpan={4} className="border border-yellow-400 px-4 py-3 italic">No moves made yet</td>
                </tr>
              ) : (
                lastMove.map((move, index) => (
                  <tr key={index} className="even:bg-yellow-100 odd:bg-yellow-200 hover:bg-yellow-300 hover:text-yellow-900 transition-colors duration-200 cursor-pointer shadow-sm">
                    <td className="border border-yellow-400 px-4 py-2">{move.piece}</td>
                    <td className="border border-yellow-400 px-4 py-2">{toChessNotation(move.from)}</td>
                    <td className="border border-yellow-400 px-4 py-2">{toChessNotation(move.to)}</td>
                    <td className="border border-yellow-400 px-4 py-2">{move.captured ?? "-"}</td>
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