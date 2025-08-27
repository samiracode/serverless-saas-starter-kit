
import { useState, useEffect } from "react";

const API_URL = "https://z0inj9ctq9.execute-api.eu-north-1.amazonaws.com/prod/hello";

interface Task {
  id: string;
  task: string;
  done: boolean;
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");

  // Load tasks on mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error("Failed to fetch tasks", err);
      }
    };
    fetchTasks();
  }, []);

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: input }),
      });
      const newTask = await res.json();
      setTasks([...tasks, newTask]);
      setInput("");
    } catch (err) {
      console.error("Failed to add task", err);
    }
  };

  const toggleTask = async (id: string, done: boolean) => {
    try {
      const res = await fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, done: !done }),
      });
      const updated = await res.json();
      setTasks(tasks.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      console.error("Failed to toggle task", err);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await fetch(API_URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  const clearAll = async () => {
    try {
      await fetch(API_URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clearAll: true }),
      });
      setTasks([]);
    } catch (err) {
      console.error("Failed to clear all tasks", err);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>✅ To-Do List</h1>

      <form onSubmit={addTask} style={{ display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a task..."
          style={{ flex: 1, padding: "0.5rem" }}
        />
        <button type="submit">Add</button>
      </form>

      <button
        onClick={clearAll}
        style={{ marginTop: "1rem", background: "red", color: "white", padding: "0.5rem" }}
      >
        Clear All
      </button>

      <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem" }}>
        {tasks.map((t) => (
          <li key={t.id} style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
            <input
              type="checkbox"
              checked={t.done}
              onChange={() => toggleTask(t.id, t.done)}
            />
            <span
              style={{
                flex: 1,
                marginLeft: "0.5rem",
                textDecoration: t.done ? "line-through" : "none",
              }}
            >
              {t.task}
            </span>
            <button onClick={() => deleteTask(t.id)} style={{ marginLeft: "0.5rem" }}>
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}


