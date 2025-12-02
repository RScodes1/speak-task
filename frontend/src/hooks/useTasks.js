// useTasks.js
import { create } from "zustand";
import { apiGet, apiPost, apiDelete, apiPut } from "../utils/api";

 const useTasks = create((set, get) => ({
  tasks: [],
  loading: false,

  fetchTasks: async () => {
    set({ loading: true });
    try {
      const data = await apiGet("/api/tasks");
      set({ tasks: data.tasks, loading: false });
 
    } catch (err) {
      console.error("Error fetching tasks:", err);
      set({ loading: false });
    }
  },

  addTask: async (text) => {
    try {
      const data = await apiPost("/api/tasks/add-task", text);
      console.log({data});
      set({ tasks: data.tasks });
    } catch (err) {
      console.error("Error adding task:", err);
    }
  },

  updateTask: async (taskId) => {
    try {
       const data = await apiPut("/api/tasks/delete-task", { id: taskId });
      set({ tasks: data.tasks });
    } catch (err) {
       console.error("Error removing task:", err);
    }
  },
  removeTask: async (taskId) => {
    try {
      const data = await apiDelete("/api/tasks/delete-task", { id: taskId });
      set({ tasks: data.tasks });
    } catch (err) {
      console.error("Error removing task:", err);
    }
  },
}));

export default useTasks;