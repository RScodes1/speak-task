// useVoice.js
import { useState, useCallback } from "react";
import { apiPost } from "./api";

export function useVoice() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [result, setResult] = useState(null);

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const recognition = SpeechRecognition
    ? new SpeechRecognition()
    : null;

  if (recognition) {
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      handleCommand(text);
    };

    recognition.onerror = (e) => console.error("Voice error:", e);
  }

  const startListening = useCallback(() => {
    if (!recognition) return alert("Speech Recognition not supported.");
    setListening(true);
    setTranscript("");
    recognition.start();
  }, []);

  const handleCommand = async (text) => {
    try {
      const data = await apiPost("/api/audio/parse", { command: text });
      setResult(data);
    } catch (err) {
      console.error("Voice command error:", err);
    } finally {
      setListening(false);
    }
  };

  return {
    listening,
    transcript,
    result,
    startListening,
  };
}
