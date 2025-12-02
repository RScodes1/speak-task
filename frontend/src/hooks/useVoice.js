// useVoice.js
import { useState, useRef } from "react";
import { apiPost } from "../utils/api";

export function useVoice() {
  const [listening, setListening] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // -------------------------------------
  // Start Recording
  // -------------------------------------
  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        // Use the REAL MIME type of the audio chunks
        const blob = new Blob(chunksRef.current, {
          type: chunksRef.current[0].type,
        });

        await sendAudio(blob);
      };

      recorder.start();
      setListening(true);
    } catch (err) {
      console.error("Microphone error:", err);
      alert("Microphone access denied.");
    }
  };

  // -------------------------------------
  // Stop Recording
  // -------------------------------------
  const stopListening = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setListening(false);
    }
  };

  // -------------------------------------
  // Send Audio to Backend
  // -------------------------------------
  const sendAudio = async (blob) => {
    setProcessing(true);

    try {
      const formData = new FormData();
      formData.append("audio", blob, "voice.webm"); // field name must match backend

      // Debug: ensure formdata has file
      // console.log([...formData.entries()]);

      const res = await apiPost("/api/audio/parse", formData );

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Voice parsing failed");

      setResult(data); // final parsed task fields

    } catch (err) {
      console.error("Voice parsing error:", err);
      alert("Could not parse voice task.");
    } finally {
      setProcessing(false);
    }
  };

  return {
    listening,
    processing,
    result,
    startListening,
    stopListening,
  };
}
