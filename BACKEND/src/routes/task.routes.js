const express = require("express");
const protect = require("../middleware/auth.middleware");
const {
  createTask,
  acceptTask,
  completeTask,
  getMyCreatedTasks,
  getMyAssignedTasks,
  getPendingTasks,
} = require("../controllers/task.controller");

const router = express.Router();


router.get("/pending-tasks", protect, getPendingTasks);
router.post("/create-task", protect, createTask);
router.put("/:taskId/accept", protect, acceptTask);
router.put("/complete-task/:id", protect, completeTask);
router.get("/my-created-tasks", protect, getMyCreatedTasks);
router.get("/my-assigned-tasks", protect, getMyAssignedTasks);

router.get("/profile", protect, (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  });
});

module.exports = router;