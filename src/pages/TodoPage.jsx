import React, { useState } from "react";
import { Box, AppBar, Toolbar, Typography, Container, IconButton } from "@mui/material";
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import TaskModal from "../components/TaskModal";
import TaskList from "../components/TaskList";
import { createTodo, updateTodo, deleteTodo } from "../api";

export default function TodoPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const handleOpenModal = (todo = null) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTodo(null);
  };

  const formatDateForBackend = (date) => {
    if (!date) return null;
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:00`;
  };

  const handleSubmit = (values) => {
    const cleanValues = {
      ...values,
      subTasks: values.subTasks.filter(st => st.title.trim() !== "")
    };

    const payload = {
      ...cleanValues,
      dueDate: formatDateForBackend(cleanValues.dueDate),
      reminder: formatDateForBackend(cleanValues.reminder),
    };

    if (editingTodo) {
      updateTodo(editingTodo.id, payload)
        .then(() => {
          handleCloseModal();
          setRefreshCounter(c => c + 1);
        })
        .catch(err => console.error("Update failed", err));
    } else {
      createTodo(payload)
        .then(() => {
          handleCloseModal();
          setRefreshCounter(c => c + 1);
        })
        .catch(err => console.error("Create failed", err));
    }
  };

  const handleDelete = (id) => {
    deleteTodo(id)
      .then(() => {
        setRefreshCounter(c => c + 1);
      })
      .catch(err => console.error("Delete failed", err));
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary" elevation={0} sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <Toolbar sx={{ py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TaskAltIcon sx={{ fontSize: 32 }} />
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 800,
                letterSpacing: 1.5,
                textTransform: 'uppercase'
              }}
            >
              TODO APP
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />
          <IconButton color="inherit">
            <AccountCircleIcon sx={{ fontSize: 32 }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <TaskList
          key={refreshCounter}
          onAddClick={() => handleOpenModal()}
          onEditClick={(todo) => handleOpenModal(todo)}
          onDelete={handleDelete}
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