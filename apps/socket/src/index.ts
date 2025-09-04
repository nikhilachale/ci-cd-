import { WebSocketServer } from 'ws';
import crypto from "crypto";
// Define the Game interface and storage for games
interface Game {
  roomId: string;
  players: string[];
  board: string[][];
  turn: string;
}

// Define piece arrays
const blackPieces = ['p','r','n','b','q','k'];
const whitePieces = ['P','R','N','B','Q','K'];

// Store all games by roomId
const games: Record<string, Game> = {};

function movesOfRook(x: number, y: number, board: string[][], isWhite: boolean): { x: number, y: number }[] {
  const moves: { x: number, y: number }[] = [];
  const directions = [
    { dx: 1, dy: 0 },  // Right
    { dx: -1, dy: 0 }, // Left
    { dx: 0, dy: 1 },  // Down
    { dx: 0, dy: -1 }, // Up
  ];

  for (const { dx, dy } of directions) {
    for (let step = 1; step < 8; step++) {
      const newX = x + dx * step;
      const newY = y + dy * step;
      if (newX < 0 || newX > 7 || newY < 0 || newY > 7) break; // Out of bounds
      if (!board[newX] || board[newX][newY] === undefined) break;
      const piece = board[newX][newY];
      if (piece === '') {
        moves.push({ x: newX, y: newY });
      } else {
        if (isWhite && blackPieces.includes(piece)) {
          moves.push({ x: newX, y: newY });
          break;
        } else if (!isWhite && whitePieces.includes(piece)) {
          moves.push({ x: newX, y: newY });
          break;
        } else {
          break;
        }
      }
    }
  }
  return moves;
}
function movesOfBishop(x: number, y: number, board: string[][], isWhite: boolean): { x: number, y: number }[] {
  const moves: { x: number, y: number }[] = [];
  const directions = [
    { dx: 1, dy: 1 },   // down-right
    { dx: 1, dy: -1 },  // down-left
    { dx: -1, dy: 1 },  // up-right
    { dx: -1, dy: -1 }, // up-left
  ];

  for (const { dx, dy } of directions) {
    for (let step = 1; step < 8; step++) {
      const newX = x + dx * step;
      const newY = y + dy * step;

      if (newX < 0 || newX > 7 || newY < 0 || newY > 7) break; // Out of bounds
      if (!board[newX] || board[newX][newY] === undefined) break;
      const piece = board[newX][newY];
      if (piece === '') {
        moves.push({ x: newX, y: newY });
      } else {
        if (isWhite && blackPieces.includes(piece)) {
          moves.push({ x: newX, y: newY });
          break;
        } else if (!isWhite && whitePieces.includes(piece)) {
          moves.push({ x: newX, y: newY });
          break;
        } else {
          break;
        }
      }
    }
  }

  return moves;
}

function movesOfKnight(
  x: number,
  y: number,
  board: string[][],
  isWhite: boolean
): { x: number; y: number }[] {
  const moves: { x: number; y: number }[] = [];

  const knightJumps = [
    { dx: 2, dy: 1 },
    { dx: 2, dy: -1 },
    { dx: -2, dy: 1 },
    { dx: -2, dy: -1 },
    { dx: 1, dy: 2 },
    { dx: 1, dy: -2 },
    { dx: -1, dy: 2 },
    { dx: -1, dy: -2 },
  ];

  for (const { dx, dy } of knightJumps) {
    const newX = x + dx;
    const newY = y + dy;

    if (newX < 0 || newX > 7 || newY < 0 || newY > 7) continue; // out of bounds

    if (!board[newX] || board[newX][newY] === undefined) continue;
    const piece = board[newX][newY];
    if (piece === '') {
      moves.push({ x: newX, y: newY });
    } else {
      if (isWhite && blackPieces.includes(piece)) {
        moves.push({ x: newX, y: newY });
      } else if (!isWhite && whitePieces.includes(piece)) {
        moves.push({ x: newX, y: newY });
      }
    }
  }

  return moves;
}

function movesOfQueen(
  x: number,
  y: number,
  board: string[][],
  isWhite: boolean

): { x: number; y: number }[] {
  const moves: { x: number; y: number }[] = [];

  // Rook-like moves
  moves.push(...movesOfRook(x, y, board, isWhite));

  // Bishop-like moves
  moves.push(...movesOfBishop(x, y, board, isWhite));

  return moves;
}


function movesOfKing(x: number, y: number, board: string[][], isWhite: boolean): { x: number; y: number }[] {
  const moves: { x: number; y: number }[] = [];
  const dx = [-1, 0, 1];
  const dy = [-1, 0, 1];

  for (const dirX of dx) {
    for (const dirY of dy) {
      if (dirX === 0 && dirY === 0) continue; // Skip the current position
      const newX = x + dirX;
      const newY = y + dirY;
      if (newX < 0 || newX > 7 || newY < 0 || newY > 7) continue;
      if (!board[newX] || board[newX][newY] === undefined) continue;
      const piece = board[newX][newY];
      if (piece === '') {
        moves.push({ x: newX, y: newY });
      } else {
        if (isWhite && blackPieces.includes(piece)) {
          moves.push({ x: newX, y: newY });
        } else if (!isWhite && whitePieces.includes(piece)) {
          moves.push({ x: newX, y: newY });
        }
      }
    }
  }


  return moves;
}
function movesOfPawn(
  x: number,
  y: number,
  board: string[][],
  isWhite: boolean
): { x: number; y: number }[] {
  const moves: { x: number; y: number }[] = [];

  // sanity check
  if (x < 0 || x > 7 || y < 0 || y > 7) return moves;

  if (isWhite) {
    // White pawns move UP (decreasing x)
    if (x > 0 && board[x - 1]?.[y] === "") {
      moves.push({ x: x - 1, y });
      if (x === 6 && board[x - 2]?.[y] === "") {
        moves.push({ x: x - 2, y });
      }
    }
    // captures
  if (x > 0 && y > 0 && blackPieces.includes(board[x - 1]?.[y - 1] ?? "")) {
      moves.push({ x: x - 1, y: y - 1 });
    }
  if (x > 0 && y < 7 && blackPieces.includes(board[x - 1]?.[y + 1] ?? "")) {
      moves.push({ x: x - 1, y: y + 1 });
    }
  } else {
    // Black pawns move DOWN (increasing x)
    if (x < 7 && board[x + 1]?.[y] === "") {
      moves.push({ x: x + 1, y });
      if (x === 1 && board[x + 2]?.[y] === "") {
        moves.push({ x: x + 2, y });
      }
    }
    // captures
  if (x < 7 && y > 0 && whitePieces.includes(board[x + 1]?.[y - 1] ?? "")) {
      moves.push({ x: x + 1, y: y - 1 });
    }
  if (x < 7 && y < 7 && whitePieces.includes(board[x + 1]?.[y + 1] ?? "")) {
      moves.push({ x: x + 1, y: y + 1 });
    }
  }

  return moves;
}
// Helper function to create the initial chess board setup as a 2D array
function createInitialBoard(): string[][] {
  // 8x8 board: board[row][col], row 0 is rank 8, row 7 is rank 1, col 0 is file 'a'
  return [
    // Rank 8 (Black major pieces)
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    // Rank 7 (Black pawns)
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    // Rank 6
    ['', '', '', '', '', '', '', ''],
    // Rank 5
    ['', '', '', '', '', '', '', ''],
    // Rank 4
    ['', '', '', '', '', '', '', ''],
    // Rank 3
    ['', '', '', '', '', '', '', ''],
    // Rank 2 (White pawns)
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    // Rank 1 (White major pieces)
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
  ];
}

const wss = new WebSocketServer({ port: 8080 });

function generateRoomCode(): string {
  return crypto.randomBytes(6).toString("base64url").slice(0, 8).toUpperCase();
}

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);
 let avalible_moves: any[] = [];
  ws.on('message', function message(parsedData) {
    const data = JSON.parse(parsedData.toString());
    console.log('received: %s', data);

    if(data.type === "create_room") {
      
      const playerId = data.playerId || "white";
      const newGame: Game = {
        roomId: generateRoomCode(),
        players: [playerId],
        board: createInitialBoard(),
        turn: playerId,
      };
      games[newGame.roomId] = newGame;
      ws.send(JSON.stringify({
        type: "room_created",
        roomName: newGame.roomId,
        game: newGame,
      }));
      return;
    }

    if(data.type === "join_room") {
      const roomId = data.roomName;
      const playerId = data.playerId || "black";
      const game = games[roomId];
      if (!game) {
        ws.send(JSON.stringify({
          type: "error",
          message: "Room does not exist",
        }));
        return;
      }
      // Add player if not already in list
      if (!game.players.includes(playerId)) {
        game.players.push(playerId);
      }
      ws.send(JSON.stringify({
        type: "room_joined",
        game,
      }));
      return;
    }
   

    if(data.type === 'can_move')
    {
      const roomId = data.roomName;
      const playerId = data.playerId ;
     
      const game = games[roomId];
      const { row, col } = data.index;
console.log("Checking moves for piece at:", row, col);

      if (game && game.board && typeof game.board[row] !== 'undefined' && typeof game.board[row][col] !== 'undefined') {
        console.log("Piece found:", game.board[row][col]);
        const piece: string = game.board[row]?.[col] ?? '';
        const isWhite = whitePieces.includes(piece);
        if (piece) {
          switch (piece.toLowerCase()) {
            case 'p':
              avalible_moves = movesOfPawn(row, col , game.board, isWhite);
              break;
            case 'r':
              avalible_moves = movesOfRook(row, col, game.board, isWhite);
              break;
            case 'n':
              avalible_moves = movesOfKnight(row, col, game.board, isWhite);
              break;
            case 'b':
              avalible_moves = movesOfBishop(row, col, game.board, isWhite);
              break;
            case 'q':
              avalible_moves = movesOfQueen(row, col, game.board, isWhite);
              break;
            case 'k':
              avalible_moves = movesOfKing(row, col, game.board, isWhite);
              break;
            default:
              avalible_moves = [];
          }
        }
        console.log("Available moves:", avalible_moves);
        ws.send(JSON.stringify({ type: 'available_moves', moves: avalible_moves }));
      }
      
    }

    if(data.type === 'make_move')
    {
      const roomId = data.roomName;
      const game = games[roomId];
      const from = data.from;
      const to = data.to;

      if (!game) {
        ws.send(JSON.stringify({ type: "error", message: "Game not found" }));
        return;
      }

      if (
        !from || !to ||
        from.x < 0 || from.x > 7 || from.y < 0 || from.y > 7 ||
        to.x < 0 || to.x > 7 || to.y < 0 || to.y > 7
      ) {
        ws.send(JSON.stringify({ type: "error", message: "Invalid move coordinates" }));
        return;
      }

      if (!game.board) {
        ws.send(JSON.stringify({ type: "error", message: "Game board not initialized" }));
        return;
      }

  const piece = game.board[from.x]?.[from.y];
      if (!piece) {
        ws.send(JSON.stringify({ type: "error", message: "No piece at the source position" }));
        return;
      }

      
      // Move the piece
      const targetPiece = game.board[to.x]![to.y] ?? '';
      game.board[to.x]![to.y] = piece;
      game.board[from.x]![from.y] = '';

      // Capture tracking
      let capture: string | null = null;
      if (targetPiece !== '') {
        capture = targetPiece;
      }

      // Switch turn
      const isWhite = whitePieces.includes(piece);
      const fromPlayer = isWhite ? 'white' : 'black';
      game.turn = isWhite ? "black" : "white";

      // Broadcast to all players in the game
      wss.clients.forEach(client => {
        if (client.readyState === 1) {
          client.send(JSON.stringify({
            type: "move_made",
            from,
            to,
            piece,
            capture,
            fromPlayer,
            board: game.board,
            turn: game.turn
          }));
        }
      });
    }

   
  });


});