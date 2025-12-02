import { create } from "zustand";
import { apiGet, apiPost, apiPut, apiDelete } from "../utils/api";

const useTasks = create((set, get) => ({
  tasks: [],

  fetchTasks: async () => {
    try {
      const data = await apiGet("/api/tasks");
      set({ tasks: data.tasks || [] });
    } catch (err) {
      console.error("Fetch tasks error:", err);
    }
  },

  addTask: async (task) => {
    try {
      const data = await apiPost("/api/tasks/add-task", task);
      set({ tasks: [...get().tasks, data.task] });
    } catch (err) {
      console.error("Add task error:", err);
    }
  },

  getTask: async (id) => {
    try {
      const data = await apiGet(`/api/tasks/task/${id}`);
      return data.data; // return task object
    } catch (err) {
      console.error("Error fetching single task:", err);
      return null;
    }
  },


  updateTask: async (taskId, body) => {
    try {
      const data = await apiPut(`/api/tasks/update-task/${taskId}`, body);

      set({
        tasks: get().tasks.map((t) =>
          t._id === taskId ? data.task : t
        ),
      });
    } catch (err) {
      console.error("Update task error:", err);
    }
  },

  deleteTask: async (taskId) => {
    try {
      await apiDelete(`/api/tasks/delete-task/${taskId}`);

      set({
        tasks: get().tasks.filter((t) => t._id !== taskId),
      });
    } catch (err) {
      console.error("Delete task error:", err);
    }
  },
}));

export default useTasks;
