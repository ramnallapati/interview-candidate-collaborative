import { useParams } from "react-router-dom";
import Editor from "../components/Editor";
import Chat from "../components/Chat";
import VideoCall from "../components/VideoCall";
import UserPresence from "../components/UserPresence";

export default function InterviewRoom() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Top Navbar with Video Call */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-3 gap-3">
          {/* Left side - Room info and controls */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <h1 className="text-lg font-semibold">Interview Room</h1>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-400">Room ID:</span>
              <code className="bg-gray-700 px-2 py-1 rounded text-sm">{id}</code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(id);
                  // Simple feedback
                  const btn = event.target;
                  const originalText = btn.textContent;
                  btn.textContent = 'Copied!';
                  setTimeout(() => btn.textContent = originalText, 2000);
                }}
                className="text-xs bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded"
              >
                Copy
              </button>
              <button
                onClick={() => {
                  const roomUrl = `${window.location.origin}/room/${id}`;
                  navigator.clipboard.writeText(roomUrl);
                  const btn = event.target;
                  const originalText = btn.textContent;
                  btn.textContent = 'Link Copied!';
                  setTimeout(() => btn.textContent = originalText, 2000);
                }}
                className="text-xs bg-green-500 hover:bg-green-600 px-2 py-1 rounded"
              >
                Share Link
              </button>
            </div>
          </div>

          {/* Right side - Video Call in Navbar */}
          <div className="flex items-center justify-center lg:justify-end">
            <div className="bg-gray-700/50 p-2 rounded-lg">
              <VideoCall roomId={id} />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-1 flex-col md:flex-row gap-4 p-4">
        {/* Code Editor */}
        <div className="flex-1">
          <Editor roomId={id} fileId={id} />
        </div>

        {/* Right Side: Presence + Chat */}
        <div className="w-full md:w-1/3 flex flex-col gap-4">
          <UserPresence roomId={id} />
          <Chat roomId={id} />
        </div>
      </div>
    </div>
  );
}
