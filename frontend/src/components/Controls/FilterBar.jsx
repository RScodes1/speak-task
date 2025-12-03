import React from "react";
import useTasks from "../../hooks/useTasks";

export default function FilterBar() {
  const setStatusFilter = useTasks((s) => s.setStatusFilter);
  const setPriorityFilter = useTasks((s) => s.setPriorityFilter);

  const selectClasses = `
    px-3 py-2 
    bg-[#1b1b1d] 
    text-white/80 
    border border-white/10 
    rounded-lg
    focus:outline-none focus:ring-2 focus:ring-green-500
    hover:bg-white/5
    transition-all duration-200
  `;

  return (
    <div className="flex gap-2">
      <select
        onChange={(e) => setStatusFilter(e.target.value)}
        className={selectClasses}
      >
        <option value="">All Status</option>
        <option value="to-do">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      <select
        onChange={(e) => setPriorityFilter(e.target.value)}
        className={selectClasses}
      >
        <option value="">All Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>
  );
}
