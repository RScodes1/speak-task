import React from "react";
import { Draggable } from "@hello-pangea/dnd";

export default function TaskCard({ task, index, onUpdate, onDelete, onEdit }) {
  const handleStatusChange = (e) => {
    const updatedTask = { ...task, status: e.target.value };
    onUpdate(updatedTask); // full task object sent
  };

  return (
     <Draggable draggableId={task._id} index={index}>
      {(provided) => (
       <div
  className="relative p-3 bg-white shadow rounded mb-3"
  ref={provided.innerRef}
  {...provided.draggableProps}
  {...provided.dragHandleProps}
>

      <button
        onClick={() => onEdit(task)}
        className="absolute top-2 right-2 px-2 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-700"
      >
        Edit
      </button>

      <h3 className="font-bold text-lg mb-1">{task.title}</h3>
      <p className="text-gray-600 mb-1">{task.description}</p>
      <p className="text-sm text-gray-500 mb-1">Due: {task.due_date}</p>

      <p
        className={`text-sm font-semibold mb-2 ${
          task.priority === "high"
            ? "text-red-600"
            : task.priority === "medium"
            ? "text-yellow-600"
            : "text-green-600"
        }`}
      >
        Priority: {task.priority}
      </p>

      <div className="flex justify-between items-center">
        <select
          value={task.status}
          onChange={handleStatusChange}
          className="border p-1 rounded"
        >
          <option value="to-do">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <button
          onClick={() => onDelete(task._id)}
          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
       )}
     </Draggable>
  );
}
