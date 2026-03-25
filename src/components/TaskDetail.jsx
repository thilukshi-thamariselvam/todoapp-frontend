import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import api from "../api";

export default function TaskDetail({ todo, setTodos, setEditingId }) {
  const [title, setTitle] = useState(todo.title);

  function handleSave() {
    api.put(`/${todo.id}`, { ...todo, title })
      .then((res) => {
        setTodos((current) =>
          current.map((t) => (t.id === todo.id ? res.data.data : t))
        );
        setEditingId(null);
      })
      .catch((err) => {
        console.error("Error saving todo:", err);
      });
  }

  function handleDelete() {
    api.delete(`/${todo.id}`)
      .then(() => {
        setTodos((current) => current.filter((t) => t.id !== todo.id));
        setEditingId(null);
      })
      .catch((err) => {
        console.error("Error deleting todo:", err);
      });
  }

  return (
    <Box className="task-detail" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <h2>Edit Task</h2>

      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        variant="outlined"
        fullWidth
      />

      <Box sx={{ display: "flex", gap: 1 }}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
        <Button variant="contained" color="error" onClick={handleDelete}>
          Delete
        </Button>
      </Box>
    </Box>
  );
}