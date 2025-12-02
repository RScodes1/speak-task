
import React, { useState, useRef } from "react";

export default function VoiceRecorder({ onVoiceProcessed }) {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleStart = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        // Send audioBlob to backend /parse-voice API
        // onVoiceProcessed should be called with parsed data
        // Example: await fetchParseVoiceAPI(audioBlob).then(data => onVoiceProcessed(data))
        onVoiceProcessed({
          raw_text: 'Sample transcript',
          title: 'Sample task from voice',
          priority: 'high',
          status: 'to-do',
          due_date: new Date().toISOString()
        });
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error('Microphone access denied', err);
      alert('Please allow microphone access');
    }
  };

  const handleStop = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  return (
    <button
      onClick={recording ? handleStop : handleStart}
      className={`px-4 py-2 rounded ${recording ? 'bg-red-600' : 'bg-green-600'} text-white`}
    >
      {recording ? 'Stop Recording' : 'Start Voice Task'}
    </button>
  );
}
