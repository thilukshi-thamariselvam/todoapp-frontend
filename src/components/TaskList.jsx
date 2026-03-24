import React, { useState } from "react";
import {
    Box,
    Typography,
    Button,
    Checkbox,
    IconButton,
    Chip,
    Card,
    CardContent,
    CardActions,
    useTheme,
    useMediaQuery,
    TextField,
    MenuItem,
    Select,
    InputAdornment,
    TablePagination,
    FormControl,
    InputLabel
} from "@mui/material";
import MaterialTableImport from "@material-table/core";
const MaterialTable = MaterialTableImport.default || MaterialTableImport;
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PushPinIcon from "@mui/icons-material/PushPin";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";

const priorityColor = {
    LOW: "default",
    MEDIUM: "info",
    HIGH: "warning",
    URGENT: "error",
};

export default function TaskList({ todos, onAddClick, onEditClick, onDelete, onToggle }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });

    // --- MOBILE ---
    const [searchText, setSearchText] = useState("");
    const [sortBy, setSortBy] = useState("default");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const filteredTodos = todos.filter((todo) =>
        todo.title.toLowerCase().includes(searchText.toLowerCase()) ||
        todo.description?.toLowerCase().includes(searchText.toLowerCase())
    );

    const sortedTodos = [...filteredTodos].sort((a, b) => {
        if (sortBy === "dueDate") {
            return new Date(a.dueDate || 0) - new Date(b.dueDate || 0);
        }
        if (sortBy === "priority") {
            const order = { LOW: 1, MEDIUM: 2, HIGH: 3, URGENT: 4 };
            return (order[b.priority] || 0) - (order[a.priority] || 0);
        }
        if (sortBy === "title") {
            return a.title.localeCompare(b.title);
        }
        return 0;
    });

    const paginatedTodos = sortedTodos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    if (isMobile) {
        return (
            <Box sx={{ width: "100%", p: 1.5, boxSizing: "border-box" }}>


                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" fontWeight="bold">Today</Typography>
                        <Chip size="small" icon={<CalendarMonthIcon />} label={formattedDate} variant="outlined" sx={{ mt: 0.5 }} />
                    </Box>
                    <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={onAddClick}>Add</Button>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: 'column' }}>
                    <TextField
                        size="small"
                        fullWidth
                        placeholder="Search tasks..."
                        value={searchText}
                        onChange={(e) => { setSearchText(e.target.value); setPage(0); }}
                        InputProps={{
                            startAdornment: (<InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>),
                        }}
                    />
                    <FormControl fullWidth size="small">
                        <InputLabel>Sort By</InputLabel>
                        <Select
                            value={sortBy}
                            label="Sort By"
                            onChange={(e) => setSortBy(e.target.value)}
                            startAdornment={<InputAdornment position="start"><SortIcon fontSize="small" /></InputAdornment>}
                        >
                            <MenuItem value="default">Default</MenuItem>
                            <MenuItem value="dueDate">Due Date</MenuItem>
                            <MenuItem value="priority">Priority</MenuItem>
                            <MenuItem value="title">Title (A-Z)</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                    Showing {paginatedTodos.length} of {filteredTodos.length} tasks
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'stretch' }}>
                    {paginatedTodos.length === 0 ? (
                        <Typography variant="body2" align="center" sx={{ mt: 4 }}>No tasks found.</Typography>
                    ) : (
                        paginatedTodos.map((todo) => (
                            <Card
                                key={todo.id}
                                sx={{
                                    width: '100%',
                                    boxSizing: 'border-box',
                                    borderLeft: "5px solid",
                                    borderColor: `${priorityColor[todo.priority] || "grey"}.main`,
                                    opacity: todo.status === "COMPLETED" ? 0.7 : 1,
                                    cursor: "pointer",
                                }}
                                onClick={() => onEditClick(todo)}
                            >
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                        <Typography variant="h6" sx={{ textDecoration: todo.status === "COMPLETED" ? "line-through" : "none", fontSize: "1rem" }}>
                                            {todo.title}
                                        </Typography>
                                        {todo.isPinned && <PushPinIcon sx={{ fontSize: 16 }} color="warning" />}
                                    </Box>

                                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                        <Chip label={todo.priority} size="small" color={priorityColor[todo.priority]} />
                                        <Chip label={todo.status?.replace("_", " ")} size="small" variant="outlined" />
                                        {todo.dueDate && <Chip label={new Date(todo.dueDate).toLocaleDateString("en-GB")} size="small" variant="outlined" />}
                                    </Box>
                                </CardContent>

                                <CardActions onClick={(e) => e.stopPropagation()}>
                                    <Checkbox checked={todo.status === "COMPLETED"} onChange={(e) => onToggle(todo.id, e.target.checked)} />
                                    <Box sx={{ flexGrow: 1 }} />
                                    <IconButton size="small" onClick={() => onEditClick(todo)}><EditIcon fontSize="small" /></IconButton>
                                    <IconButton size="small" color="error" onClick={() => onDelete(todo.id)}><DeleteIcon fontSize="small" /></IconButton>
                                </CardActions>
                            </Card>
                        ))
                    )}
                </Box>

                <TablePagination
                    component="div"
                    count={filteredTodos.length}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                    rowsPerPageOptions={[3, 5, 6]}
                    sx={{ mt: 2, borderBottom: 'none' }}
                />
            </Box>
        );
    }

    // --- DESKTOP ---
    const columns = [
        {
            title: "Done",
            field: "status",
            render: (rowData) => (
                <Checkbox checked={rowData.status === "COMPLETED"} onChange={(e) => onToggle(rowData.id, e.target.checked)} onClick={(e) => e.stopPropagation()} />
            ),
        },
        {
            title: "Task Title",
            field: "title",
            render: (rowData) => (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography sx={{ textDecoration: rowData.status === "COMPLETED" ? "line-through" : "none" }}>{rowData.title}</Typography>
                    {rowData.isPinned && <PushPinIcon color="warning" fontSize="small" />}
                </Box>
            ),
        },
        {
            title: "Priority",
            field: "priority",
            render: (rowData) => <Chip label={rowData.priority} size="small" color={priorityColor[rowData.priority] || "default"} />,
            lookup: { LOW: "LOW", MEDIUM: "MEDIUM", HIGH: "HIGH", URGENT: "URGENT" },
        },
        {
            title: "Status",
            field: "status",
            render: (rowData) => <Chip label={rowData.status?.replace("_", " ")} size="small" variant="outlined" />,
        },
        {
            title: "Due Date",
            field: "dueDate",
            render: (rowData) => (rowData.dueDate ? new Date(rowData.dueDate).toLocaleDateString("en-GB") : "-"),
        },
        { title: "List", field: "listCategory" },
    ];

    return (
        <Box sx={{ width: "100%", p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography variant="h4" fontWeight="bold" color="text.primary">TODAY</Typography>
                    <Chip icon={<CalendarMonthIcon fontSize="small" />} label={new Date().toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric' })} variant="outlined" color="primary" />
                    <Chip label={`${todos.filter(t => t.status === "COMPLETED").length} tasks completed`} color="secondary" variant="outlined" size="small" />
                </Box>
                <Button variant="contained" startIcon={<AddIcon />} onClick={onAddClick} sx={{ height: "fit-content" }}>Add Task</Button>
            </Box>

            <MaterialTable
                title="TASKS"
                columns={columns}
                data={todos}
                actions={[
                    { icon: () => <AddIcon />, tooltip: "Add Task", isFreeAction: true, onClick: onAddClick },
                    { icon: () => <EditIcon />, tooltip: "Edit Task", onClick: (event, rowData) => onEditClick(rowData) },
                    { icon: () => <DeleteIcon color="error" />, tooltip: "Delete Task", onClick: (event, rowData) => onDelete(rowData.id) },
                ]}
                options={{
                    search: true,
                    paging: true,
                    actionsColumnIndex: -1,
                    headerStyle: { backgroundColor: "#f5f5f5" },
                    rowStyle: (rowData) => ({ opacity: rowData.status === "COMPLETED" ? 0.6 : 1, cursor: "pointer" }),

                    pageSize: 5, 
                    pageSizeOptions: [3, 5, 6]
                }}
            />
        </Box>
    );
}