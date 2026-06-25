"use client";

import { useState } from "react";

export default function TaskForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        deadline,
      }),
    });

    const data = await response.json();

console.log("API Response:", data);

if (!response.ok) {
  setLoading(false);
  alert("Error: " + JSON.stringify(data));
  return;
}

setLoading(false);

setTitle("");
setDescription("");
setDeadline("");

window.location.reload();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 border rounded-lg p-4"
    >
      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />

      <textarea
        placeholder="Task Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />

      <button
  type="submit"
  disabled={loading}
  className="bg-black text-white px-4 py-2 rounded"
>
  {loading ? "🤖 Analyzing..." : "Create Task"}
</button>
    </form>
  );
}