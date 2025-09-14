import { useEffect, useRef } from "react";
import * as monaco from "monaco-editor";
import { socket } from "../utils/socket";
import { useAuth } from "../hooks/useAuth";

export default function Editor({ roomId, fileId }) {
  const editorRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    const editor = monaco.editor.create(editorRef.current, {
      value: "// Start coding...",
      language: "javascript",
      theme: "vs-dark",
      automaticLayout: true,
    });

    // Handle content changes
    editor.onDidChangeModelContent(() => {
      const content = editor.getValue();
      const cursor = editor.getPosition();
      socket.emit("code-change", { roomId, content, cursor });
    });

    // Handle cursor position changes
    editor.onDidChangeCursorPosition(() => {
      const cursor = editor.getPosition();
      socket.emit("cursor-change", { roomId, cursor });
    });

    // Listen for code changes from other users
    socket.on("code-change", ({ content, sender }) => {
      if (sender !== socket.id && content !== editor.getValue()) {
        const position = editor.getPosition();
        editor.setValue(content);
        editor.setPosition(position);
      }
    });

    // Listen for cursor changes from other users
    socket.on("cursor-change", ({ cursor, sender }) => {
      if (sender !== socket.id) {
        // You could show other users' cursors here
        console.log("Other user cursor:", cursor);
      }
    });

    // Auto-save functionality
    const saveFile = () => {
      if (fileId && user) {
        const content = editor.getValue();
        socket.emit("save-file", { fileId, content, authorId: user._id });
      }
    };

    // Save every 30 seconds
    const saveInterval = setInterval(saveFile, 30000);

    // Listen for file saved confirmation
    socket.on("file-saved", ({ fileId: savedFileId }) => {
      if (savedFileId === fileId) {
        console.log("File saved successfully");
      }
    });

    return () => {
      clearInterval(saveInterval);
      socket.off("code-change");
      socket.off("cursor-change");
      socket.off("file-saved");
      editor.dispose();
    };
  }, [roomId, fileId, user]);

  return <div ref={editorRef} className="h-[80vh] w-full border rounded-lg" />;
}
