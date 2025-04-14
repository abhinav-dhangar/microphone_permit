"use client"

import { useState, useEffect } from "react";
import { Mic, MicOff, AlertTriangle } from "lucide-react";

export default function MicrophonePermission() {
  const [permission, setPermission] = useState("prompt");
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Request microphone permission when component mounts
    const requestMicrophoneAccess = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setStream(mediaStream);
        setPermission("granted");
      } catch (err) {
        setError(err.message);
        setPermission("denied");
      }
    };

    requestMicrophoneAccess();

    // Cleanup function to stop all tracks when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleRetry = async () => {
    setError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      setStream(mediaStream);
      setPermission("granted");
    } catch (err) {
      setError(err.message);
      setPermission("denied");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg shadow-md max-w-md mx-auto">
      {permission === "prompt" && (
        <div className="text-center">
          <div className="animate-pulse mb-4">
            <Mic className="h-16 w-16 text-blue-500 mx-auto" />
          </div>
          <h2 className="text-xl font-bold mb-2">
            Requesting Microphone Access
          </h2>
          <p className="text-gray-600">
            Please allow access to your microphone when prompted by your
            browser.
          </p>
        </div>
      )}

      {permission === "granted" && (
        <div className="text-center">
          <div className="mb-4">
            <Mic className="h-16 w-16 text-green-500 mx-auto" />
          </div>
          <h2 className="text-xl font-bold mb-2">Microphone Access Granted</h2>
          <p className="text-gray-600">
            Your microphone is now active and ready to use.
          </p>
        </div>
      )}

      {permission === "denied" && (
        <div className="text-center">
          <div className="mb-4">
            <div className="relative mx-auto w-16 h-16">
              <MicOff className="h-16 w-16 text-red-500" />
              <AlertTriangle className="h-8 w-8 text-amber-500 absolute -top-2 -right-2" />
            </div>
          </div>
          <h2 className="text-xl font-bold mb-2">Microphone Access Denied</h2>
          <p className="text-gray-600 mb-4">
            {error ||
              "You need to allow microphone access to use this feature."}
          </p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
          <p className="text-sm text-gray-500 mt-4">
            You may need to update your browser settings to allow microphone
            access.
          </p>
        </div>
      )}
    </div>
  );
}
