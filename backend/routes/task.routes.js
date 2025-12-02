const express = require('express');
const taskRouter = express.Router();
const multer = require("multer");
const OpenAI = require("openai");
const chrono = require("chrono-node");
const { TaskModel } = require('../models/tasks.model');
require("dotenv").config();

const upload = multer();

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// nlp parse
taskRouter.post('/audio/parse', upload.single('audio'), async(req, res) => {
    try {
        if(!req.file){
              return res.status(400).json({ error: "Audio file is required" });
        }

           // Convert audio text
            const audioBuffer = req.file.buffer;

            const transcription = await client.audio.transcriptions.create({
            model: "gpt-4o-mini-tts",
            file: audioBuffer,
            response_format: "text",
            });

        const userText = transcription.trim();

       const extractionPrompt = 
       `
        Extract the following fields from the task description:

        Text: "${userText}"

        Return ONLY JSON:
        {
        "title": "",
        "due_date_raw": "",
        "priority": "",
        "status": ""
        }

        Rules:
        - Title: summarize main task
        - Due Date: extract any natural language date phrase (relative or absolute)
        - Priority: look for "urgent", "high", "medium", "low", "critical"
        - Status: default "to-do" unless "in progress", "completed", "done" is explicitly said.`;

    const parsed = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: extractionPrompt }],
            temperature: 0,
            });

    const json = JSON.parse(parsed.choices[0].message.content);

     let dueDate = null;
    if (json.due_date_raw) {
      const parsedDate = chrono.parseDate(json.due_date_raw);
      if (parsedDate) dueDate = parsedDate.toISOString();
    }

    const priority = (() => {
      const p = json.priority?.toLowerCase() || "";
      if (p.includes("urgent") || p.includes("critical") || p.includes("high"))
        return "high";
      if (p.includes("low")) return "low";
      return "medium";
    })();

    const status = (() => {
      const s = json.status?.toLowerCase() || "";
      if (s.includes("progress")) return "in-progress";
      if (s.includes("done") || s.includes("complete")) return "completed";
      return "to-do";
    })();

    return res.json({
      title: json.title || "",
      due_date: dueDate,
      priority,
      status,
      raw_text: userText, // optional for debugging
    });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Voice parsing failed" });
    }
})

// view tasks
taskRouter.get('/tasks', async(req, res) => {
     try {
         const {
            search,
            status,
            priority,
            due_date,
            page = 1,
            limit = 10,
            sort = "createdAt",      // default sort
            order = "desc"           // asc | desc
    } = req.query;

     const query = {};

      if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }
          if (status) {
      query.status = status;
    }

    // Filter: priority
    if (priority) {
      query.priority = priority;
    }

    // Filter: due date (e.g., ?due_date=2025-12-05)
    if (due_date) {
      query.due_date = { $eq: new Date(due_date) };
    }

      const skip = (page - 1) * limit;

        const tasks = await TaskModel.find(query)
      .sort({ [sort]: order === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await TaskModel.countDocuments(query);

    res.json({
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
      tasks
    });
     } catch (error) {
          console.error(error);
       res.status(500).json({ error: "Failed to fetch tasks" });
     }
});

// create task
taskRouter.post('/tasks/add-task', async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    // Basic validation
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const newTask = await TaskModel.create({
      title,
      description,
      status,
      priority,
      due_date: dueDate,
    });

    return res.status(201).json({
      message: "Task created successfully",
      task: newTask,
    });

  } catch (error) {
    console.error("ADD TASK ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// update a task
taskRouter.put('/tasks/update-task/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const updatedTask = await TaskModel.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });

  } catch (error) {
    console.error("UPDATE TASK ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// delete a task
taskRouter.delete('/tasks/delete-task/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTask = await TaskModel.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json({
      message: "Task deleted successfully",
      task: deletedTask,
    });

  } catch (error) {
    console.error("DELETE TASK ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = {
    taskRouter
}