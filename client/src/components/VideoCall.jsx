import { useEffect, useRef, useState } from "react";
import { socket } from "../utils/socket";

export default function VideoCall({ roomId }) {
  const localVideo = useRef(null);
  const remoteVideo = useRef(null);
  const peer = useRef(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  useEffect(() => {
    const initCall = async () => {
      try {
        // Connect socket if not connected
        if (!socket.connected) {
          socket.connect();
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localVideo.current.srcObject = stream;

      peer.current = new RTCPeerConnection();
      stream.getTracks().forEach((track) => peer.current.addTrack(track, stream));

      peer.current.ontrack = (event) => {
        remoteVideo.current.srcObject = event.streams[0];
      };

      peer.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", { roomId, candidate: event.candidate });
        }
      };

      socket.emit("join-call", roomId);

      socket.on("offer", async (offer) => {
        await peer.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peer.current.createAnswer();
        await peer.current.setLocalDescription(answer);
        socket.emit("answer", { roomId, answer });
      });

      socket.on("answer", async (answer) => {
        await peer.current.setRemoteDescription(new RTCSessionDescription(answer));
      });

      socket.on("ice-candidate", async ({ candidate }) => {
        try {
          await peer.current.addIceCandidate(candidate);
        } catch (err) {
          console.error("Error adding ice candidate", err);
        }
      });

        const offer = await peer.current.createOffer();
        await peer.current.setLocalDescription(offer);
        socket.emit("offer", { roomId, offer });
      } catch (err) {
        console.error("Error initializing video call:", err);
        alert("Camera/Microphone access denied or unavailable. Video call won't work.");
      }
    };

    initCall();

    return () => {
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
    };
  }, [roomId]);

  const toggleVideo = () => {
    const video = localVideo.current;
    if (video && video.srcObject) {
      const tracks = video.srcObject.getVideoTracks();
      tracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleAudio = () => {
    const video = localVideo.current;
    if (video && video.srcObject) {
      const tracks = video.srcObject.getAudioTracks();
      tracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  if (isMinimized) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400">Video Call</span>
        <button
          onClick={() => setIsMinimized(false)}
          className="text-xs bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded"
          title="Expand Video"
        >
          🎥 Expand
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {/* Minimize button */}
      <button
        onClick={() => setIsMinimized(true)}
        className="text-xs bg-gray-600 hover:bg-gray-500 px-1 py-1 rounded"
        title="Minimize Video"
      >
        ➖
      </button>

      {/* Local Video - Small thumbnail */}
      <div className="relative">
        <video 
          ref={localVideo} 
          autoPlay 
          playsInline 
          muted 
          className="w-20 h-16 rounded border border-gray-600 bg-gray-700" 
        />
        <span className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs px-1 py-0.5 rounded-b text-center">
          You
        </span>
        {!isVideoEnabled && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded">
            <span className="text-white text-xs">📹 Off</span>
          </div>
        )}
      </div>

      {/* Remote Video - Small thumbnail */}
      <div className="relative">
        <video 
          ref={remoteVideo} 
          autoPlay 
          playsInline 
          className="w-20 h-16 rounded border border-gray-600 bg-gray-700" 
        />
        <span className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs px-1 py-0.5 rounded-b text-center">
          Participant
        </span>
      </div>

      {/* Video controls */}
      <div className="flex flex-col gap-1">
        <button
          onClick={toggleVideo}
          className={`text-xs px-2 py-1 rounded ${
            isVideoEnabled 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
          title={isVideoEnabled ? "Turn off video" : "Turn on video"}
        >
          {isVideoEnabled ? '📹' : '📹'}
        </button>
        <button
          onClick={toggleAudio}
          className={`text-xs px-2 py-1 rounded ${
            isAudioEnabled 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
          title={isAudioEnabled ? "Mute audio" : "Unmute audio"}
        >
          {isAudioEnabled ? '🎤' : '🔇'}
        </button>
      </div>
    </div>
  );
}
