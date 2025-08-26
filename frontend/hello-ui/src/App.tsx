import { useEffect, useState } from "react";

interface Message {
  id: string;
  message: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const API_URL =
    "https://z0inj9ctq9.execute-api.eu-north-1.amazonaws.com/prod/hello";

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: newMessage }),
      });

      const data = await res.json();
      console.log("POST response:", data); // 👀 log API response

      setNewMessage("");
      setStatusMessage("Message sent!");
      setTimeout(() => setStatusMessage(""), 3000);

      fetchMessages(); // Refresh list
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Hello App</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Write a message..."
          style={{ padding: "0.5rem", width: "300px" }}
        />
        <button type="submit" style={{ marginLeft: "1rem" }}>
          Send
        </button>
      </form>

      {statusMessage && <p style={{ color: "green" }}>{statusMessage}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {messages.map((msg) => (
            <li key={msg.id}>{msg.message}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;

