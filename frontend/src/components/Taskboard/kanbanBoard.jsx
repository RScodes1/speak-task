import React, { useState, useEffect } from "react";
import KanbanColumn from "./KanbanColumn";
import TaskFormModal from "../Modals/TaskFormModal";
import VoicePreviewModal from "../Modals/VoicePreviewModal";
import useTasks from "../../hooks/useTasks";
import { DragDropContext } from "@hello-pangea/dnd";
import ConfirmModal from "../Modals/ConfirmModal";

export default function KanbanBoard({ createDefaultData }) {
  const { tasks, fetchTasks, getTask, addTask, updateTask, deleteTask } = useTasks();
  const [editingTask, setEditingTask] = useState(null);
  const [voiceTaskData, setVoiceTaskData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({ show: false, taskId: null });

const handleDeleteRequest = (taskId) => {
  setConfirmDelete({ show: true, taskId });
};

const handleConfirmDelete = async () => {
  await deleteTask(confirmDelete.taskId);
  setConfirmDelete({ show: false, taskId: null });
};

const handleCancelDelete = () => {
  setConfirmDelete({ show: false, taskId: null });
};

  useEffect(() => {
    if (createDefaultData) {
      setVoiceTaskData(createDefaultData);
      setIsVoiceModalOpen(true);
    }
  }, [createDefaultData]);

  useEffect(() => {
    if (tasks.length === 0) fetchTasks();
  }, []);

  const handleUpdateTask = async (updatedTask) => {
    try {
      await updateTask(updatedTask._id, updatedTask);
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
        await updateTask(editingTask._id, data);
      } else {
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
    <div className="bg-[#121212] min-h-screen text-white p-6">
      {/* Add Task Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-medium shadow-md 
                  hover:bg-green-700 hover:shadow-lg mb-6 active:scale-95 transition-all duration-200"
      >
        <span className="text-lg">➕</span>
        Add Task
      </button>

      {/* Kanban Columns */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map((col) => (
            <KanbanColumn
              key={col.id}
              title={col.title}
              column={col}
              tasks={tasks.filter((t) => t.status === col.id)}
              onEdit={async (task) => {
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
              onUpdate={handleUpdateTask}
              onDeleteRequest={handleDeleteRequest}
            />
          ))}
        </div>
      </DragDropContext>

      {/* Task Modal */}
      {isModalOpen && (
        <TaskFormModal
          initialValues={editingTask}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}

      {confirmDelete.show && (
          <ConfirmModal
            title="Delete Task"
            message="Are you sure you want to delete this task?"
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
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
    </div>
  );
}
