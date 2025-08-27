
import React, { useEffect, useState } from "react";

interface Task {
  id: string;
  task: string;
  completed: boolean;
}

const API_URL =
  "https://z0inj9ctq9.execute-api.eu-north-1.amazonaws.com/prod/hello";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  // Fetch tasks (but start with empty list each reload)
  useEffect(() => {
    setTasks([]); // 👈 reset every reload (no persistence)
  }, []);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const newItem: Task = {
      id: Date.now().toString(),
      task: newTask,
      completed: false,
    };

    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newTask }),
      });
      setTasks([...tasks, newItem]);
      setNewTask("");
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  };

  const toggleComplete = (id: string) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div className="app-container">
      <h1 className="title">✅ To-Do List</h1>
      <form className="task-form" onSubmit={handleAddTask}>
        <input
          type="text"
          placeholder="Enter a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="task-input"
        />
        <button type="submit" className="add-btn">
          Add
        </button>
      </form>

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <span
              className={`task-text ${task.completed ? "completed" : ""}`}
              onClick={() => toggleComplete(task.id)}
            >
              {task.task}
            </span>
            <button className="delete-btn" onClick={() => deleteTask(task.id)}>
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;



