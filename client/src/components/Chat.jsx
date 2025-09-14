import { useEffect, useState, useRef } from "react";
import { socket } from "../utils/socket";
import { useAuth } from "../hooks/useAuth";

export default function Chat({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Connect socket and join room
    if (!socket.connected) {
      socket.connect();
    }
    
    console.log("Joining room:", roomId, "with user:", user);
    socket.emit("join-room", { roomId, user });

    // Handle incoming new messages
    socket.on("chat-message", ({ message }) => {
      console.log("Received chat message:", message);
      setMessages((prev) => [...prev, message]);
    });

    // Handle chat history when joining room
    socket.on("chat-history", ({ messages: historyMessages }) => {
      console.log("Received chat history:", historyMessages);
      setMessages(historyMessages);
    });

    socket.on("connect", () => {
      console.log("Socket connected for chat");
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.off("chat-message");
      socket.off("chat-history");
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [roomId, user]);

  const sendMessage = () => {
    if (!input.trim() || !user) {
      console.log("Cannot send message: input empty or user not logged in", { input, user });
      return;
    }
    console.log("Sending message:", { roomId, senderId: user._id, text: input });
    socket.emit("chat-message", { roomId, senderId: user._id, text: input });
    setInput("");
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isMyMessage = (message) => {
    return message.sender && message.sender._id === user?._id;
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-700">
        <h3 className="text-lg font-semibold">Chat</h3>
        <span className="text-sm text-gray-400">{messages.length} messages</span>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-2 mb-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="text-2xl mb-2">💬</div>
            <p>No messages yet</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`flex ${isMyMessage(m) ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg px-3 py-2 ${
                isMyMessage(m) 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-100'
              }`}>
                {!isMyMessage(m) && (
                  <div className="text-xs text-gray-300 mb-1 font-medium">
                    {m.sender?.name || 'Unknown User'}
                    <span className="ml-1 text-gray-400">({m.sender?.role || 'user'})</span>
                  </div>
                )}
                <div className="text-sm">{m.text}</div>
                <div className={`text-xs mt-1 ${
                  isMyMessage(m) ? 'text-blue-200' : 'text-gray-400'
                }`}>
                  {formatTime(m.createdAt)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              sendMessage();
            }
          }}
          className="flex-1 p-2 rounded bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
          disabled={!user}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || !user}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 px-4 py-2 rounded font-medium transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
}
