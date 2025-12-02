import React from "react";

export default function KanbanColumn({ title, children }) {
  const displayTitle = title.replace('-', ' ').toUpperCase();

  return (
    <div className="flex-1 bg-gray-100 p-4 rounded-lg min-w-[250px]">
      <h2 className="text-xl font-bold mb-4 text-center">{displayTitle}</h2>
      <div className="flex flex-col gap-2">
        {children}
      </div>
    </div>
  );
}