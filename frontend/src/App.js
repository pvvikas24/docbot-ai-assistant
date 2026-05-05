import { useState } from "react";

function App() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    if (!question) return;

    const userMsg = { type: "user", text: question };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question })
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { type: "bot", text: data.answer }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "Error connecting to backend" }
      ]);
    }

    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter") askQuestion();
  };

  return (
    <div style={styles.app}>
      
      {/* Header */}
      <div style={styles.header}>
        <h2>🤖 DocBot</h2>
      </div>

      {/* Chat area */}
      <div style={styles.chatBox}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={
              msg.type === "user"
                ? styles.userMsg
                : styles.botMsg
            }
          >
            {msg.text}
          </div>
        ))}

        {loading && (
          <div style={styles.botMsg}>Thinking...</div>
        )}
      </div>

      {/* Input */}
      <div style={styles.inputArea}>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask anything..."
          style={styles.input}
        />
        <button onClick={askQuestion} style={styles.button}>
          ➤
        </button>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        Made with 💖 by Vikas
      </div>
    </div>
  );
}

const styles = {
  app: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#0f172a",   // dark bg
    color: "#fff",
    fontFamily: "Segoe UI, sans-serif"
  },

  header: {
    padding: "15px 20px",
    borderBottom: "1px solid #1e293b",
    fontWeight: "bold",
    fontSize: "18px"
  },

  chatBox: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },

  userMsg: {
    alignSelf: "flex-end",
    background: "#2563eb",
    padding: "10px 14px",
    borderRadius: "12px",
    maxWidth: "60%"
  },

  botMsg: {
    alignSelf: "flex-start",
    background: "#1e293b",
    padding: "10px 14px",
    borderRadius: "12px",
    maxWidth: "60%"
  },

  inputArea: {
    display: "flex",
    padding: "15px",
    borderTop: "1px solid #1e293b",
    background: "#020617"
  },

  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    outline: "none",
    background: "#1e293b",
    color: "#fff"
  },

  button: {
    marginLeft: "10px",
    padding: "12px 16px",
    borderRadius: "8px",
    border: "none",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer"
  },

  footer: {
    textAlign: "center",
    padding: "8px",
    fontSize: "12px",
    color: "#94a3b8"
  }
};

export default App;