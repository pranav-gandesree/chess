// import { useEffect, useState } from "react";
// import { useSocket } from "../hooks/useSocket";
// import { Chess } from "chess.js";
// import ChessBoard from "../components/ChessBoard"; // Import the board component

// export const INIT_GAME = "init_game";
// export const MOVE = "move";
// export const GAME_OVER = "game_over";

// const ChessGame = () => {
//   const socket = useSocket();
//   const [chess] = useState(new Chess());
//   const [board, setBoard] = useState(chess.board());
//   const [started, setStarted] = useState(false);

//   useEffect(() => {
//     if (!socket) {
//       return;
//     }

//     socket.onmessage = (event) => {
//       const message = JSON.parse(event.data);
//       console.log(message);
//       switch (message.type) {
//         case INIT_GAME:
//           const newGame = new Chess();
//           // setChess(newGame);
//           setStarted(true);
//           setBoard(newGame.board());
//           console.log("game initialized");
//           break;
//         case MOVE:
//           const move = message.payload;
//           chess.move(move);
//           setBoard(chess.board());
//           console.log("move made", message.payload.move);
//           break;
//         case GAME_OVER:
//           console.log("game over", message.payload.winner);
//           break;
//       }
//     };

//     return () => {
//       socket.close();
//     };
//   }, [socket, chess]);

//   if (!socket) return <div>connecting......</div>;

//   return (
//     <div className="flex flex-col items-center">
//       <ChessBoard
//         socket={socket}
//         setBoard={setBoard}
//         chess={chess}
//         board={board}
//       />

//       {!started && (
//         <button
//           className="mt-4 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
//           onClick={() => {
//             socket.send(
//               JSON.stringify({
//                 type: INIT_GAME,
//               })
//             );
//           }}
//         >
//           Start New Game
//         </button>
//       )}
//     </div>
//   );
// };

// export default ChessGame;
































// GamePage.tsx
import { useEffect, useState } from "react";

const GamePage = ({ roomId }: { roomId: string }) => {
  const [gameState, setGameState] = useState(null);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:5000");
    setWs(socket);

    socket.onopen = () => {
      // Join the room when the WebSocket connection is established
      socket.send(JSON.stringify({ type: "join-room", roomId }));
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "game-state") {
        setGameState(message.gameState);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      socket.close();
    };
  }, [roomId]);

  const sendGameUpdate = (gameState: any) => {
    if (ws) {
      ws.send(JSON.stringify({ type: "game-update", roomId, gameState }));
    }
  };

  return (
    <div>
      <h1>Game Room: {roomId}</h1>
      <div>{gameState ? JSON.stringify(gameState) : "Loading game..."}</div>
      <button onClick={() => sendGameUpdate({ score: 100 })}>Update Game</button>
    </div>
  );
};

export default GamePage;
