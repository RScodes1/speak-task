import React, { useState } from "react";
import KanbanColumn from "./KanbanColumn";
import TaskCard from "./TaskCard";

export default function KanbanBoard() {
  // Sample initial tasks, normally fetched via API
  const [tasks, setTasks] = useState([
    { id: 1, title: "Task 1", status: "to-do", priority: "high", due_date: "2025-12-05" },
    { id: 2, title: "Task 2", status: "in-progress", priority: "medium", due_date: "2025-12-06" },
    { id: 3, title: "Task 3", status: "completed", priority: "low", due_date: "2025-12-07" },
  ]);

  const statuses = ["to-do", "in-progress", "completed"];

  const handleUpdateTask = (updatedTask) => {
    setTasks((prevTasks) => prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  const handleDeleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="flex gap-4 overflow-x-auto">
      {statuses.map((status) => (
        <KanbanColumn key={status} title={status}>
          {tasks.filter(task => task.status === status).map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
            />
          ))}
        </KanbanColumn>
      ))}
    </div>
  );
}
