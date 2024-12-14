// import { WebSocketServer } from 'ws';
// import { GameManager } from './GameManager';

// const wss = new WebSocketServer({ port: 4040 });

// const gameManager = new GameManager();


// wss.on('connection', function connection(ws) {
//     gameManager.addUser(ws)

//   ws.on('error', console.error);

// //   ws.on('message', function message(data) {
// //     console.log('received: %s', data);
// //   });

// ws.on('disconnect', ()=> gameManager.removeUser(ws))

//   ws.send('something');
// });
















import express from "express"
import { WebSocketServer, WebSocket} from "ws";
import http from "http";
import uuid from "uuid";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const rooms: { [roomId: string]: Set<WebSocket> } = {}; // Store rooms with connected clients

// Middleware to handle JSON requests
app.use(express.json());

// Route to create a new room
app.post("/api/create-room", (req, res: any) => {
  const roomId = uuid.v4(); // Generate unique room ID
  rooms[roomId] = new Set(); // Initialize an empty set for the room
  res.json({ roomId }); // Send back the room ID to frontend
});

// Route to join a room
app.get("/api/join-room/:roomId", (req, res) => {
  const { roomId } = req.params;
  if (rooms[roomId]) {
    res.status(200).send("Room exists");
  } else {
    res.status(404).send("Room not found");
  }
});

// Set up WebSocket handling
wss.on("connection", (ws: WebSocket) => {
  console.log("New WebSocket connection");

  // When a user joins a room
  ws.on("message", (data: string) => {
    const message = JSON.parse(data);
    if (message.type === "join-room") {
      const { roomId } = message;
      if (rooms[roomId]) {
        rooms[roomId].add(ws); // Add the WebSocket connection to the room
        console.log(`User joined room: ${roomId}`);

        // Notify all clients in the room
        rooms[roomId].forEach((client: WebSocket) => {
          client.send(JSON.stringify({ type: "user-joined", roomId }));
        });
      }
    }
  });

  // When a user sends a game update
  ws.on("message", (data: string) => {
    const message = JSON.parse(data);
    if (message.type === "game-update") {
      const { roomId, gameState } = message;
      // Broadcast game state update to all clients in the room
      if (rooms[roomId]) {
        rooms[roomId].forEach((client: WebSocket) => {
          client.send(JSON.stringify({ type: "game-state", gameState }));
        });
      }
    }
  });

  // Handle WebSocket closing (cleaning up)
  ws.on("close", () => {
    console.log("WebSocket closed");

    // Remove the user from any rooms they're in
    Object.keys(rooms).forEach((roomId) => {
      rooms[roomId].delete(ws);
      // If no users are in the room, we can delete the room
      if (rooms[roomId].size === 0) {
        delete rooms[roomId];
      }
    });
  });

  ws.on("error", (error: any) => {
    console.error("WebSocket error:", error);
  });
});

// Start the server
const port = 5000;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
