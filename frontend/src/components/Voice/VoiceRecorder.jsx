import React, { useEffect } from "react";
import { useVoice } from "../../hooks/useVoice";

export default function VoiceRecorder({ onVoiceProcessed }) {
  const {
    listening,
    processing,
    result,
    startListening,
    stopListening,
  } = useVoice();

  // When parsing finished → send to parent
  useEffect(() => {
    if (result) onVoiceProcessed(result);
  }, [result]);

  return (
    <button
      onClick={listening ? stopListening : startListening}
      disabled={processing}
      className={`px-4 py-2 rounded text-white ${
        listening ? "bg-red-600" : "bg-green-600"
      }`}
    >
      {processing
        ? "Processing..."
        : listening
        ? "Stop Recording"
        : "Start Voice Task"}
    </button>
  );
}
