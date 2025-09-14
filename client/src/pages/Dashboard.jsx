import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../hooks/useAuth";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({ title: "", description: "" });
  const [joinRoomId, setJoinRoomId] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchUserRooms();
  }, []);

  const fetchUserRooms = async () => {
    try {
      const res = await api.get("/api/rooms");
      setRooms(res.data.rooms || []);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    }
  };

  const createRoom = async (e) => {
    e.preventDefault();
    if (!newRoom.title.trim()) {
      setError("Room title is required");
      return;
    }

    setIsCreating(true);
    setError("");

    try {
      const res = await api.post("/api/rooms/create", newRoom);
      const roomId = res.data.roomId;
      
      // Copy room ID to clipboard
      navigator.clipboard.writeText(roomId);
      setSuccessMessage(`Room "${newRoom.title}" created! Room ID: ${roomId} (copied to clipboard)`);
      
      // Reset form
      setNewRoom({ title: "", description: "" });
      
      // Refresh rooms list
      fetchUserRooms();
      
      // Navigate to room
      setTimeout(() => {
        navigate(`/room/${roomId}`);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create room");
    } finally {
      setIsCreating(false);
    }
  };

  const joinRoom = async (roomId) => {
    if (!roomId.trim()) {
      setError("Please enter a room ID");
      return;
    }

    setIsJoining(true);
    setError("");

    try {
      await api.post(`/api/rooms/${roomId}/join`);
      navigate(`/room/${roomId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to join room");
      setIsJoining(false);
    }
  };

  const quickJoinFromInput = () => {
    if (joinRoomId.trim()) {
      joinRoom(joinRoomId.trim());
    }
  };

  const clearMessages = () => {
    setError("");
    setSuccessMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Interview Platform</h1>
              <p className="text-sm text-gray-400">
                Welcome, {user?.name} ({user?.role})
              </p>
            </div>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Messages */}
        {(error || successMessage) && (
          <div className="mb-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded mb-3">
                {error}
                <button onClick={clearMessages} className="ml-2 text-red-300 hover:text-red-100">×</button>
              </div>
            )}
            {successMessage && (
              <div className="bg-green-500/20 border border-green-500 text-green-400 p-3 rounded mb-3">
                {successMessage}
                <button onClick={clearMessages} className="ml-2 text-green-300 hover:text-green-100">×</button>
              </div>
            )}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Actions */}
          <div className="space-y-6">
            {user?.role === 'interviewer' && (
              <div className="bg-gray-800 p-6 rounded-lg">
                <h2 className="text-lg font-semibold mb-4 text-green-400">Create Interview Room</h2>
                <form onSubmit={createRoom} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Room Title</label>
                    <input
                      type="text"
                      placeholder="e.g., Frontend Developer Interview"
                      value={newRoom.title}
                      onChange={(e) => setNewRoom({ ...newRoom, title: e.target.value })}
                      className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-green-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                    <textarea
                      placeholder="Brief description of the interview session"
                      value={newRoom.description}
                      onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                      className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-green-500 focus:outline-none h-20 resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-600 p-3 rounded font-medium transition-colors"
                  >
                    {isCreating ? "Creating Room..." : "Create Room"}
                  </button>
                </form>
                <div className="mt-4 p-3 bg-gray-700/50 rounded">
                  <p className="text-xs text-gray-400">
                    💡 Once created, share the Room ID with candidates to join your interview session.
                  </p>
                </div>
              </div>
            )}

            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-lg font-semibold mb-4 text-blue-400">Join Interview Room</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Room ID</label>
                  <input
                    type="text"
                    placeholder="Enter room ID (e.g., ABC123)"
                    value={joinRoomId}
                    onChange={(e) => setJoinRoomId(e.target.value.toUpperCase())}
                    className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        quickJoinFromInput();
                      }
                    }}
                  />
                </div>
                <button
                  onClick={quickJoinFromInput}
                  disabled={isJoining || !joinRoomId.trim()}
                  className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 p-3 rounded font-medium transition-colors"
                >
                  {isJoining ? "Joining..." : "Join Room"}
                </button>
              </div>
              <div className="mt-4 p-3 bg-gray-700/50 rounded">
                <p className="text-xs text-gray-400">
                  💡 Ask your interviewer for the Room ID to join the session.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Active Rooms */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Your Active Rooms</h2>
            {rooms.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <div className="text-4xl mb-4">📝</div>
                <p>No active rooms</p>
                <p className="text-sm mt-2">
                  {user?.role === 'interviewer' 
                    ? 'Create a room to start interviewing' 
                    : 'Join a room using a Room ID'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {rooms.map((room) => (
                  <div key={room.id} className="bg-gray-700 p-4 rounded border border-gray-600">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium">{room.title}</h3>
                        <p className="text-sm text-gray-400 mt-1">
                          Room ID: <code className="bg-gray-600 px-2 py-1 rounded text-xs">{room.id}</code>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Created by: {room.createdByName} • Participants: {room.participants.length}/{room.maxParticipants}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(room.id);
                            setSuccessMessage(`Room ID ${room.id} copied to clipboard!`);
                          }}
                          className="text-xs bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded"
                        >
                          Copy ID
                        </button>
                        <button
                          onClick={() => navigate(`/room/${room.id}`)}
                          className="text-xs bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded"
                        >
                          Join
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* How it Works */}
        <div className="mt-8 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">How it Works</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-green-400 mb-2">For Interviewers</h3>
              <ol className="text-sm text-gray-300 space-y-1">
                <li>1. Create a new interview room</li>
                <li>2. Share the Room ID with candidates</li>
                <li>3. Start the interview when candidates join</li>
                <li>4. Use real-time code editor and video calling</li>
              </ol>
            </div>
            <div>
              <h3 className="font-medium text-blue-400 mb-2">For Candidates</h3>
              <ol className="text-sm text-gray-300 space-y-1">
                <li>1. Get the Room ID from your interviewer</li>
                <li>2. Enter the Room ID and click "Join Room"</li>
                <li>3. Participate in the coding interview</li>
                <li>4. Collaborate in real-time with the interviewer</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}