import React from "react";
import {
    Box, Typography, Button, Checkbox, IconButton,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Chip, Tooltip
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';


const priorityColor = {
    LOW: "default",
    MEDIUM: "info",
    HIGH: "warning",
    URGENT: "error",
};

export default function TaskList({ todos, onAddClick, onEditClick, onDelete, onToggle }) {

    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });

    const completedCount = todos.filter(t => t.status === 'COMPLETED').length;

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h4" fontWeight="bold" color="text.primary">
                        TODAY
                    </Typography>
                    <Chip
                        icon={<CalendarMonthIcon fontSize="small" />}
                        label={formattedDate}
                        variant="outlined"
                        color="primary"
                        sx={{ fontWeight: 'medium' }}
                    />

                    <Chip
                        label={`${completedCount} task${completedCount !== 1 ? "s" : ""} completed`}
                        color="secondary"
                        variant="outlined"
                        size="small"
                    />
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={onAddClick}
                    sx={{ height: 'fit-content' }}
                >
                    Add Task
                </Button>
            </Box>

            {/* Table Section */}
            <TableContainer component={Paper} sx={{ maxHeight: '80vh' }}>
                <Table stickyHeader aria-label="task table">
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">Done</TableCell>
                            <TableCell>Task Title</TableCell>
                            <TableCell align="center">Priority</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">Due Date</TableCell>
                            <TableCell align="center">List</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {todos.map((todo) => (
                            <TableRow
                                key={todo.id}
                                sx={{
                                    '&:last-child td, &:last-child th': { border: 0 },
                                    opacity: todo.status === 'COMPLETED' ? 0.6 : 1,
                                    cursor: 'pointer',
                                    '&:hover': { backgroundColor: '#f5f5f5' }
                                }}
                                onClick={() => onEditClick(todo)}
                            >
                                <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                                    <Checkbox
                                        checked={todo.completed}
                                        onChange={(e) => onToggle(todo.id, e.target.checked)}
                                    />
                                </TableCell>

                                <TableCell component="th" scope="row">
                                    <Typography
                                        variant="body1"
                                        fontWeight="500"
                                        sx={{ textDecoration: todo.status === 'COMPLETED' ? 'line-through' : 'none' }}
                                    >
                                        {todo.title}
                                    </Typography>
                                    {todo.description && (
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                            {todo.description.substring(0, 40)}...
                                        </Typography>
                                    )}
                                </TableCell>

                                <TableCell align="center">
                                    <Chip
                                        label={todo.priority}
                                        size="small"
                                        color={priorityColor[todo.priority] || 'default'}
                                    />
                                </TableCell>

                                <TableCell align="center">
                                    <Chip
                                        label={todo.status?.replace('_', ' ')}
                                        size="small"
                                        variant="outlined"
                                    />
                                </TableCell>

                                <TableCell align="center">
                                    {todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : '-'}
                                </TableCell>

                                <TableCell align="center">
                                    {todo.listCategory}
                                </TableCell>

                                <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                                    <Tooltip title="Edit">
                                        <IconButton onClick={() => onEditClick(todo)}>
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton color="error" onClick={() => onDelete(todo.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}