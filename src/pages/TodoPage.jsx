import React, { useState, useEffect } from "react";
import { Box, AppBar, Toolbar, Typography, Container } from "@mui/material";
import api from "../api";
import TaskModal from "../components/TaskModal";
import TaskList from "../components/TaskList";

export default function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    api.get("/").then((res) => {
      setTodos(res.data.data || []);
    });
  };

  const handleOpenModal = (todo = null) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTodo(null);
  };

  const handleSubmit = (values) => {
    const cleanValues = {
      ...values,
      subTasks: values.subTasks.filter(st => st.title.trim() !== "")
    };

    if (editingTodo) {
      api.put(`/${editingTodo.id}`, cleanValues).then((res) => {
        setTodos(current => current.map(t => t.id === editingTodo.id ? res.data.data : t));
      });
    } else {
      api.post("/", cleanValues).then((res) => {
        setTodos(current => [...current, res.data.data]);
      });
    }
  };

  const handleDelete = (id) => {
    api.delete(`/${id}`).then(() => {
      setTodos(current => current.filter(t => t.id !== id));
    });
  };

  const handleToggle = (id, newStatus) => {
    const todo = todos.find(t => t.id === id);
    api.put(`/${id}`, { ...todo, status: newStatus }).then((res) => {
      setTodos(current => current.map(t => t.id === id ? res.data.data : t));
    });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            TO-DO APP
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <TaskList
          todos={todos}
          onAddClick={() => handleOpenModal()}
          onEditClick={(todo) => handleOpenModal(todo)}
          onDelete={handleDelete}
          onToggle={handleToggle}
        />

        <TaskModal
          open={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          initialValues={editingTodo}
          mode={editingTodo ? "edit" : "add"}
        />
      </Container>
    </Box>
  );
}