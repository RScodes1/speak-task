const express = require('express');
const multer = require("multer");
const fs = require("fs");

const path = require("path");
const chrono = require("chrono-node");
const OpenAI = require("openai");
const { TaskModel } = require('../models/tasks.model');

const taskRouter = express.Router();
const upload = multer();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


function parseModelJSON(text) {
  try {
    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Failed to parse model JSON:", text);
    throw err;
  }
}

taskRouter.post("/audio/parse", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Audio file is required" });
    }

    // Ensure supported file extension
    let ext = path.extname(req.file.originalname).toLowerCase();
    if (![".wav", ".webm", ".mp3", ".m4a", ".ogg"].includes(ext)) {
      ext = ".wav"; // fallback
    }

    // Write buffer to temp file
    const tmpPath = `/tmp/${Date.now()}${ext}`;
    fs.writeFileSync(tmpPath, req.file.buffer);

    // Transcribe using Whisper
    const transcriptionResult = await client.audio.transcriptions.create({
      model: "whisper-1",
      file: fs.createReadStream(tmpPath),
      filename: path.basename(tmpPath),
    });

    // Cleanup temp file
    fs.unlinkSync(tmpPath);

    const userText = transcriptionResult.text.trim();

    // Extract task fields via Chat Completion
    const extractionPrompt = `
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
      - Due Date: extract natural language date
      - Priority: "urgent", "high", "medium", "low", "critical"
      - Status: default "to-do" unless "in-progress" or "done" is mentioned
    `;

    const parsed = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: extractionPrompt }],
      temperature: 0,
    });

    // const json = JSON.parse(parsed.choices[0].message.content);
    const json = parseModelJSON(parsed.choices[0].message.content);


    // Parse due date
    let dueDate = null;
    if (json.due_date_raw) {
      const parsedDate = chrono.parseDate(json.due_date_raw);
      if (parsedDate) dueDate = parsedDate.toISOString();
    }

    // Normalize priority
    const priority = (() => {
      const p = (json.priority || "").toLowerCase();
      if (p.includes("urgent") || p.includes("high") || p.includes("critical")) return "high";
      if (p.includes("low")) return "low";
      return "medium";
    })();

    // Normalize status
    const status = (() => {
      const s = (json.status || "").toLowerCase();
      if (s.includes("progress")) return "in-progress";
      if (s.includes("done") || s.includes("complete")) return "done";
      return "to-do";
    })();

    return res.json({
      title: json.title || "",
      due_date: dueDate,
      priority,
      status,
      raw_text: userText,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Voice parsing failed" });
  }
});


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

taskRouter.get('/tasks/task/:id', async(req, res) => {
   try {
      const { id } = req.params;
        const existingTask = await TaskModel.findById({_id : id});
      return res.json({ message: "Single task retreived", data : existingTask});
          
   } catch (error) {
      console.error("ADD TASK ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
   }
})

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