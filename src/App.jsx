import api from "./api";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import TaskList from "./TaskList";
import TaskDetail from "./TaskDetail";
import "./styles.css";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newItem, setNewItem] = useState("");

  const inputRef = useRef(null);

  useEffect(() => {
    api.get("/").then((res) => setTodos(res.data));
  }, []);

  const completedCount = useMemo(() => {
    return todos.filter((todo) => todo.completed).length;
  }, [todos]);


  const toggleTodo = useCallback(
    (id, completed) => {
      const todo = todos.find((t) => t.id === id);
      api.put(`/${id}`, { ...todo, completed }).then((res) => {
        setTodos((current) =>
          current.map((t) => (t.id === id ? res.data : t))
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

  function handleSubmit(e) {
    e.preventDefault();
    if (newItem.trim() === "") return;

    if (editingId) {
      const todo = todos.find((t) => t.id === editingId);
      api
        .put(`/${editingId}`, { ...todo, title: newItem })
        .then((res) => {
          setTodos((current) =>
            current.map((t) => (t.id === editingId ? res.data : t))
          );
          setEditingId(null);
          setNewItem("");
          inputRef.current.focus();
        });
    } else {
      api
        .post("/", { title: newItem, completed: false })
        .then((res) => {
          setTodos((current) => [...current, res.data]);
          setNewItem("");
          inputRef.current.focus();
        });
    }
  }

  return (
    <div className="app-container">
      {/* Center Pane: Task List */}
      <TaskList
        todos={todos}
        newItem={newItem}
        setNewItem={setNewItem}
        handleSubmit={handleSubmit}
        toggleTodo={toggleTodo}
        setEditingId={setEditingId}
        deleteTodo={deleteTodo}
        inputRef={inputRef}
        completedCount={completedCount}
      />

      {/* Right Pane: Task Detail */}
      {editingId && (
        <TaskDetail
          todo={todos.find((t) => t.id === editingId)}
          setTodos={setTodos}
          setEditingId={setEditingId}
        />
      )}
    </div>
  );
}