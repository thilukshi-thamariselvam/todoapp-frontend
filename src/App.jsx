import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TodoPage from "./pages/TodoPage";
import TaskDetailPage from "./pages/TaskDetailPage";
import "./styles.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TodoPage />} />
        <Route path="/task/:id" element={<TaskDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}