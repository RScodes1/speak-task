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
      className={`flex-1 min-w-[320px] max-w-[450px] p-4 rounded-xl 
            transition-all bg-gray-800 border border-gray-700 
            ${snapshot.isDraggingOver ? "bg-gray-700/70" : ""}`}

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
