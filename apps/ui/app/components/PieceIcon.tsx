import { Crown, Shield, Castle, Zap, Mountain } from "lucide-react";

interface PieceIconProps {
  piece: string;
  size?: number;
}

export default function PieceIcon({ piece, size = 42 }: PieceIconProps) {
  if (!piece) return null;
  const isWhite = piece === piece.toUpperCase();
  const colorClass = isWhite ? "text-white" : "text-gray-500";
  const shadowClass = "drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]";
  const responsiveSize = `w-[${size}px] h-[${size}px] sm:w-[${size * 0.9}px] sm:h-[${size * 0.9}px] md:w-[${size}px] md:h-[${size}px] lg:w-[${size * 1.2}px] lg:h-[${size * 1.2}px]`;

  switch (piece.toLowerCase()) {
    case "k":
      return (
        <Crown
          size={size}
          className={`${colorClass} ${shadowClass} ${responsiveSize}`}
          fill={isWhite ? "#facc15" : "#facc15"}
        />
      );
    case "q":
      return (
        <Crown
          size={size}
          className={`${colorClass} ${shadowClass} ${responsiveSize}`}
          fill={isWhite ? "#fff" : "#000"}
        />
      );
    case "r":
      return (
        <Castle
          size={size}
          className={`${colorClass} ${shadowClass} ${responsiveSize}`}
        />
      );
    case "b":
      return (
        <Mountain
          size={size}
          className={`${colorClass} ${shadowClass} ${responsiveSize}`}
        />
      );
    case "n":
      return (
        <Zap
          size={size}
          className={`${colorClass} ${shadowClass} ${responsiveSize}`}
        />
      );
    case "p":
      return (
        <Shield
          size={size}
          className={`${colorClass} ${shadowClass} ${responsiveSize}`}
        />
      );
    default:
      return null;
  }
}
