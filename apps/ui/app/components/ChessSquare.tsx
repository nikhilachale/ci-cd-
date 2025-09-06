"use client";
import { ReactNode } from "react";

interface Props {
  isBlack: boolean;
  isSelected: boolean;
  isAvailableMove: boolean;
  onClick: () => void;
  children?: ReactNode;
}

export default function ChessSquare({ isBlack, isSelected, isAvailableMove, onClick, children }: Props) {
  return (
    <div
      onClick={onClick}
      className={`w-20 h-20 flex items-center justify-center cursor-pointer
        ${isBlack ? "bg-yellow-700" : "bg-amber-100"}
        ${isSelected ? "ring-4 ring-yellow-400" : ""}
        ${!isSelected && isAvailableMove ? "ring-4 ring-green-400" : ""}`}
    >
      {children}
    </div>
  );
}