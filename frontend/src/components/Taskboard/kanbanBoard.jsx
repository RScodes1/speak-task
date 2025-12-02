import React, { useState, useEffect } from "react";
import KanbanColumn from "./KanbanColumn";
import TaskFormModal from "../Modals/TaskFormModal";
import VoicePreviewModal from "../Modals/VoicePreviewModal";
import useTasks from "../../hooks/useTasks";

export default function KanbanBoard({ createDefaultData }) {
  const { tasks, addTask, updateTask, deleteTask } = useTasks();

  const [editingTask, setEditingTask] = useState(null);
  const [voiceTaskData, setVoiceTaskData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  // Open voice modal whenever new voice data comes in
  useEffect(() => {
    if (createDefaultData) {
      setVoiceTaskData(createDefaultData);
      setIsVoiceModalOpen(true);
    }
  }, [createDefaultData]);

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingTask(null);
    setIsModalOpen(false);
  };

  const handleSave = async (data) => {
    if (editingTask) {
      await updateTask(editingTask.id, data);
    } else {
      await addTask(data);
    }
    closeModal();
  };

  const handleVoiceSave = async (data) => {
    await addTask(data);
    setIsVoiceModalOpen(false);
    setVoiceTaskData(null);
    // Optionally open manual edit modal for further changes
    // setEditingTask(data); 
    // setIsModalOpen(true);
  };

  const columns = [
    { id: "to-do", title: "To Do" },
    { id: "in-progress", title: "In Progress" },
    { id: "done", title: "Done" },
  ];

  return (
    <>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow mb-4"
        onClick={() => setIsModalOpen(true)}
      >
        Add Task
      </button>

      <div className="grid grid-cols-3 gap-4">
        {columns.map((col) => (
          <KanbanColumn
            key={col.id}
            title={col.title}
            status={col.id}
            tasks={tasks.filter((t) => t.status === col.id)}
            onEdit={openEditModal}
            onDelete={deleteTask}
          />
        ))}
      </div>

      {/* Manual Create/Edit Modal */}
      {isModalOpen && (
        <TaskFormModal
          initialValues={editingTask}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}

      {/* Voice Preview Modal */}
      {isVoiceModalOpen && voiceTaskData && (
        <VoicePreviewModal
          data={voiceTaskData}
          onClose={() => setIsVoiceModalOpen(false)}
          onSave={handleVoiceSave}
        />
      )}
    </>
  );
}
