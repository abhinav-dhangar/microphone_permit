"use client";
import { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  AlertTriangle,
  RefreshCw,
  Send,
  StopCircle,
} from "lucide-react";

export default function MicrophoneRecorder() {
  const [permission, setPermission] = useState("prompt");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState("idle");
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [audioURL, setAudioURL] = useState("");

  // Use explicit type for mediaRecorderRef
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const requestMicrophoneAccess = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      setStream(mediaStream);
      setPermission("granted");
      setErrorType(null);
    } catch (err: any) {
      setError(err.message);
      setPermission("denied");

      if (err.name === "NotFoundError") {
        setErrorType("notFound");
      } else if (err.name === "NotAllowedError") {
        setErrorType("notAllowed");
      } else if (err.name === "NotReadableError") {
        setErrorType("notReadable");
      } else {
        setErrorType("other");
      }

      console.error("Microphone access error:", err.name, err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Your browser does not support accessing the microphone.");
      setPermission("denied");
      setErrorType("unsupported");
      return;
    }

    requestMicrophoneAccess();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = () => {
    if (!stream) {
      console.error("No media stream available");
      return;
    }

    audioChunksRef.current = [];

    const options = { mimeType: "audio/webm" };

    try {
      mediaRecorderRef.current = new MediaRecorder(stream, options);
    } catch (err) {
      console.error("MediaRecorder error:", err);
      setError("Could not create MediaRecorder. Try a different browser.");
      return;
    }

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/webm",
      });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioURL(audioUrl);
      setRecordingStatus("recorded");

      try {
        await uploadAudio(audioBlob);
      } catch (err) {
        console.error("Upload error:", err);
        setUploadStatus("error");
      }
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
    setRecordingStatus("recording");
    setUploadStatus("idle");
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const uploadAudio = async (audioBlob: Blob) => {
    setUploadStatus("uploading");

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      const response = await fetch("http://localhost:4000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const result = await response.json();
      console.log("Upload successful:", result);
      setUploadStatus("success");
    } catch (err) {
      console.error("Upload failed:", err);
      setUploadStatus("error");
      throw err;
    }
  };

  const getErrorMessage = () => {
    switch (errorType) {
      case "notFound":
        return "No microphone detected. Please connect a microphone and try again.";
      case "notAllowed":
        return "Microphone access was denied. Please allow access in your browser settings.";
      case "notReadable":
        return "Your microphone is already in use by another application.";
      case "unsupported":
        return "Your browser doesn't support microphone access.";
      default:
        return error || "Unable to access your microphone.";
    }
  };

  const getErrorHelp = () => {
    switch (errorType) {
      case "notFound":
        return "Check that your microphone is properly connected. If using a laptop, ensure the internal microphone isn't disabled.";
      case "notAllowed":
        return "Click the camera/microphone icon in your browser's address bar and select 'Allow'.";
      case "notReadable":
        return "Close other applications that might be using your microphone.";
      case "unsupported":
        return "Try using a modern browser like Chrome, Firefox, or Edge.";
      default:
        return "Try refreshing the page or using a different browser.";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg shadow-md max-w-md mx-auto">
      {permission === "prompt" && (
        <div className="text-center">
          {isLoading ? (
            <div className="animate-pulse mb-4">
              <Mic className="h-16 w-16 text-blue-500 mx-auto" />
            </div>
          ) : (
            <div className="mb-4">
              <Mic className="h-16 w-16 text-blue-500 mx-auto" />
            </div>
          )}
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
        <div className="text-center w-full">
          <div className="mb-4 relative">
            {isRecording ? (
              <div className="relative">
                <Mic className="h-16 w-16 text-red-500 mx-auto" />
                <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 animate-ping"></span>
              </div>
            ) : (
              <Mic className="h-16 w-16 text-green-500 mx-auto" />
            )}
          </div>

          <h2 className="text-xl font-bold mb-2">
            {isRecording ? "Recording in Progress" : "Microphone Ready"}
          </h2>

          {recordingStatus === "recording" && (
            <p className="text-gray-600 mb-4">
              Recording audio from your microphone...
            </p>
          )}

          {recordingStatus === "recorded" && (
            <div className="mb-4">
              <p className="text-gray-600 mb-2">Audio recorded successfully!</p>
              <audio src={audioURL} controls className="w-full mt-2" />
            </div>
          )}

          {uploadStatus === "uploading" && (
            <p className="text-blue-500 mb-4">
              <RefreshCw className="h-4 w-4 animate-spin inline mr-2" />
              Uploading audio to server...
            </p>
          )}

          {uploadStatus === "success" && (
            <p className="text-green-500 mb-4">Upload successful!</p>
          )}

          {uploadStatus === "error" && (
            <p className="text-red-500 mb-4">
              Failed to upload audio. Please try again.
            </p>
          )}

          <div className="flex justify-center gap-4">
            {!isRecording ? (
              <button
                onClick={startRecording}
                disabled={isRecording}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <Mic className="h-4 w-4" />
                Start Recording
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors flex items-center gap-2"
              >
                <StopCircle className="h-4 w-4" />
                Stop Recording
              </button>
            )}

            {recordingStatus === "recorded" &&
              uploadStatus !== "uploading" &&
              uploadStatus !== "success" && (
                <button
                  onClick={() =>
                    uploadAudio(
                      new Blob(audioChunksRef.current, { type: "audio/webm" })
                    )
                  }
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Upload Again
                </button>
              )}
          </div>
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
          <h2 className="text-xl font-bold mb-2">Microphone Access Issue</h2>
          <p className="text-gray-600 mb-2">{getErrorMessage()}</p>
          <p className="text-sm text-gray-500 mb-4">{getErrorHelp()}</p>

          <button
            onClick={requestMicrophoneAccess}
            disabled={isLoading || errorType === "unsupported"}
            className={`px-4 py-2 rounded flex items-center justify-center gap-2 mx-auto
              ${
                isLoading || errorType === "unsupported"
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white transition-colors"
              }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Checking...</span>
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                <span>Try Again</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
