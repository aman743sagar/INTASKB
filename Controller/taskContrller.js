const Task= require('../Model/task')

const createTask= async  (req,res)=>{
    try {
        const { title, description } = req.body;
        if (!title) {
        return res.status(400).json({ message: "Title is required" });
       }
       const task=new Task({
        title,
        description,
        user:req.userId
       })
       await task.save();
       return res.status(201).json({ message: "Task created successfully", task });
    } catch (error) {
        console.error("Create task error:", error);
    res.status(500).json({ message: "Failed to create task", error: error.message });
    }

}

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ message: "Failed to fetch tasks", error: error.message });
  }
};



const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.userId });
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (error) {
    console.error("Get task by ID error:", error);
    res.status(500).json({ message: "Failed to fetch task", error: error.message });
  }
};



const updateTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId},
      { title, description },
      { new: true }
    );

    if (!task) return res.status(404).json({ message: "Task not found or not authorized" });

    res.json({ message: "Task updated successfully", task });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ message: "Failed to update task", error: error.message });
  }
};


const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!task) return res.status(404).json({ message: "Task not found or not authorized" });

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ message: "Failed to delete task", error: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
};