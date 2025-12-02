import TaskCard from "./TaskCard";
import { Droppable } from "@hello-pangea/dnd";

export default function KanbanColumn({ column, title, tasks, onDelete, onUpdate, onEdit }) {
  const displayTitle = title.replace("-", " ").toUpperCase();

   return (
    <Droppable droppableId={column.id}>
      {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`min-h-[200px] p-2 rounded-lg ${
              snapshot.isDraggingOver ? "bg-blue-100" : "bg-white"
            }`}
          >
          <h2 className="text-xl font-bold mb-4 text-center">{displayTitle}</h2>

          <div className="flex flex-col gap-2">
            {tasks.map((task, index) => (
              <TaskCard
                key={task._id}
                task={task}
                index={index}
                onEdit={onEdit}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
}
