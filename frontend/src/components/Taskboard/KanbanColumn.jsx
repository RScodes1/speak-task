import TaskCard from "./TaskCard";
import { Droppable } from "@hello-pangea/dnd";

export default function KanbanColumn({ column, title, tasks, onDeleteRequest, onUpdate, onEdit }) {
  const displayTitle = title.replace("-", " ").toUpperCase();

  return (
    <Droppable droppableId={column.id}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`min-h-[200px] p-4 rounded-xl transition-all duration-200
            ${snapshot.isDraggingOver ? "bg-[#2A2A2A]" : "bg-[#1B1B1B]"} border border-gray-700`}
        >
          {/* Column Title */}
          <h2 className="text-lg font-bold mb-4 text-center text-white tracking-wide">
            {displayTitle}
          </h2>

          {/* Tasks */}
          <div className="flex flex-col gap-3">
            {tasks.map((task, index) => (
              <TaskCard
                key={task._id}
                task={task}
                index={index}
                onEdit={onEdit}
                onUpdate={onUpdate}
               onRequestDelete={onDeleteRequest}
              />
            ))}

            {/* Placeholder for drag */}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
}
