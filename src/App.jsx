import api from "./api";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Button,
} from "@mui/material"; 
import "./styles.css";

export default function App() {
  const [newItem, setNewItem] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const inputRef = useRef(null);

  useEffect(() => {
    api.get("/").then((res) => setTodos(res.data));
  }, []);

  const completedCount = useMemo(() => {
    return todos.filter((todo) => todo.completed).length;
  }, [todos]);


  const toggleTodo = useCallback((id, completed) => {
    api
      .put(`/${id}`, { completed, title: todos.find((t) => t.id === id).title })
      .then((res) => {
        setTodos((currentTodos) =>
          currentTodos.map((todo) => (todo.id === id ? res.data : todo))
        );
      });
  }, [todos]);


  const deleteTodo = useCallback((id) => {
    api.delete(`/${id}`).then(() => {
      setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
    });
  }, []);


  function handleSubmit(e) {
    e.preventDefault();
    if (newItem.trim() === "") return;

    if (editingId !== null) {
      api
        .put(`/${editingId}`, { title: newItem, completed: todos.find((t) => t.id === editingId).completed })
        .then((res) => {
          setTodos((currentTodos) =>
            currentTodos.map((todo) => (todo.id === editingId ? res.data : todo))
          );
          setEditingId(null);
          setNewItem("");
          inputRef.current.focus();
        });
    } else {
      api
        .post("/", { title: newItem, completed: false })
        .then((res) => {
          setTodos((currentTodos) => [...currentTodos, res.data]);
          setNewItem("");
          inputRef.current.focus();
        });
    }
  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="new-item-form">
        <div className="form-row">
          <label htmlFor="item">New Item</label>
          <input
            ref={inputRef}
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            type="text"
            id="item"
            placeholder="Enter a task..."
          />
        </div>
        <button className="btn">{editingId ? "Update" : "Add"}</button>
      </form>

      <h2>{completedCount} task{completedCount !== 1 ? "s" : ""} completed</h2>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Task</TableCell>
            <TableCell>Completed</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {todos.map((todo) => (
            <TableRow key={todo.id}>
              <TableCell>{todo.title}</TableCell>
              <TableCell>
                <Checkbox
                  checked={todo.completed}
                  onChange={(e) => toggleTodo(todo.id, e.target.checked)}
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setEditingId(todo.id);
                    setNewItem(todo.title);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => deleteTodo(todo.id)}
                  style={{ marginLeft: "0.5rem" }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}