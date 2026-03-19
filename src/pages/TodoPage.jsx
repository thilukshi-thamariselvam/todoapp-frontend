import React, { useCallback, useEffect, useMemo, useState } from "react";
import api from "../api";
import TodoForm from "../components/form/TodoForm";
import TaskList from "../components/list/TaskList";
import TaskDetail from "../components/detail/TaskDetail";

export default function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    api.get("/").then((res) => {
      setTodos(res.data.data);
    });
  }, []);

  const completedCount = useMemo(
    () => todos.filter((t) => t.completed).length,
    [todos]
  );

  const toggleTodo = useCallback(
    (id, completed) => {
      const todo = todos.find((t) => t.id === id);
      api.put(`/${id}`, { ...todo, completed }).then((res) => {
        setTodos((current) =>
          current.map((t) => (t.id === id ? res.data.data : t))
        );
      });
    },
    [todos]
  );

  const deleteTodo = useCallback((id) => {
    api.delete(`/${id}`).then(() => {
      setTodos((current) => current.filter((t) => t.id !== id));
    });
  }, []);

  // Add a new todo (from TodoForm)
  const handleAddTodo = (values, resetForm) => {
    api.post("/", values).then((res) => {
      setTodos((current) => [...current, res.data.data]);
      resetForm(); // Clear form fields
    });
  };

  return (
    <div className="app-container">
      {/* Todo Form */}
      <TodoForm onSubmit={handleAddTodo} />

      {/* Task List */}
      <TaskList
        todos={todos}
        toggleTodo={toggleTodo}
        setEditingId={setEditingId}
        deleteTodo={deleteTodo}
        completedCount={completedCount}
      />

      {/* Task Detail */}
      {editingId && todos.find((t) => t.id === editingId) && (
        <TaskDetail
          todo={todos.find((t) => t.id === editingId)}
          setTodos={setTodos}
          setEditingId={setEditingId}
        />
      )}
    </div>
  );
}