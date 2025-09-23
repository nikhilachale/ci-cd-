"use client";
import { ReactNode } from "react";

interface Props {
  isBlack: boolean;
  isSelected: boolean;
   check: "white" | "black" | null;
  isAvailableMove: boolean;
  onClick: () => void;
  children?: ReactNode;
}

export default function ChessSquare({ isBlack, check, isSelected, isAvailableMove, onClick, children }: Props) {
  return (
    <div
      onClick={onClick}
      className={`
        w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24
        flex items-center justify-center cursor-pointer
         transition-all duration-200
        ${check && (check === "white" ? !isBlack : isBlack) ? "ring-4 ring-red-500" : ""}
        ${isBlack ? "bg-slate-800" : "bg-white"}
        ${isSelected ? "ring-4 ring-yellow-400" : ""}
        ${!isSelected && isAvailableMove ? "ring-4 ring-green-400" : ""}
      `}
    >
      {children}
    </div>
  );
}