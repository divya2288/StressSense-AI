import React, { useRef } from "react";

export default function EmotionCam() {
  const videoRef = useRef();

  const startCam = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
  };

  return (
    <div className="card">
      <h2>🙂 Emotion Detection</h2>

      <video ref={videoRef} autoPlay width="250" />

      <button onClick={startCam}>Start Camera</button>

      <p>Emotion: Neutral</p>
    </div>
  );
}
