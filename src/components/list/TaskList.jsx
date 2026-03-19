import React from "react";
import { Table, TableHead, TableBody, TableRow, TableCell, Checkbox, Button } from "@mui/material";

export default function TaskList({
    todos,
    newItem,
    setNewItem,
    handleSubmit,
    toggleTodo,
    setEditingId,
    deleteTodo,
    inputRef,
    completedCount,
}) {

    const today = new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    return (

        <div className="task-list">
            <div className="task-header">
                <h1>TODAY</h1>
                <span className="task-date">{today}</span>
            </div>
            
            <form onSubmit={handleSubmit} className="new-item-form">
                <input
                    ref={inputRef}
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    type="text"
                    placeholder="Add new task..."
                />
                <button className="btn">Add</button>
            </form>

            <h2>{completedCount} task{completedCount !== 1 ? "s" : ""} completed</h2>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Task</TableCell>
                        <TableCell>Done</TableCell>
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
                                    onClick={() => setEditingId(todo.id)}
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