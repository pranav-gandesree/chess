
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

const Room = () => {
  const [roomName, setRoomName] = useState("");
  const navigate = useNavigate();

  const createRoom = async () => {
    // Call your backend to create a new room and get the room ID
    const response = await fetch("/api/create-room", {
      method: "POST",
    });
    const { roomId } = await response.json();
    // Redirect to the newly created room
    navigate(`/game/${roomId}`);
  };

  const joinRoom = async () => {
    if (roomName) {
      // Call backend to check if room exists
      const response = await fetch(`/api/join-room/${roomName}`);
      if (response.ok) {
        // Room exists, redirect to the game page
        navigate(`/game/${roomName}`);
      } else {
        alert("Room not found");
      }
    }
  };

  return (
    <div>
      <button onClick={createRoom}>Create New Room</button>
      <div>
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <button onClick={joinRoom}>Join Room</button>
      </div>
    </div>
  );
};

export default Room;
