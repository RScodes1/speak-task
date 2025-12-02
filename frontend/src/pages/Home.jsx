import React, { useState } from "react";
import SearchBar from "../components/Controls/SearchBar";
import FilterBar from "../components/Controls/FilterBar";
import KanbanBoard from "../components/Taskboard/kanbanBoard"
import TaskFormModal from "../components/Modals/TaskFormModal";
import VoicePreviewModal from "../components/Modals/VoicePreviewModal";
import VoiceRecorder from "../components/Voice/VoiceRecorder";
import Header from "../components/Header";

export default function Home() {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [parsedVoiceData, setParsedVoiceData] = useState(null);

  return (
    <div className="w-full min-h-screen p-6 bg-gray-100">
      {/* Header */}
       <Header/>
      <div className="flex justify-between items-center mb-6">

        <div className="flex gap-3">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow"
            onClick={() => setIsTaskModalOpen(true)}
          >
            Add Task
          </button>

          {/* Voice Recorder Button */}
          <VoiceRecorder
            onVoiceProcessed={(data) => {
              setParsedVoiceData(data);
              setIsVoiceModalOpen(true);
            }}
          />
        </div>
      </div>

      {/* Search + Filter Section */}
      <div className="flex gap-4 mb-6">
        <SearchBar />
        <FilterBar />
      </div>

      {/* Kanban Task Board */}
      <KanbanBoard />

      {/* Manual Add/Edit Task Modal */}
      {isTaskModalOpen && (
        <TaskFormModal onClose={() => setIsTaskModalOpen(false)} />
      )}

      {/* Voice Parsed Preview Modal */}
      {isVoiceModalOpen && parsedVoiceData && (
        <VoicePreviewModal
          data={parsedVoiceData}
          onClose={() => setIsVoiceModalOpen(false)}
        />
      )}
    </div>
  );
};

