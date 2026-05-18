const mongoose = require("mongoose");
const Task = require("../models/task.model");

const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    const task = await Task.create({
      title,
      description,
      createdBy: req.user._id,
    });

    res.status(201).send({
      message: "Task created successfully",
      title: task.title,
      description: task.description,
    });
  } catch (err) {
    res.status(500).send({ message: "Error creating task" });
  }
};

const acceptTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user._id;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).send({ message: "Invalid task ID" });
    }

    // Fetch task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).send({ message: "Task not found" });
    }

    // Only allow accepting pending tasks
    if (task.status !== "pending") {
      return res
        .status(400)
        .send({ message: "Only pending tasks can be accepted" });
    }

    // Prevent accepting own task
    if (task.createdBy.toString() === userId.toString()) {
      return res.status(403).send({ message: "Cannot accept your own task" });
    }

    // Update task
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { assignedTo: userId, status: "accepted" },
      { new: true },
    ).populate("createdBy assignedTo");

    res.status(200).send({
      message: "Task accepted successfully",
      task: updatedTask,
    });
  } catch (err) {
    res.status(500).send({ message: "Error accepting task" });
  }
};

const completeTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid task ID" });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).send({ message: "Task not found" });
    }

    if (task.status !== "accepted") {
      return res
        .status(400)
        .send({ message: "Only accepted tasks can be completed" });
    }

    if (!task.assignedTo || task.assignedTo.toString() !== userId.toString()) {
      return res
        .status(403)
        .send({ message: "Only the assigned provider can complete this task" });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { status: "completed" },
      { new: true },
    ).populate([
      { path: "createdBy", select: "name email" },
      { path: "assignedTo", select: "name email" },
    ]);

    return res.status(200).send({
      message: "Task completed successfully",
      task: updatedTask,
    });
  } catch (err) {
    return res.status(500).send({ message: "Error completing task" });
  }
};

const getMyCreatedTasks = async (req, res) => {
  try {
    const userId = req.user._id;

    const tasks = await Task.find({ createdBy: userId }).populate([
      { path: "createdBy", select: "name email" },
      { path: "assignedTo", select: "name email" },
    ]);

    return res.status(200).send({ tasks });
  } catch (err) {
    return res.status(500).send({ message: "Error fetching created tasks" });
  }
};

const getMyAssignedTasks = async (req, res) => {
  try {
    const userId = req.user._id;

    const tasks = await Task.find({ assignedTo: userId }).populate([
      { path: "createdBy", select: "name email" },
      { path: "assignedTo", select: "name email" },
    ]);

    return res.status(200).send({ tasks });
  } catch (err) {
    return res.status(500).send({ message: "Error fetching assigned tasks" });
  }
};

const getPendingTasks = async (req, res) => {
  try {
    const userId = req.user._id;

    const tasks = await Task.find({
      status: "pending",
      createdBy: { $ne: userId },
    }).populate([{ path: "createdBy", select: "name email" }]);

    return res.status(200).send({ tasks });
  } catch (err) {
    return res.status(500).send({ message: "Error fetching pending tasks" });
  }
};

module.exports = {
  createTask,
  acceptTask,
  completeTask,
  getMyCreatedTasks,
  getMyAssignedTasks,
  getPendingTasks,
};
