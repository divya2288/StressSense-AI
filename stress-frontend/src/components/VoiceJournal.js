import { useState } from "react";

export default function VoiceJournal() {
  const [text, setText] = useState("");

  const speak = () => {
    const rec = new window.webkitSpeechRecognition();
    rec.onresult = e => setText(e.results[0][0].transcript);
    rec.start();
  };

  return (
    <div className="card">
      <h2>🎤 Voice Journal</h2>

      <button onClick={speak}>Speak</button>

      <textarea value={text} rows="4"/>
    </div>
  );
}
