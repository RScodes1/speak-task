const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: 3,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    status: {
      type: String,
      enum: ["To Do", "In Progress", "Done"],
      default: "pending",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    due_date: {
      type: Date,
    },
    is_deleted: {
        type: Boolean
    }
  },

  { timestamps: true }
);

const TaskModel = mongoose.model("tasks", taskSchema);

module.exports = { TaskModel };

