import React, { useState } from "react";
import api from "./api";

export default function TaskDetail({ todo, setTodos, setEditingId }) {
  const [title, setTitle] = useState(todo.title);

  function handleSave() {
    api.put(`/${todo.id}`, { ...todo, title }).then((res) => {
      setTodos((current) =>
        current.map((t) => (t.id === todo.id ? res.data : t))
      );
      setEditingId(null);
    });
  }

  function handleDelete() {
    api.delete(`/${todo.id}`).then(() => {
      setTodos((current) => current.filter((t) => t.id !== todo.id));
      setEditingId(null);
    });
  }

  return (
    <div className="task-detail">
      <h2>Edit Task</h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
      />

      <button className="btn" onClick={handleSave}>
        Save
      </button>

      <button
        onClick={handleDelete}
        style={{ marginLeft: "0.5rem" }}
      >
        Delete
      </button>
    </div>
  );
}