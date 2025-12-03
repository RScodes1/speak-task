import { create } from "zustand";
import debounce from "lodash.debounce";
import { apiGet, apiPost, apiPut, apiDelete } from "../utils/api";

const useTasks = create((set, get) => ({

  tasks: [],

  searchTerm: "",
  statusFilter: "",
  priorityFilter: "",

  setSearchTerm: (term) => {
    set({ searchTerm: term });
    get().debouncedFetch();
  },

  setStatusFilter: (status) => {
    set({ statusFilter: status });
    get().debouncedFetch();
  },

  setPriorityFilter: (priority) => {
    set({ priorityFilter: priority });
    get().debouncedFetch();
  },

  // DEBOUNCED FETCH
  debouncedFetch: debounce(() => {
    get().fetchTasks();
  }, 400),

  fetchTasks: async () => {
    try {
      const { searchTerm, statusFilter, priorityFilter } = get();

      const query = `/api/tasks?search=${encodeURIComponent(searchTerm)}&status=${encodeURIComponent(statusFilter)}&priority=${encodeURIComponent(priorityFilter)}`;

      const data = await apiGet(query);

      set({ tasks: data.tasks || [] });
    } catch (err) {
      console.error("Fetch tasks error:", err);
    }
  },

  // ADD TASK
  // ============================
  addTask: async (task) => {
    try {
      const data = await apiPost("/api/tasks/add-task", task);
      set({ tasks: [...get().tasks, data.task] });
    } catch (err) {
      console.error("Add task error:", err);
    }
  },

  // GET SINGLE TASK
  // ============================
  getTask: async (id) => {
    try {
      const data = await apiGet(`/api/tasks/task/${id}`);
      return data.data;
    } catch (err) {
      console.error("Error fetching single task:", err);
      return null;
    }
  },

  // UPDATE TASK
  // ============================
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

  // DELETE TASK
  // ============================
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
