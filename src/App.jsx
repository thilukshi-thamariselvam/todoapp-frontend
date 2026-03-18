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

  useEffect(() => {
    console.log("Todos changed:", todos);
  }, [todos]);

  const inputRef = useRef(null);

  const completedCount = useMemo(() => {
    return todos.filter(todo => todo.completed).length;
  }, [todos]);

  const toggleTodo = useCallback((id, completed) => {
  setTodos((currentTodos) =>
    currentTodos.map((todo) =>
      todo.id === id ? { ...todo, completed } : todo
    )
  );
}, [setTodos]);

const deleteTodo = useCallback((id) => {
  setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
}, [setTodos]);

  function handleSubmit(e) {
    e.preventDefault();
    if (newItem.trim() === "") return;

    if (editingId !== null) {
      setTodos((currentTodos) =>
        currentTodos.map((todo) =>
          todo.id === editingId ? { ...todo, title: newItem } : todo
        )
      );
    } else {
      setTodos((currentTodos) => [
        ...currentTodos,
        { id: crypto.randomUUID(), title: newItem, completed: false },
      ]);
    }

    setNewItem("");
    setEditingId(null);
    inputRef.current.focus();
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