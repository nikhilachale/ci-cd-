import { Crown, Shield, Castle, Zap, Mountain } from "lucide-react";

export default function PieceIcon({ piece }: { piece: string }) {
  if (!piece) return null;
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
}
