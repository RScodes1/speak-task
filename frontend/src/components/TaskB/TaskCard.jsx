import React from "react";
import { Draggable } from "@hello-pangea/dnd";

export default function TaskCard({ task, index, onUpdate, onRequestDelete, onEdit }) {

  const handleStatusChange = (e) => {
    const updatedTask = { ...task, status: e.target.value };
    onUpdate(updatedTask); // full task object sent
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB"); // DD/MM/YYYY
  };

  // Map priority to colors for dark theme
  const priorityColor = {
    low: "text-green-400",
    medium: "text-yellow-400",
    high: "text-red-400",
  };

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="relative p-4 bg-[#1E1E1E] rounded-xl shadow-md mb-3 border border-gray-700 hover:shadow-lg transition-all duration-200"
        >
          {/* Edit Button */}
          <button
            onClick={() => onEdit(task)}
            className="absolute top-2 right-2 px-2 py-1 bg-blue-600 mr-2 text-white text-sm rounded p-2 hover:bg-blue-700 transition-colors"
          >
            Edit
          </button>

          {/* Task Info */}
          <h3 className="font-bold text-lg mb-1 pr-10 truncate">
            {task.title}
          </h3>
          <p className="text-gray-300 mb-1">{task.description}</p>
          <p className="text-gray-400 text-sm mb-2">
             <em>Due: {new Date(task.due_date).toLocaleString()}</em>

          </p>

          <p className={`text-sm font-semibold mb-3 ${priorityColor[task.priority]}`}>
            Priority: {task.priority}
          </p>

          {/* Status + Delete */}
          <div className="flex justify-between items-center">
            <select
              value={task.status}
              onChange={handleStatusChange}
              className="bg-[#2A2A2A] border border-gray-600 text-white p-1 rounded transition-colors hover:bg-[#333]"
            >
              <option value="to-do">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>

            <button
              onClick={() => onRequestDelete(task._id)}
              className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
}
