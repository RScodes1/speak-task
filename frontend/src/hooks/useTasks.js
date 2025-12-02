// useTasks.js
import { create } from "zustand";
import { apiGet, apiPost } from "./api";

export const useTasks = create((set, get) => ({
  tasks: [],
  loading: false,

  fetchTasks: async () => {
    set({ loading: true });
    try {
      const data = await apiGet("/tasks");
      set({ tasks: data.tasks, loading: false });
    } catch (err) {
      console.error("Error fetching tasks:", err);
      set({ loading: false });
    }
  },

  addTask: async (text) => {
    try {
      const data = await apiPost("/add-task", { task: text });
      set({ tasks: data.tasks });
    } catch (err) {
      console.error("Error adding task:", err);
    }
  },

  removeTask: async (taskId) => {
    try {
      const data = await apiPost("/delete-task", { id: taskId });
      set({ tasks: data.tasks });
    } catch (err) {
      console.error("Error removing task:", err);
    }
  },
}));
