"use client";

import { Button } from "@/components/ui/button";
import { useRecordVoice } from "./Mic";

const Microphone = () => {
  const { startRecording, stopRecording } = useRecordVoice();

  return (
    // Button for starting and stopping voice recording
    <Button
      //   onMouseDown={startRecording} // Start recording when mouse is pressed
      //   onMouseUp={stopRecording} // Stop recording when mouse is released
      //   onTouchStart={startRecording} // Start recording when touch begins on a touch device
      //   onTouchEnd={stopRecording} // Stop recording when touch ends on a touch device
      onClick={startRecording}
      className="pointer "
    >
      {/* Microphone icon component */}
      Icon
    </Button>
  );
};

export { Microphone };
