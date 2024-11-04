import { Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../pages/GamePage";

const ChessBoard = ({
  chess,
  board,
  socket,
  setBoard,
}: {
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: WebSocket;
  setBoard: any;
  chess: any;
}) => {
  const [from, setFrom] = useState<null | Square>(null);
//   const [to, setTo] = useState<null | Square>(null);

  return (
    <div className="grid grid-cols-8 border-2 border-black">
      {board.map((row, rowIndex) =>
        row.map((square, squareIndex) => {
          const isDarkSquare = (rowIndex + squareIndex) % 2 === 1;
          const squareRepresentation = (String.fromCharCode(
            97 + (squareIndex % 8)
          ) +
            "" +
            (8 - rowIndex)) as Square;

          return (
            <div
              key={`${rowIndex}-${squareIndex}`}
              className={`w-16 h-16 flex items-center justify-center text-2xl ${
                isDarkSquare
                  ? "bg-gray-800 text-white"
                  : "bg-gray-200 text-black"
              }`}
              onClick={() => {
                if (!from) {
                  setFrom(squareRepresentation);
                } else {
                  socket.send(
                    JSON.stringify({
                      type: MOVE,
                      payload: {
                        move: {
                          from,
                          to: squareRepresentation,
                        },
                      },
                    })
                  );
                  setFrom(null);
                  chess.move({
                    from,
                    to: squareRepresentation,
                  });
                  setBoard(chess.board());
                  console.log({ from, to: squareRepresentation });
                }
              }}
            >
              <div className="h-full flex justify-center w-full">
                {/* {square ? square.type : ""} */}
               { square? <img   className="w-16"  src={`/${square?.color === 'b' ? `b${square.type}` : `w${square.type}`}.png`} /> : null}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ChessBoard;


























