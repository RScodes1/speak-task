import React, { useState } from "react";

export default function FilterBar({ onFilterChange }) {
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');

  const handleFilterChange = () => {
    if(onFilterChange){
      onFilterChange({ status, priority });
    }
  };

  return (
    <div className="flex gap-2">
      <select
        value={status}
        onChange={(e) => { setStatus(e.target.value); handleFilterChange(); }}
        className="border p-2 rounded"
      >
        <option value="">All Status</option>
        <option value="to-do">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      <select
        value={priority}
        onChange={(e) => { setPriority(e.target.value); handleFilterChange(); }}
        className="border p-2 rounded"
      >
        <option value="">All Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="critical">Critical</option>
      </select>
    </div>
  );
}
