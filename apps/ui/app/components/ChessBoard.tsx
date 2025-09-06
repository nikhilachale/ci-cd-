"use client";
import ChessSquare from "./ChessSquare";
import PieceIcon from "./PieceIcon";

interface Props {
  board: string[][];
  canMove: { x: number; y: number }[];
  selectedPiece: { x: number; y: number } | null;
  onSquareClick: (row: number, col: number) => void;
}

export default function ChessBoard({ board, canMove, selectedPiece, onSquareClick }: Props) {
  return (
    <div className="grid grid-cols-8 border-4 border-yellow-800 rounded-xl">
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => {
          const isBlack = (rowIndex + colIndex) % 2 === 1;
          const isSelected = selectedPiece?.x === rowIndex && selectedPiece?.y === colIndex;
          const isAvailableMove = canMove.some(move => move.x === rowIndex && move.y === colIndex);

          return (
            <ChessSquare
              key={`${rowIndex}-${colIndex}`}
              isBlack={isBlack}
              isSelected={isSelected}
              isAvailableMove={isAvailableMove}
              onClick={() => onSquareClick(rowIndex, colIndex)}
            >
              {piece && <PieceIcon piece={piece} />}
            </ChessSquare>
          );
        })
      )}
    </div>
  );
}