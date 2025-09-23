// "use client";

// import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
// import { usePathname } from "next/navigation";
// export interface Move {
//   fromPlayer: string;
//   piece: string;
//   from: { x: number; y: number };
//   to: { x: number; y: number };
//   captured?: string;
// }


// export interface Players{
//   username:string,
//   color?:"black" | "white";
// }
// interface ChessContextProps {
//   board: string[][];
//   setBoard: React.Dispatch<React.SetStateAction<string[][]>>;
//   socket: WebSocket | null;
//   setSocket: React.Dispatch<React.SetStateAction<WebSocket | null>>;
//   canMove: { x: number; y: number }[];
//   setCanMove: React.Dispatch<React.SetStateAction<{ x: number; y: number }[]>>;
//   roomName: string;
//   setRoomName: React.Dispatch<React.SetStateAction<string>>;
//   selectedPiece: { x: number; y: number } | null;
//   setSelectedPiece: React.Dispatch<React.SetStateAction<{ x: number; y: number } | null>>;
//   lastMove: Move[];
//   setLastMove: React.Dispatch<React.SetStateAction<Move[]>>;
//   playerId: "white" | "black" | null;
//   setPlayerId: React.Dispatch<React.SetStateAction<"white" | "black" | null>>;
//   currentTurn: "white" | "black" | null;
//   setCurrentTurn: React.Dispatch<React.SetStateAction<"white" | "black" | null>>;
//   check: "white" | "black" | null;
//   setCheck: React.Dispatch<React.SetStateAction<"white" | "black" | null>>;
//   username: string;
//   setUsername: React.Dispatch<React.SetStateAction<string>>;

//   player:Players
//   setplayer:React.Dispatch<React.SetStateAction<Players>>;
// }

// const ChessContext = createContext<ChessContextProps | undefined>(undefined);

// const initialBoard = [
//   ["r","n","b","q","k","b","n","r"],
//   ["p","p","p","p","p","p","p","p"],
//   ["","","","","","","",""],
//   ["","","","","","","",""],
//   ["","","","","","","",""],
//   ["","","","","","","",""],
//   ["P","P","P","P","P","P","P","P"],
//   ["R","N","B","Q","K","B","N","R"]
// ];

// export const ChessProvider = ({ children }: { children: ReactNode }) => {
//   const [board, setBoard] = useState(initialBoard);
//   const [socket, setSocket] = useState<WebSocket | null>(null);
//   const [canMove, setCanMove] = useState<{ x: number; y: number }[]>([]);
//   const [roomName, setRoomName] = useState("");
//   const [selectedPiece, setSelectedPiece] = useState<{ x: number; y: number } | null>(null);
//   const [lastMove, setLastMove] = useState<Move[]>([]);
//   const [playerId, setPlayerId] = useState<"white" | "black" | null>(null);
//   const [currentTurn, setCurrentTurn] = useState<"white" | "black" | null>(null);
//   const [check, setCheck] = useState<"white" | "black" | null>(null);
//   const [username, setUsername] = useState<string>("");
//   const [player, setplayer] = useState<Players>({ username: "", color: undefined });



//   // WebSocket setup
//   const pathname = usePathname();

//   const [mounted,setmounted]=useState(false)

//  useEffect(()=>{
//    setmounted(true); 
   
    
//   },[])


//    useEffect(()=>{
//    console.log("display all the states in context",{ board, socket, canMove, player, roomName, selectedPiece, lastMove, playerId, currentTurn, check });
   
    
//   },[board, socket, canMove, roomName, selectedPiece, lastMove, playerId,player, currentTurn, check])





//   useEffect(() => {
//     if(!mounted) return;
//     const ws = new WebSocket("ws://localhost:8080");
//     console.log("WebSocket connecting in context",ws);
   

//     ws.onopen = () => {
//       console.log("WebSocket connected in context");
//        setSocket(ws);
       
        
//     };

    
//     ws.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       console.log("Received: in context", data);

//       switch(data.type) {
//         case "room_created":
//           console.log ("room createdferwgercgrt")
//           setRoomName(data.roomName);
//           setPlayerId(data.id || "white");
//           setCurrentTurn(data.turn || "white");
//           setplayer(prev => ({...prev,  username:data.id ,color: data.id || "white"}));
//           break;
//         case "room_joined":
//           setRoomName(data.roomName);
//           setPlayerId(data.id || "white");
//           setCurrentTurn(data.turn || "white");
//           setplayer(prev => ({...prev, username:data.id ,color: data.id || "white"}));
//           break;
//         case "available_moves":
//           setCanMove(data.moves);
//           break;
//         case "move_made":
//           setBoard(data.board);
//           setCanMove([]);
//           setSelectedPiece(null);
//           setLastMove(prev => [...prev, {
//             fromPlayer: data.fromPlayer,
//             piece: data.piece,
//             from: data.from,
//             to: data.to,
//             captured: data.captured
//           }].slice(-10));
//           setCurrentTurn(data.turn);
//           setCheck(data.check);
//           if(data.check) {
//             alert(`${data.turn === "white" ? "Black" : "White"} is in check!`);
//           }
//           break;
//       }
//     };
  

//     return () =>{
//       ws.close();
//       console.log("WebSocket disconnected in context",ws);
//     };
//   },[mounted]);


  

//   return (
    
//     <ChessContext.Provider value={{
//       player,setplayer,
//       username , setUsername,
//       board, setBoard,
//       socket, setSocket,
//       canMove, setCanMove,
//       roomName, setRoomName,
//       selectedPiece, setSelectedPiece,
//       lastMove, setLastMove,
//       playerId, setPlayerId,
//       currentTurn, setCurrentTurn,
//       check, setCheck
//     }}>
//       {!mounted && <div>mounting ...</div>}
//       {children}
//     </ChessContext.Provider>
//   )
// };

// // Custom hook for consuming context
// export const useChess = () => {
//   const context = useContext(ChessContext);
//   if (!context) throw new Error("useChess must be used within a ChessProvider");
//   return context;
// };