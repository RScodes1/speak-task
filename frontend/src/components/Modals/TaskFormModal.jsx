import React, { useState } from "react";

export default function TaskFormModal({ onClose, onSave, initialValues }) {
  const [title, setTitle] = useState(initialValues?.title || "");
  const [description, setDescription] = useState(initialValues?.description || "");
  const [priority, setPriority] = useState(initialValues?.priority || "medium");
  const [status, setStatus] = useState(initialValues?.status || "to-do");
  const [dueDate, setDueDate] = useState(initialValues?.dueDate || "");

  const handleSave = () => {
    if (!title) {
      alert("Title is required");
      return;
    }
    onSave({ title, description, priority, status, dueDate });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">{initialValues ? "Edit Task" : "Add Task"}</h2>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Title"
            className="border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Description"
            className="border p-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex gap-2">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="border p-2 rounded flex-1"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border p-2 rounded flex-1"
            >
              <option value="to-do">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="border p-2 rounded"
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {initialValues ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
