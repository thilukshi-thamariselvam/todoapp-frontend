import React, { useState, useEffect, useRef } from "react";
import {
    Box, Typography, Button, Checkbox, IconButton, Chip, Card, CardContent, CardActions,
    useTheme, useMediaQuery, TextField, MenuItem, Select, InputAdornment, TablePagination,
    FormControl, InputLabel, CircularProgress, Grid, Stack, Divider, Paper,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from "@mui/material";
import MaterialTableImport from "@material-table/core";
const MaterialTable = MaterialTableImport.default || MaterialTableImport;
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PushPinIcon from "@mui/icons-material/PushPin";
import SortIcon from "@mui/icons-material/Sort";
import SearchIcon from "@mui/icons-material/Search";
import DescriptionIcon from '@mui/icons-material/Description';
import SubtasksIcon from '@mui/icons-material/PlaylistAddCheck';
import EventNoteIcon from '@mui/icons-material/EventNote';
import UpdateIcon from '@mui/icons-material/Update';
import LabelIcon from '@mui/icons-material/Label';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
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

    const navigate = useNavigate();

    // --- DATA STATE ---
    const [todos, setTodos] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);

    // --- PARAMETER STATE ---
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [filterPriority, setFilterPriority] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [searchText, setSearchText] = useState("");

    // --- DIALOG STATE ---
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [mobileSortBy, setMobileSortBy] = useState("dueDate");

    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });


    const prevFilters = useRef({ priority: "", status: "" });

    useEffect(() => {
        if (!isMobile && tableRef.current) {
            const hasChanged =
                prevFilters.current.priority !== filterPriority ||
                prevFilters.current.status !== filterStatus;

            if (hasChanged) {
                prevFilters.current = { priority: filterPriority, status: filterStatus };

                const timer = setTimeout(() => {
                    if (tableRef.current) {
                        tableRef.current.onQueryChange({ page: 0 });
                    }
                }, 100);

                return () => clearTimeout(timer);
            }
        }
    }, [filterPriority, filterStatus, isMobile]);

    useEffect(() => {
        if (isMobile) {
            fetchData();
        }
    }, [page, rowsPerPage, mobileSortBy, searchText]);

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
                status: filterStatus || null,
                search: searchText || null
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

    const handleToggle = async (todo, isCompleted) => {
        const newStatus = isCompleted ? 'COMPLETED' : 'PENDING';
        const id = todo.id;
        if (isMobile) {
            setTodos(current => current.map(t => (t.id === id ? { ...t, status: newStatus } : t)));
        }
        try {
            await updateTodo(id, { ...todo, status: newStatus });
            if (isMobile) {
            } else {
                if (tableRef.current) {
                    tableRef.current.onQueryChange();
                }
            }
        } catch (err) {
            console.error("Update failed", err);

            if (isMobile) {
                setTodos(current => current.map(t => (t.id === id ? { ...t, status: todo.status } : t)));
            }
        }
    };

    const handleDeleteClick = (task) => {
        setTaskToDelete(task);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (taskToDelete) {
            setIsDeleting(true);
            try {
                await onDelete(taskToDelete.id);
                setDeleteDialogOpen(false);
                setTaskToDelete(null);
            } catch (error) {
                console.error("Delete failed", error);
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
        setTaskToDelete(null);
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
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                    Showing {todos.length} of {totalCount} tasks
                </Typography>

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
                                        <Checkbox checked={todo.status === "COMPLETED"} onChange={(e) => handleToggle(todo, e.target.checked)} />
                                        <Box sx={{ flexGrow: 1 }} />
                                        <IconButton size="small" onClick={() => onEditClick(todo)}><EditIcon fontSize="small" /></IconButton>
                                        <IconButton size="small" color="error" onClick={() => handleDeleteClick(todo)}><DeleteIcon fontSize="small" /></IconButton>
                                        <IconButton size="small" onClick={() => navigate(`/task/${todo.id}`)} title="View Details"> <VisibilityIcon fontSize="small" /> </IconButton>
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

                <Dialog
                    open={deleteDialogOpen}
                    onClose={handleCancelDelete}
                    aria-labelledby="delete-dialog-title"
                    aria-describedby="delete-dialog-description"
                    maxWidth="xs"
                    fullWidth
                >
                    <DialogTitle id="delete-dialog-title" sx={{ fontWeight: 'bold' }}>
                        Delete Task?
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="delete-dialog-description">
                            Are you sure you want to delete "{taskToDelete?.title}"? This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2 }}>
                        <Button
                            onClick={handleCancelDelete}
                            disabled={isDeleting}
                            sx={{ color: 'text.secondary' }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmDelete}
                            color="error"
                            variant="contained"
                            disabled={isDeleting}
                            startIcon={isDeleting ? <CircularProgress size={16} color="inherit" /> : <DeleteIcon fontSize="small" />}
                        >
                            {isDeleting ? "Deleting..." : "Yes, Delete"}
                        </Button>
                    </DialogActions>
                </Dialog>

            </Box>
        );
    }


    // --- DESKTOP VIEW ---

    const formatDateTime = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleString("en-GB", {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const columns = [
        {
            title: "Done", field: "status",
            render: (rowData) => (
                <Checkbox
                    checked={rowData.status === "COMPLETED"}
                    onChange={(e) => handleToggle(rowData, e.target.checked)}
                    onClick={(e) => e.stopPropagation()}
                />
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

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography variant="h4" fontWeight="bold" color="text.primary">TODAY</Typography>
                    <Chip
                        icon={<CalendarMonthIcon fontSize="small" sx={{ color: 'black' }} />}
                        label={formattedDate}
                        sx={{
                            backgroundColor: '#FFD107',
                            color: 'black',
                            fontWeight: 'bold',
                            border: 'none',
                            '& .MuiChip-icon': { color: 'black' }
                        }}
                    />
                </Box>

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
                        <Button size="small" variant="outlined" color="error" onClick={() => { setFilterPriority(""); setFilterStatus(""); setPage(0); }}>
                            Clear
                        </Button>
                    )}
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={onAddClick}
                        sx={{
                            backgroundColor: '#FFD700',
                            color: 'black',
                            borderRadius: '20px',
                            fontWeight: 'bold',
                            '&:hover': { backgroundColor: '#FFC107' }
                        }}
                    >
                        ADD TASK
                    </Button>
                </Box>
            </Box>

            <Box sx={{
                '& .MuiToolbar-root': {
                    paddingLeft: '30px !important',
                    paddingRight: '0px !important',
                }
            }}>
                <MaterialTable
                    tableRef={tableRef}
                    title={
                        <Typography variant="h6" fontWeight="bold">
                            {`TOTAL TASKS - ${totalCount}`}
                        </Typography>
                    }
                    columns={columns}
                    data={(query) =>
                        new Promise((resolve, reject) => {
                            const params = {
                                page: query.page,
                                size: query.pageSize,
                                sort: query.orderBy ? query.orderBy.field : 'createdDate',
                                direction: query.orderDirection || 'desc',
                                priority: filterPriority || null,
                                status: filterStatus || null,
                                search: query.search || null
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
                                .catch(error => reject(error));
                        })
                    }
                    detailPanel={({ rowData }) => (
                        <Box sx={{ p: 3, backgroundColor: '#FAFAFA', borderBottom: '1px solid #E0E0E0' }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={8}>
                                    <Stack spacing={3}>
                                        <Paper variant="outlined" sx={{ p: 2, backgroundColor: 'white' }}>
                                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                                                <DescriptionIcon color="action" fontSize="small" />
                                                <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                                                    DESCRIPTION
                                                </Typography>
                                            </Stack>
                                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', color: rowData.description ? 'text.primary' : 'text.disabled' }}>
                                                {rowData.description || "No description provided."}
                                            </Typography>
                                        </Paper>

                                        {rowData.subTasks && rowData.subTasks.length > 0 && (
                                            <Paper variant="outlined" sx={{ p: 2, backgroundColor: 'white' }}>
                                                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                                                    <SubtasksIcon color="action" fontSize="small" />
                                                    <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                                                        SUBTASKS ({rowData.subTasks.length})
                                                    </Typography>
                                                </Stack>
                                                <Stack spacing={1}>
                                                    {rowData.subTasks.map((st, index) => (
                                                        <Box
                                                            key={index}
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'flex-start',
                                                                gap: 1,
                                                                pl: 1
                                                            }}
                                                        >
                                                            <Typography variant="body2">
                                                                •
                                                            </Typography>

                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    textDecoration: st.completed ? 'line-through' : 'none',
                                                                    color: st.completed ? 'text.disabled' : 'text.primary'
                                                                }}
                                                            >
                                                                {st.title}
                                                            </Typography>
                                                        </Box>
                                                    ))}
                                                </Stack>
                                            </Paper>
                                        )}

                                    </Stack>
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <Stack spacing={3} sx={{ height: '100%', borderLeft: { md: '1px solid #E0E0E0' }, pl: { md: 3 } }}>
                                        <Paper variant="outlined" sx={{ p: 2, backgroundColor: 'white' }}>
                                            <Stack spacing={2}>
                                                <Box>
                                                    <Stack direction="row" alignItems="center" spacing={1}>
                                                        <EventNoteIcon sx={{ fontSize: 16 }} color="action" />
                                                        <Typography variant="caption" color="text.secondary" fontWeight="bold">
                                                            CREATED
                                                        </Typography>
                                                    </Stack>
                                                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                                                        {formatDateTime(rowData.createdDate)}
                                                    </Typography>
                                                </Box>

                                                <Divider />

                                                <Box>
                                                    <Stack direction="row" alignItems="center" spacing={1}>
                                                        <UpdateIcon sx={{ fontSize: 16 }} color="action" />
                                                        <Typography variant="caption" color="text.secondary" fontWeight="bold">
                                                            LAST UPDATED
                                                        </Typography>
                                                    </Stack>
                                                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                                                        {formatDateTime(rowData.updatedDate)}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </Paper>

                                        {rowData.tags && rowData.tags.length > 0 && (
                                            <Paper variant="outlined" sx={{ p: 2, backgroundColor: 'white' }}>
                                                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                                                    <LabelIcon sx={{ fontSize: 16 }} color="action" />
                                                    <Typography variant="caption" color="text.secondary" fontWeight="bold">
                                                        TAGS
                                                    </Typography>
                                                </Stack>
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {rowData.tags.map((tag, idx) => (
                                                        <Chip
                                                            key={idx}
                                                            label={tag}
                                                            size="small"
                                                            variant="outlined"
                                                            color="primary"
                                                            sx={{ borderRadius: '4px' }}
                                                        />
                                                    ))}
                                                </Box>
                                            </Paper>
                                        )}
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                    actions={[
                        {
                            icon: () => <EditIcon />,
                            tooltip: "Edit Task",
                            onClick: (event, rowData) => onEditClick(rowData)
                        },
                        {
                            icon: () => <DeleteIcon color="error" />,
                            tooltip: "Delete Task",
                            onClick: (event, rowData) => handleDeleteClick(rowData)
                        },
                        {
                            icon: () => <VisibilityIcon color="primary" />,
                            tooltip: "View Full Details",
                            onClick: (event, rowData) => {
                                navigate(`/task/${rowData.id}`);
                            }
                        },
                    ]}
                    options={{
                        search: true,
                        paging: true,
                        maxColumnSort: 1,
                        actionsColumnIndex: -1,
                        headerStyle: { backgroundColor: "#f5f5f5" },
                        rowStyle: (rowData) => ({ opacity: rowData.status === "COMPLETED" ? 0.6 : 1, cursor: "pointer" }),
                        pageSize: 5,
                        pageSizeOptions: [3, 5, 6],
                        debounceInterval: 500,
                    }}
                />
            </Box>
            <Dialog
                open={deleteDialogOpen}
                onClose={handleCancelDelete}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle id="delete-dialog-title" sx={{ fontWeight: 'bold' }}>
                    Delete Task?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Are you sure you want to delete "{taskToDelete?.title}"? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={handleCancelDelete}
                        disabled={isDeleting}
                        sx={{ color: 'text.secondary' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        color="error"
                        variant="contained"
                        disabled={isDeleting}
                        startIcon={isDeleting ? <CircularProgress size={16} color="inherit" /> : <DeleteIcon fontSize="small" />}
                    >
                        {isDeleting ? "Deleting..." : "Yes, Delete"}
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
}