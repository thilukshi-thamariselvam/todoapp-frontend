import React, { useState, useEffect, useRef } from "react";
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
    InputLabel,
    CircularProgress
} from "@mui/material";
import MaterialTableImport from "@material-table/core";
const MaterialTable = MaterialTableImport.default || MaterialTableImport;
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PushPinIcon from "@mui/icons-material/PushPin";
import SortIcon from "@mui/icons-material/Sort";
import { getTodos, updateTodo } from "../api";

const priorityColor = {
    LOW: "default",
    MEDIUM: "info",
    HIGH: "warning",
    URGENT: "error",
};

export default function TaskList({ onAddClick, onEditClick, onDelete }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    // --- DATA STATE ---
    const [todos, setTodos] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);

    // --- PARAMETER STATE ---
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [filterPriority, setFilterPriority] = useState("");
    const [filterStatus, setFilterStatus] = useState("");


    const [mobileSortBy, setMobileSortBy] = useState("dueDate");

    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });

    useEffect(() => {
        fetchData();
    }, [page, rowsPerPage, filterPriority, filterStatus, mobileSortBy]);

    const fetchData = async () => {
        setLoading(true);
        try {
            let sort = mobileSortBy;
            let direction = "asc";

            const params = {
                page: page,
                size: rowsPerPage,
                sort: sort,
                direction: direction,
                priority: filterPriority || null,
                status: filterStatus || null
            };

            const data = await getTodos(params);
            setTodos(data.content);
            setTotalCount(data.totalElements);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (setter) => (e) => {
        setter(e.target.value);
        setPage(0);
    };

    const handleToggle = async (id, isCompleted) => {
        const newStatus = isCompleted ? 'COMPLETED' : 'PENDING';
        const todo = todos.find(t => t.id === id);

        setTodos(current => current.map(t => (t.id === id ? { ...t, status: newStatus } : t)));

        try {
            await updateTodo(id, { ...todo, status: newStatus });
            if (tableRef.current) {
                tableRef.current.onQueryChange();
            }
        } catch (err) {
            setTodos(current => current.map(t => (t.id === id ? { ...t, status: todo.status } : t)));
        }
    };

    const tableRef = useRef();

    // --- MOBILE VIEW ---
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
                    <FormControl fullWidth size="small">
                        <InputLabel>Sort By</InputLabel>
                        <Select
                            value={mobileSortBy}
                            label="Sort By"
                            onChange={(e) => setMobileSortBy(e.target.value)}
                            startAdornment={<InputAdornment position="start"><SortIcon fontSize="small" /></InputAdornment>}
                        >
                            <MenuItem value="dueDate">Due Date</MenuItem>
                            <MenuItem value="priority">Priority</MenuItem>
                            <MenuItem value="title">Title</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}><CircularProgress /></Box> : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'stretch' }}>
                        {todos.length === 0 ? (
                            <Typography variant="body2" align="center" sx={{ mt: 4 }}>No tasks found.</Typography>
                        ) : (
                            todos.map((todo) => (
                                <Card
                                    key={todo.id}
                                    sx={{
                                        width: '100%', borderLeft: "5px solid",
                                        borderColor: `${priorityColor[todo.priority] || "grey"}.main`,
                                        opacity: todo.status === "COMPLETED" ? 0.7 : 1, cursor: "pointer",
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
                                        <Checkbox checked={todo.status === "COMPLETED"} onChange={(e) => handleToggle(todo.id, e.target.checked)} />
                                        <Box sx={{ flexGrow: 1 }} />
                                        <IconButton size="small" onClick={() => onEditClick(todo)}><EditIcon fontSize="small" /></IconButton>
                                        <IconButton size="small" color="error" onClick={() => onDelete(todo.id)}><DeleteIcon fontSize="small" /></IconButton>
                                    </CardActions>
                                </Card>
                            ))
                        )}
                    </Box>
                )}

                <TablePagination
                    component="div"
                    count={totalCount}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                    rowsPerPageOptions={[3, 5, 6]}
                />
            </Box>
        );
    }

    // --- DESKTOP VIEW ---
    const columns = [
        {
            title: "Done", field: "status",
            render: (rowData) => (
                <Checkbox checked={rowData.status === "COMPLETED"} onChange={(e) => handleToggle(rowData.id, e.target.checked)} onClick={(e) => e.stopPropagation()} />
            ),
        },
        {
            title: "Task Title", field: "title",
            render: (rowData) => (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography sx={{ textDecoration: rowData.status === "COMPLETED" ? "line-through" : "none" }}>{rowData.title}</Typography>
                    {rowData.isPinned && <PushPinIcon color="warning" fontSize="small" />}
                </Box>
            ),
        },
        {
            title: "Priority", field: "priority",
            render: (rowData) => <Chip label={rowData.priority} size="small" color={priorityColor[rowData.priority] || "default"} />,
        },
        {
            title: "Status", field: "status",
            render: (rowData) => <Chip label={rowData.status?.replace("_", " ")} size="small" variant="outlined" />,
        },
        {
            title: "Due Date", field: "dueDate",
            render: (rowData) => (rowData.dueDate ? new Date(rowData.dueDate).toLocaleDateString("en-GB") : "-"),
        },
        { title: "List", field: "listCategory" },
    ];

    return (
        <Box sx={{ width: "100%", p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography variant="h4" fontWeight="bold" color="text.primary">TODAY</Typography>
                    <Chip icon={<CalendarMonthIcon fontSize="small" />} label={formattedDate} variant="outlined" color="primary" />
                </Box>
                <Button variant="contained" startIcon={<AddIcon />} onClick={onAddClick} sx={{ height: "fit-content" }}>Add Task</Button>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Chip
                    label={`${totalCount} total tasks`}
                    color="secondary" variant="outlined" size="small"
                    sx={{ borderRadius: '4px', fontWeight: 'bold', '& .MuiChip-label': { fontWeight: 'bold' } }}
                />

                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Priority</InputLabel>
                        <Select value={filterPriority} label="Priority" onChange={handleFilterChange(setFilterPriority)}>
                            <MenuItem value=""><em>All</em></MenuItem>
                            <MenuItem value="LOW">Low</MenuItem>
                            <MenuItem value="MEDIUM">Medium</MenuItem>
                            <MenuItem value="HIGH">High</MenuItem>
                            <MenuItem value="URGENT">Urgent</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Status</InputLabel>
                        <Select value={filterStatus} label="Status" onChange={handleFilterChange(setFilterStatus)}>
                            <MenuItem value=""><em>All</em></MenuItem>
                            <MenuItem value="PENDING">Pending</MenuItem>
                            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                            <MenuItem value="COMPLETED">Completed</MenuItem>
                        </Select>
                    </FormControl>

                    {(filterPriority || filterStatus) && (
                        <Button size="small" variant="outlined" onClick={() => { setFilterPriority(""); setFilterStatus(""); setPage(0); }}>
                            Clear
                        </Button>
                    )}
                </Box>
            </Box>

            <MaterialTable
                tableRef={tableRef}
                title="TASKS"
                columns={columns}
                data={(query) =>
                    new Promise((resolve, reject) => {
                        const params = {
                            page: query.page,
                            size: query.pageSize,
                            sort: query.orderBy ? query.orderBy.field : 'dueDate',
                            direction: query.orderDirection || 'asc',
                            priority: filterPriority || null,
                            status: filterStatus || null
                        };


                        getTodos(params)
                            .then((result) => {
                                setTotalCount(result.totalElements);
                                resolve({
                                    data: result.content,
                                    page: result.number,
                                    totalCount: result.totalElements,
                                });
                            })
                            .catch(error => {
                                console.error("Fetch error", error);
                                reject(error);
                            });
                    })
                }
                actions={[
                    { icon: () => <EditIcon />, tooltip: "Edit Task", onClick: (event, rowData) => onEditClick(rowData) },
                    { icon: () => <DeleteIcon color="error" />, tooltip: "Delete Task", onClick: (event, rowData) => onDelete(rowData.id) },
                ]}
                options={{
                    search: false,
                    paging: true,
                    sorting: true,
                    actionsColumnIndex: -1,
                    headerStyle: { backgroundColor: "#f5f5f5" },
                    rowStyle: (rowData) => ({ opacity: rowData.status === "COMPLETED" ? 0.6 : 1, cursor: "pointer" }),
                    pageSize: 5,
                    pageSizeOptions: [3, 5, 6],
                    debounceInterval: 500,
                }}
                key={filterPriority + filterStatus}
            />
        </Box>
    );
}