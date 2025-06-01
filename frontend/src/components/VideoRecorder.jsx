import React, { useRef, useState, useEffect } from "react";

const VideoRecorder = ({ submitting }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [recording, setRecording] = useState(false);

  // Start webcam preview on mount
  useEffect(() => {
    let localStream;
    const enableWebcam = async () => {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(localStream);
        if (videoRef.current) {
          videoRef.current.srcObject = localStream;
        }
      } catch (err) {
        // Optionally show error
      }
    };
    enableWebcam();
    // Listen for custom event to close webcam
    const closeHandler = () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    };
    window.addEventListener("close-webcam", closeHandler);
    return () => {
      window.removeEventListener("close-webcam", closeHandler);
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Turn off webcam when submitting (interview complete)
  useEffect(() => {
    if (submitting && stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [submitting, stream]);

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="w-full mt-2">
        <video ref={videoRef} autoPlay muted className="w-full rounded border" />
        {!stream && <div className="text-gray-500">Webcam preview unavailable.</div>}
      </div>
      <div className="text-gray-600 text-sm mt-2">Webcam is enabled for preview and recording. Your video is not stored.</div>
    </div>
  );
};

export default VideoRecorder;
