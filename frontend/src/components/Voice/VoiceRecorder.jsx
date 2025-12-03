import React, { useEffect } from "react";
import { useVoice } from "../../hooks/useVoice";
import { Mic, MicOff, Loader2 } from "lucide-react";

export default function VoiceRecorder({ onVoiceProcessed }) {
  const {
    listening,
    processing,
    result,
    startListening,
    stopListening,
  } = useVoice();

  // Notify parent when result is ready
  useEffect(() => {
    if (result) onVoiceProcessed(result);
  }, [result]);

  return (
    <button
      onClick={listening ? stopListening : startListening}
      disabled={processing}
      className={`mt-3 px-5 py-3 rounded-xl flex items-center gap-2 text-white font-medium 
        transition-all duration-300 shadow-md relative
        ${
          processing
            ? "bg-gray-400 cursor-not-allowed"
            : listening
            ? "bg-red-600 hover:bg-red-700"
            : "bg-green-600 hover:bg-green-700"
        }
      `}
    >
      {/* Animated Pulse Behind Button When Listening */}
      {listening && !processing && (
        <span className="absolute inset-0 rounded-xl bg-red-500 opacity-30"></span>
      )}

      {/* Icon */}
      {processing ? (
        <Loader2 className="animate-spin w-5 h-5" />
      ) : listening ? (
        <MicOff className="w-5 h-5" />
      ) : (
        <Mic className="w-5 h-5" />
      )}

      {/* Button Text */}
      {processing
        ? "Processing..."
        : listening
        ? "Stop Recording"
        : "Start Voice Task"}
    </button>
  );
}
