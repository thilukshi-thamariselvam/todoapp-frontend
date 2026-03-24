import React from "react";
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
    useMediaQuery
} from "@mui/material";

import MaterialTableImport from "@material-table/core";
const MaterialTable = MaterialTableImport.default || MaterialTableImport;
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PushPinIcon from "@mui/icons-material/PushPin";

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

    const completedCount = todos.filter((t) => t.status === "COMPLETED").length;

    if (isMobile) {
        return (
            <Box sx={{ width: "100%", p: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Box>
                        <Typography variant="h5" fontWeight="bold">
                            Today
                        </Typography>
                        <Chip
                            size="small"
                            icon={<CalendarMonthIcon />}
                            label={formattedDate}
                            variant="outlined"
                            sx={{ mt: 0.5 }}
                        />
                    </Box>
                    <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={onAddClick}>
                        Add
                    </Button>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {completedCount} task{completedCount !== 1 ? "s" : ""} completed
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {todos.map((todo) => (
                        <Card
                            key={todo.id}
                            sx={{
                                borderLeft: "5px solid",
                                borderColor: `${priorityColor[todo.priority] || "grey"}.main`,
                                opacity: todo.status === "COMPLETED" ? 0.7 : 1,
                                cursor: "pointer",
                            }}
                            onClick={() => onEditClick(todo)}
                        >
                            <CardContent>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            textDecoration: todo.status === "COMPLETED" ? "line-through" : "none",
                                            fontSize: "1rem",
                                        }}
                                    >
                                        {todo.title}
                                    </Typography>
                                    {todo.isPinned && <PushPinIcon sx={{ fontSize: 16 }} color="warning" />}
                                </Box>

                                <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                                    <Chip label={todo.priority} size="small" color={priorityColor[todo.priority]} />
                                    <Chip label={todo.status?.replace("_", " ")} size="small" variant="outlined" />
                                    {todo.dueDate && (
                                        <Chip
                                            label={new Date(todo.dueDate).toLocaleDateString("en-GB")}
                                            size="small"
                                            variant="outlined"
                                        />
                                    )}
                                </Box>
                            </CardContent>

                            <CardActions onClick={(e) => e.stopPropagation()}>
                                <Checkbox
                                    checked={todo.status === "COMPLETED"}
                                    onChange={(e) => onToggle(todo.id, e.target.checked)}
                                />
                                <Box sx={{ flexGrow: 1 }} />
                                <IconButton size="small" onClick={() => onEditClick(todo)}>
                                    <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton size="small" color="error" onClick={() => onDelete(todo.id)}>
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </CardActions>
                        </Card>
                    ))}
                </Box>
            </Box>
        );
    }

    const columns = [
        {
            title: "Done",
            field: "status",
            render: (rowData) => (
                <Checkbox
                    checked={rowData.status === "COMPLETED"}
                    onChange={(e) => onToggle(rowData.id, e.target.checked)}
                    onClick={(e) => e.stopPropagation()}
                />
            ),
        },
        {
            title: "Task Title",
            field: "title",
            render: (rowData) => (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography sx={{ textDecoration: rowData.status === "COMPLETED" ? "line-through" : "none" }}>
                        {rowData.title}
                    </Typography>
                    {rowData.isPinned && <PushPinIcon color="warning" fontSize="small" />}
                </Box>
            ),
        },
        {
            title: "Priority",
            field: "priority",
            render: (rowData) => (
                <Chip label={rowData.priority} size="small" color={priorityColor[rowData.priority] || "default"} />
            ),
            lookup: { LOW: "LOW", MEDIUM: "MEDIUM", HIGH: "HIGH", URGENT: "URGENT" },
        },
        {
            title: "Status",
            field: "status",
            render: (rowData) => (
                <Chip label={rowData.status?.replace("_", " ")} size="small" variant="outlined" />
            ),
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
                    <Typography variant="h4" fontWeight="bold" color="text.primary">
                        TODAY
                    </Typography>
                    <Chip icon={<CalendarMonthIcon fontSize="small" />} label={formattedDate} variant="outlined" color="primary" />
                    <Chip
                        label={`${completedCount} task${completedCount !== 1 ? "s" : ""} completed`}
                        color="secondary"
                        variant="outlined"
                        size="small"
                    />
                </Box>
                <Button variant="contained" startIcon={<AddIcon />} onClick={onAddClick} sx={{ height: "fit-content" }}>
                    Add Task
                </Button>
            </Box>

            <MaterialTable
                title={`TASKS`}
                columns={columns}
                data={todos}
                actions={[
                    {
                        icon: () => <AddIcon />,
                        tooltip: "Add Task",
                        isFreeAction: true,
                        onClick: onAddClick,
                    },
                    {
                        icon: () => <EditIcon />,
                        tooltip: "Edit Task",
                        onClick: (event, rowData) => onEditClick(rowData),
                    },
                    {
                        icon: () => <DeleteIcon color="error" />,
                        tooltip: "Delete Task",
                        onClick: (event, rowData) => onDelete(rowData.id),
                    },
                ]}
                options={{
                    search: true,
                    paging: true,
                    actionsColumnIndex: -1,
                    headerStyle: { backgroundColor: "#f5f5f5" },
                    rowStyle: (rowData) => ({
                        opacity: rowData.status === "COMPLETED" ? 0.6 : 1,
                        cursor: "pointer",
                    }),
                }}
            />
        </Box>
    );
}