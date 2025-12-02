import React, { useState } from "react";
import SearchBar from "../components/Controls/SearchBar";
import FilterBar from "../components/Controls/FilterBar";
import KanbanBoard from "../components/Taskboard/KanbanBoard";
import VoiceRecorder from "../components/Voice/VoiceRecorder";
import Header from "../components/Header";

export default function Home() {
  const [parsedVoiceData, setParsedVoiceData] = useState(null);

  return (
    <div className="w-full min-h-screen p-6 bg-gray-100">
      <Header />

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-3">
          <VoiceRecorder
            onVoiceProcessed={(data) => {
              setParsedVoiceData(data); // just pass data to KanbanBoard
            }}
          />
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <SearchBar />
        <FilterBar />
      </div>

      {/* Kanban Board receives voice data */}
      <KanbanBoard createDefaultData={parsedVoiceData} />
    </div>
  );
}
