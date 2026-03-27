import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  IconButton,
  Skeleton,
  Divider,
  Button,
  Stack,
  Card,
  CardContent,
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
import { getTodoById } from "../api";

const priorityColor = {
  LOW: "default",
  MEDIUM: "info",
  HIGH: "warning",
  URGENT: "error",
};

const statusColor = {
  PENDING: "warning",
  IN_PROGRESS: "info",
  COMPLETED: "success",
};

export default function TaskDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
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
      month: "long",
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

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, margin: "0 auto" }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 4,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ color: "white" }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" fontWeight="bold" sx={{ flexGrow: 1 }}>
            {todo.title}
          </Typography>
          {todo.isPinned && (
            <Chip
              label="Pinned"
              size="small"
              sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }}
            />
          )}
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center">
          <Chip
            icon={<FlagIcon sx={{ fontSize: 16 }} />}
            label={todo.priority}
            size="small"
            sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }}
          />
          <Chip
            icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
            label={todo.status?.replace("_", " ")}
            size="small"
            sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }}
          />
          {todo.dueDate && (
            <Chip
              icon={<CalendarTodayIcon sx={{ fontSize: 16 }} />}
              label={new Date(todo.dueDate).toLocaleDateString("en-GB")}
              size="small"
              sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }}
            />
          )}
        </Stack>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 2 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <NotesIcon color="action" />
                <Typography variant="h6" fontWeight="bold">
                  Description
                </Typography>
              </Stack>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                {todo.description || "No description provided for this task."}
              </Typography>
            </CardContent>
          </Card>

          {todo.subTasks && todo.subTasks.length > 0 && (
            <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <PlaylistAddCheckIcon color="action" />
                  <Typography variant="h6" fontWeight="bold">
                    Subtasks
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ({todo.subTasks.filter(st => st.completed).length}/{todo.subTasks.length} completed)
                  </Typography>
                </Stack>
                <Stack spacing={1}>
                  {todo.subTasks.map((st, index) => (
                    <Paper
                      key={index}
                      variant="outlined"
                      sx={{
                        p: 1.5,
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        bgcolor: st.completed ? "action.hover" : "background.paper",
                        borderRadius: 2,
                      }}
                    >
                      <CheckCircleIcon
                        fontSize="small"
                        color={st.completed ? "success" : "disabled"}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          textDecoration: st.completed ? "line-through" : "none",
                          color: st.completed ? "text.disabled" : "text.primary",
                        }}
                      >
                        {st.title}
                      </Typography>
                    </Paper>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Timeline
                </Typography>
                <Divider sx={{ mb: 2 }} />
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
              </CardContent>
            </Card>

            {todo.tags && todo.tags.length > 0 && (
              <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <LabelIcon color="action" />
                    <Typography variant="h6" fontWeight="bold">
                      Tags
                    </Typography>
                  </Stack>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {todo.tags.map((tag, idx) => (
                      <Chip
                        key={idx}
                        label={tag}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}