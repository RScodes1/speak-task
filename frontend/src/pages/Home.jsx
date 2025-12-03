import React, { useState } from "react";
import SearchBar from "../components/Controls/SearchBar";
import FilterBar from "../components/Controls/FilterBar";
import VoiceRecorder from "../components/Voice/VoiceRecorder";
import Header from "../components/Header";
import KanbanBoard from "../components/task-temp/KanbanBoard.jsx";

export default function Home() {
  const [parsedVoiceData, setParsedVoiceData] = useState(null);

  return (
    <div className="w-full min-h-screen p-6 bg-gray-900 text-gray-200">
      <Header />

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <SearchBar />
        <FilterBar />
      </div>

      <div className="flex justify-between items-center mb-6">
        <VoiceRecorder
          onVoiceProcessed={(data) => setParsedVoiceData(data)}
        />
      </div>

      <KanbanBoard createDefaultData={parsedVoiceData} />
    </div>
  );
}
