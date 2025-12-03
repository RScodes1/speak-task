import React, { useState, useEffect } from "react";

export default function VoicePreviewModal({ data, onClose, onSave }) {
  const [title, setTitle] = useState(data?.title || "");
  const [description, setDescription] = useState(data?.description || "");
  const [priority, setPriority] = useState(data?.priority || "medium");
  const [status, setStatus] = useState(data?.status || "to-do");
  const [dueDate, setDueDate] = useState(
    data?.due_date ? data.due_date.split("T")[0] : ""
  );

  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = () => {
    if (!title) {
      alert("Title is required");
      return;
    }
    onSave({ title, description, priority, status, due_date: dueDate });
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="bg-[#1b1b1d] text-white rounded-lg p-6 w-full max-w-md shadow-2xl transform transition-transform duration-300 ease-out scale-95">
        <h2 className="text-xl font-bold mb-4">Voice Task Preview</h2>

        <p className="mb-2 text-white/70 break-words">
          <strong>Transcript:</strong> {data?.raw_text}
        </p>

        <div className="flex flex-col gap-3 mt-2">
          <input
            type="text"
            placeholder="Title"
            className="border border-white/20 bg-transparent p-2 rounded placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Description"
            className="border border-white/20 bg-transparent p-2 rounded placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex gap-2">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="border border-white/20 bg-transparent p-2 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-white/20 bg-transparent p-2 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="to-do">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <input
            type="datetime-local"
            value={dueDate ? new Date(dueDate).toISOString().slice(0, 16) : ""}
            onChange={(e) => setDueDate(e.target.value)}
            className="border p-2 rounded"
          />

        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors"
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
}
