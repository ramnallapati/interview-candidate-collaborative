import { useEffect, useState } from "react";
import { socket } from "../utils/socket";

export default function UserPresence({ roomId }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Join room for presence updates
    socket.emit("join-room", roomId);
    
    socket.on("presence-update", (userList) => {
      setUsers(userList);
    });

    return () => {
      socket.off("presence-update");
    };
  }, [roomId]);

  const getRoleColor = (role) => {
    switch (role) {
      case 'interviewer': return 'bg-blue-500';
      case 'candidate': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-gray-800 p-3 rounded-lg mb-4">
      <h4 className="text-sm font-semibold mb-2 text-gray-300">
        Participants ({users.length})
      </h4>
      <div className="space-y-1">
        {users.map((user, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${getRoleColor(user.role)}`}></div>
            <span className="text-sm text-gray-300">{user.name}</span>
            <span className="text-xs text-gray-500 capitalize">({user.role})</span>
          </div>
        ))}
      </div>
      {users.length === 0 && (
        <p className="text-xs text-gray-500">No other participants yet...</p>
      )}
    </div>
  );
}

