import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    let reply = "🤖 I’m not a doctor, but please consult a physician for proper guidance.";

    const lower = input.toLowerCase();

    // 🔹 Common Medical Problems (offline rules)
    if (lower.includes("fever")) {
      reply = "🤒 Fever: Drink fluids, rest, take paracetamol if needed (follow dosage). See doctor if persists >48 hrs.";
    } else if (lower.includes("high bp") || lower.includes("hypertension")) {
      reply = "🫀 High BP: Reduce salt, exercise, manage stress, take prescribed meds, and consult your physician.";
    } else if (lower.includes("low bp") || lower.includes("hypotension")) {
      reply = "⬇️ Low BP: Drink fluids, add some salt in food, avoid standing long, consult doctor if frequent.";
    } else if (lower.includes("headache")) {
      reply = "🤕 Headache: Rest, drink water, avoid stress, take paracetamol if needed. See doctor if severe.";
    } else if (lower.includes("stomach") || lower.includes("abdominal pain")) {
      reply = "🤢 Stomach Pain: Drink warm water, eat light food, avoid spicy meals. See doctor if persists.";
    } else if (lower.includes("skin") || lower.includes("rash")) {
      reply = "🧴 Skin Problem: Keep area clean, apply moisturizer/soothing cream. Consult dermatologist if severe.";
    } else if (lower.includes("cough") || lower.includes("cold")) {
      reply = "🤧 Cold & Cough: Drink warm fluids, steam inhalation, honey+ginger tea. See doctor if >1 week.";
    } else if (lower.includes("diabetes") || lower.includes("sugar")) {
      reply = "🍭 Diabetes: Eat low-sugar diet, exercise, take medicines regularly, monitor sugar levels.";
    } else if (lower.includes("kidney stone")) {
      reply = "🪨 Kidney Stone: Drink lots of water, avoid salty food, consult doctor for pain relief/scan.";
    } else if (lower.includes("back pain")) {
      reply = "💢 Back Pain: Rest, maintain posture, apply warm compress, light stretching. Doctor if chronic.";
    } else if (lower.includes("weakness") || lower.includes("tired")) {
      reply = "💤 Weakness: Eat balanced diet, stay hydrated, sleep well. Consult doctor if persistent.";
    }

    setMessages([...messages, userMsg, { role: "bot", text: reply }]);
    setInput("");
  };

  return (
    <div className="card p-3 my-4">
      <h5>🩺 Health Chatbot (Offline Mode)</h5>
      <p className="text-muted small">
        ⚠️ Chatbot can only suggest limited common problems. But if problem is high! Then Please consult a Doctor.
      </p>

      <div
        className="chat-box mb-2"
        style={{ maxHeight: 200, overflowY: "auto" }}
      >
        {messages.map((m, i) => (
          <p key={i} className={m.role === "bot" ? "text-success" : "text-primary"}>
            <strong>{m.role === "bot" ? "Bot: " : "You: "}</strong> {m.text}
          </p>
        ))}
      </div>

      <div className="d-flex">
        <input
          className="form-control"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your health problem..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button className="btn btn-success ms-2" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatBot;