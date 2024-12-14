// import { BrowserRouter, Route, Routes } from "react-router-dom"
// import LandingPage from "./pages/LandingPage"
// import GamePage from "./pages/GamePage"

// function App() {

//   return (
//     <>
//      <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<LandingPage/>}/>
//         <Route path="/game" element={<GamePage/>}/>
//       </Routes>
//      </BrowserRouter>
//     </>
//   )
// }

// export default App





















import { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [roomId, setRoomId] = useState('');
  const [gameState, setGameState] = useState(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [newRoomId, setNewRoomId] = useState<string | null>(null);
  useEffect(() => {
    if (ws) {
      ws.onopen = () => {
        console.log('Connected to WebSocket');
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'game-state') {
          setGameState(message.gameState);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
      };

      return () => {
        ws.close();
      };
    }
  }, [ws]);

  // Create a new room
  const createRoom = async () => {
    const response = await fetch('http://localhost:5000/api/create-room', {
      method: 'POST',
    });
    const data = await response.json();
    setNewRoomId(data.roomId);
    setRoomId(data.roomId);

    // Connect to the WebSocket server
    const socket = new WebSocket('ws://localhost:5000');
    setWs(socket);

    socket.onopen = () => {
      socket.send(
        JSON.stringify({ type: 'join-room', roomId: data.roomId })
      );
    };
  };

  // Join an existing room
  const joinRoom = async () => {
    const response = await fetch(`http://localhost:5000/api/join-room/${roomId}`);
    if (response.ok) {
      // Connect to the WebSocket server
      const socket = new WebSocket('ws://localhost:5000');
      setWs(socket);

      socket.onopen = () => {
        socket.send(
          JSON.stringify({ type: 'join-room', roomId })
        );
      };
    } else {
      alert('Room not found');
    }
  };

  // Send game state update
  const sendGameUpdate = (newGameState: any) => {
    if (ws) {
      ws.send(
        JSON.stringify({ type: 'game-update', roomId, gameState: newGameState })
      );
    }
  };

  return (
    <div className="App">
      <h1>Real-Time Game</h1>
      <div>
        <h2>Create or Join a Room</h2>
        <button onClick={createRoom}>Create New Room</button>
        <input
          type="text"
          placeholder="Enter room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button onClick={joinRoom}>Join Room</button>
      </div>

      {newRoomId && <div>Room created! Room ID: {newRoomId}</div>}

      {gameState && (
        <div>
          <h2>Game State:</h2>
          <pre>{JSON.stringify(gameState, null, 2)}</pre>
          <button onClick={() => sendGameUpdate({ score: 100 })}>
            Update Game State
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
