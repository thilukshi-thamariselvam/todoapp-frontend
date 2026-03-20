import React from "react";
import {
  Box, Typography, Button, Checkbox, IconButton, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Chip, Tooltip
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";


const priorityColor = {
  LOW: "default",
  MEDIUM: "info",
  HIGH: "warning",
  URGENT: "error",
};

export default function TaskList({ todos, onAddClick, onEditClick, onDelete, onToggle }) {
  
  return (
    <Box sx={{ width: '100%', p: 2 }}>
      
      {/* Header Section */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5" fontWeight="bold">
          My Tasks
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={onAddClick}
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
                onClick={() => onEditClick(todo)} // Click row to edit
              >
                <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={todo.status === 'COMPLETED'}
                    onChange={(e) => onToggle(todo.id, e.target.checked ? 'COMPLETED' : 'PENDING')}
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
                    label={todo.status?.replace('_', ' ')} // Format "IN_PROGRESS" to "IN PROGRESS"
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