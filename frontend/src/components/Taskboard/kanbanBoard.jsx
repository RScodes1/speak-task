import React, { useState, useEffect } from "react";
import KanbanColumn from "./KanbanColumn";
import TaskFormModal from "../Modals/TaskFormModal";
import VoicePreviewModal from "../Modals/VoicePreviewModal";
import useTasks from "../../hooks/useTasks";
import { DragDropContext } from "@hello-pangea/dnd";

export default function KanbanBoard({ createDefaultData }) {
  const { tasks, fetchTasks, getTask, addTask, updateTask, deleteTask } = useTasks();
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

useEffect(() => {
  if (tasks.length === 0) {
    fetchTasks();
  }
}, []);

  const handleUpdateTask = async (updatedTask) => {
  try {
    await updateTask(updatedTask._id, updatedTask);
    // optionally refresh state or update zustand store directly
  } catch (err) {
    console.error(err);
  }
};


  const closeModal = () => {
    setEditingTask(null);
    setIsModalOpen(false);
  };

  
const handleSave = async (data) => {
  try {
    if (editingTask) {
      // UPDATE MODE (called when editingTask is not null)
      await updateTask(editingTask._id, data);
    } else {
      // ADD MODE
      await addTask(data);
    }
  } catch (err) {
    console.error(err);
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

const handleDragEnd = async (result) => {
  const { source, destination, draggableId } = result;

  if (!destination) return;
  if (source.droppableId === destination.droppableId) return;

  const updatedStatus = destination.droppableId;

  const task = tasks.find((t) => t._id === draggableId);

  await updateTask(task._id, { ...task, status: updatedStatus });
};



  return (
    <>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow mb-4"
        onClick={() => setIsModalOpen(true)}
      >
        Add Task
      </button>

 <DragDropContext onDragEnd={handleDragEnd}>
    <div className="grid grid-cols-3 gap-4">
      {columns.map((col) => (
            <KanbanColumn
              key={col.id}
              title={col.title}
              column={col}
              tasks={tasks.filter((t) => t.status === col.id)}
              onEdit={async (task) => {
                // Fetch the latest task from backend before opening modal
                try {
                  const latestTask = await getTask(task._id || task.id);
                  if (!latestTask) {
                    alert("Failed to fetch task details");
                    return;
                  }
                  setEditingTask(latestTask);
                  setIsModalOpen(true);
                } catch (err) {
                  console.error("Failed to fetch single task:", err);
                  alert("Could not fetch task details. Try again.");
                }
              }}
              onUpdate={handleUpdateTask} // for inline status updates
              onDelete={deleteTask}
            />
          ))}
        </div>

 </DragDropContext>
   


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
