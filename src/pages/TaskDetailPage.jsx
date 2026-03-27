import React, { useState, useEffect } from "react";
import {
    Box, Typography, Paper, Grid, Chip, IconButton, Skeleton, Divider, Button,
    Stack, Card, CardContent, useTheme, useMediaQuery
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FlagIcon from "@mui/icons-material/Flag";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LabelIcon from "@mui/icons-material/Label";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import NotesIcon from "@mui/icons-material/Notes";
import PushPinIcon from "@mui/icons-material/PushPin";
import { getTodoById } from "../api";

const priorityColor = {
    LOW: "default",
    MEDIUM: "info",
    HIGH: "warning",
    URGENT: "error",
};

export default function TaskDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const [todo, setTodo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const fetchDetails = async () => {
        setLoading(true);
        try {
            const data = await getTodoById(id);
            setTodo(data);
        } catch (error) {
            console.error("Failed to fetch task details", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return "Not available";
        return new Date(dateString).toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <Box sx={{ p: 3 }}>
                <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={400} />
            </Box>
        );
    }

    if (!todo) {
        return (
            <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="h6">Task not found.</Typography>
                <Button onClick={() => navigate(-1)}>Go Back</Button>
            </Box>
        );
    }

    // --- MOBILE LAYOUT ---
    if (isMobile) {
        return (
            <Box sx={{ pb: 4, backgroundColor: '#f4f5f7', minHeight: '100vh' }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: 2, position: "sticky", top: 0, zIndex: 10, backgroundColor: "background.paper",
                        borderBottom: "1px solid #eee",
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <IconButton onClick={() => navigate(-1)} size="small">
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            sx={{ flexGrow: 1 }}
                        >
                            {todo.title}
                        </Typography>
                        {todo.isPinned && <PushPinIcon sx={{ fontSize: 16 }} color="warning" />}
                    </Stack>
                </Paper>

                <Box sx={{ p: 2 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 1.5,
                            mb: 2,
                            borderRadius: 2,
                            border: '1px solid #e0e0e0',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: 'white'
                        }}
                    >
                        <Box sx={{ textAlign: 'center', flex: 1 }}>
                            <Typography variant="caption" color="text.secondary" display="block">
                                Priority
                            </Typography>
                            <Chip
                                label={todo.priority}
                                size="small"
                                color={priorityColor[todo.priority]}
                                sx={{ mt: 0.5, fontWeight: 'bold' }}
                            />
                        </Box>

                        <Divider orientation="vertical" flexItem />

                        <Box sx={{ textAlign: 'center', flex: 1 }}>
                            <Typography variant="caption" color="text.secondary" display="block">
                                Status
                            </Typography>
                            <Chip
                                label={todo.status?.replace("_", " ")}
                                size="small"
                                variant="outlined"
                                sx={{ mt: 0.5 }}
                            />
                        </Box>

                        <Divider orientation="vertical" flexItem />

                        <Box sx={{ textAlign: 'center', flex: 1 }}>
                            <Typography variant="caption" color="text.secondary" display="block">
                                Due Date
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1, fontWeight: 'medium' }}>
                                {todo.dueDate ? new Date(todo.dueDate).toLocaleDateString("en-GB") : "-"}
                            </Typography>
                        </Box>
                    </Paper>

                    {todo.tags && todo.tags.length > 0 && (
                        <Paper
                            elevation={0}
                            sx={{
                                p: 1.5,
                                mb: 2,
                                borderRadius: 2,
                                border: '1px solid #e0e0e0',
                                display: 'flex',
                                justifyContent: 'center',
                                flexWrap: 'wrap',
                                gap: 1,
                                backgroundColor: 'white'
                            }}
                        >
                            {todo.tags.map((tag, idx) => (
                                <Chip
                                    key={idx}
                                    label={tag}
                                    size="small"
                                    color="primary"
                                    sx={{ borderRadius: '4px', fontWeight: 500 }}
                                />
                            ))}
                        </Paper>
                    )}

                    <Card sx={{ mb: 2, borderRadius: 2, border: '1px solid #eee', boxShadow: 'none' }}>
                        <CardContent>
                            <Typography variant="caption" color="text.secondary" fontWeight="bold">
                                DESCRIPTION
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                                {todo.description || "No description provided."}
                            </Typography>
                        </CardContent>
                    </Card>

                    {todo.subTasks && todo.subTasks.length > 0 && (
                        <Card sx={{ borderRadius: 2, border: '1px solid #eee', boxShadow: 'none' }}>
                            <CardContent>
                                <Typography variant="caption" color="text.secondary" fontWeight="bold">
                                    SUBTASKS ({todo.subTasks.filter(st => st.completed).length}/{todo.subTasks.length})
                                </Typography>
                                <Stack spacing={1} sx={{ mt: 1 }}>
                                    {todo.subTasks.map((st, index) => (
                                        <Stack key={index} direction="row" alignItems="center" spacing={1}>
                                            <CheckCircleIcon fontSize="small" color={st.completed ? "success" : "disabled"} />
                                            <Typography variant="body2" sx={{ textDecoration: st.completed ? 'line-through' : 'none' }}>
                                                {st.title}
                                            </Typography>
                                        </Stack>
                                    ))}
                                </Stack>
                            </CardContent>
                        </Card>
                    )}
                </Box>
            </Box>
        );
    }

    // --- DESKTOP LAYOUT ---
    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, margin: "0 auto", backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
            <Paper
                elevation={0}
                sx={{
                    p: 3, mb: 3, borderRadius: 4, background: "linear-gradient(135deg, #FFD700 0%, #FFC107 100%)",
                    color: "black", boxShadow: '0 4px 20px rgba(255, 193, 7, 0.4)'
                }}
            >
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                    <IconButton
                        onClick={() => navigate(-1)}
                        sx={{
                            color: "black",
                            backgroundColor: 'rgba(255,255,255,0.3)',
                            '&:hover': { backgroundColor: 'rgba(255,255,255,0.6)' }
                        }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h4" fontWeight="bold" sx={{ flexGrow: 1 }}>
                        {todo.title}
                    </Typography>
                    {todo.isPinned && (
                        <PushPinIcon sx={{ color: 'black' }} />
                    )}
                </Stack>

                <Divider sx={{ mb: 2, borderColor: 'rgba(0,0,0,0.1)' }} />

                <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
                    <Chip
                        icon={<FlagIcon sx={{ fontSize: 16, color: 'black' }} />}
                        label={todo.priority}
                        size="small"
                        sx={{ bgcolor: "rgba(255,255,255,0.6)", color: "black", fontWeight: 'bold' }}
                    />
                    <Chip
                        icon={<CheckCircleIcon sx={{ fontSize: 16, color: 'black' }} />}
                        label={todo.status?.replace("_", " ")}
                        size="small"
                        sx={{ bgcolor: "rgba(255,255,255,0.6)", color: "black" }}
                    />
                    {todo.dueDate && (
                        <Chip
                            icon={<CalendarTodayIcon sx={{ fontSize: 16, color: 'black' }} />}
                            label={new Date(todo.dueDate).toLocaleDateString("en-GB")}
                            size="small"
                            sx={{ bgcolor: "rgba(255,255,255,0.6)", color: "black" }}
                        />
                    )}
                </Stack>
            </Paper>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Stack spacing={3}>
                        <Card sx={{ borderRadius: 2, boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                            <CardContent>
                                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                    <NotesIcon sx={{ color: '#FFD700' }} />
                                    <Typography variant="h6" fontWeight="bold">
                                        Description
                                    </Typography>
                                </Stack>
                                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                    {todo.description || "No description provided for this task."}
                                </Typography>
                            </CardContent>
                        </Card>

                        {todo.subTasks && todo.subTasks.length > 0 && (
                            <Card sx={{ borderRadius: 2, boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                                <CardContent>
                                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                        <PlaylistAddCheckIcon sx={{ color: '#FFD700' }} />
                                        <Typography variant="h6" fontWeight="bold">
                                            Subtasks
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            ({todo.subTasks.filter(st => st.completed).length}/{todo.subTasks.length})
                                        </Typography>
                                    </Stack>
                                    <Stack spacing={1}>
                                        {todo.subTasks.map((st, index) => (
                                            <Paper
                                                key={index}
                                                variant="outlined"
                                                sx={{
                                                    p: 1.5, display: "flex", alignItems: "center", gap: 2, borderRadius: 1,
                                                    backgroundColor: st.completed ? "#f5f5f5" : "white",
                                                }}
                                            >
                                                <CheckCircleIcon fontSize="small" color={st.completed ? "success" : "disabled"} />
                                                <Typography variant="body2" sx={{ textDecoration: st.completed ? "line-through" : "none" }}>
                                                    {st.title}
                                                </Typography>
                                            </Paper>
                                        ))}
                                    </Stack>
                                </CardContent>
                            </Card>
                        )}
                    </Stack>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Box sx={{ position: "sticky", top: 20 }}>
                        <Card sx={{ borderRadius: 2, boxShadow: 'none', border: '1px solid #e0e0e0', height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom fontWeight="bold">
                                    Task Details
                                </Typography>
                                <Divider sx={{ mb: 3 }} />

                                <Stack spacing={3}>
                                    <Box>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <AccessTimeIcon fontSize="small" color="action" />
                                            <Typography variant="caption" color="text.secondary" fontWeight="bold">
                                                CREATED
                                            </Typography>
                                        </Stack>
                                        <Typography variant="body2" sx={{ mt: 0.5, ml: 3 }}>
                                            {formatDateTime(todo.createdDate)}
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <AccessTimeIcon fontSize="small" color="action" />
                                            <Typography variant="caption" color="text.secondary" fontWeight="bold">
                                                LAST UPDATED
                                            </Typography>
                                        </Stack>
                                        <Typography variant="body2" sx={{ mt: 0.5, ml: 3 }}>
                                            {formatDateTime(todo.updatedDate)}
                                        </Typography>
                                    </Box>
                                </Stack>

                                {todo.tags && todo.tags.length > 0 && (
                                    <>
                                        <Divider sx={{ my: 3 }} />
                                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                            <LabelIcon sx={{ color: '#FFD700' }} />
                                            <Typography variant="subtitle2" fontWeight="bold">
                                                TAGS
                                            </Typography>
                                        </Stack>
                                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                            {todo.tags.map((tag, idx) => (
                                                <Chip
                                                    key={idx}
                                                    label={tag}
                                                    sx={{
                                                        borderRadius: '4px', backgroundColor: '#FFF8E1', color: '#333',
                                                        border: '1px solid #FFD700', fontWeight: 'medium'
                                                    }}
                                                    size="small"
                                                />
                                            ))}
                                        </Box>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}