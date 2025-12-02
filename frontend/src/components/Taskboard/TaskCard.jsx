import React from "react";

export default function TaskCard({ task, onUpdate, onDelete }) {
  const handleStatusChange = (e) => {
    const updatedTask = { ...task, status: e.target.value };
    onUpdate(updatedTask);
  };

  return (
    <div className="border p-3 rounded-lg shadow bg-white mb-3">
      <h3 className="font-bold text-lg mb-1">{task.title}</h3>
      <p className="text-gray-600 mb-1">{task.description}</p>
      <p className="text-sm text-gray-500 mb-1">Due: {task.due_date}</p>
      <p className={`text-sm font-semibold mb-2 ${task.priority === 'high' ? 'text-red-600' : task.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>Priority: {task.priority}</p>

      <div className="flex justify-between items-center">
        <select value={task.status} onChange={handleStatusChange} className="border p-1 rounded">
          <option value="to-do">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <button
          onClick={() => onDelete(task.id)}
          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
