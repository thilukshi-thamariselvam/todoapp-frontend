import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Grid, TextField, Select, MenuItem, FormControl, 
  InputLabel, Switch, FormControlLabel, Box, IconButton, Typography
} from "@mui/material";
import { Formik, Form, Field, FieldArray } from "formik";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Autocomplete } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { todoSchema } from "../schemas/todoSchema";
import { PRIORITY_OPTIONS, STATUS_OPTIONS, LIST_CATEGORY_OPTIONS } from "../constants/todoConstants";

export default function TaskModal({ open, onClose, onSubmit, initialValues, mode = "add" }) {
  
  const defaultValues = {
    title: "",
    description: "",
    dueDate: null,
    priority: "MEDIUM",
    status: "PENDING",
    listCategory: "PERSONAL",
    tags: [],
    subTasks: [],
    reminder: null,
    isPinned: false,
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {mode === "add" ? "Create New Task" : "Edit Task"}
      </DialogTitle>
      
      <Formik
        initialValues={initialValues || defaultValues}
        validationSchema={todoSchema}
        enableReinitialize={true}
        onSubmit={(values, { resetForm }) => {
          onSubmit(values);
          resetForm();
          onClose();
        }}
      >
        {({ values, errors, touched, setFieldValue, handleChange }) => (
          <Form>
            <DialogContent dividers>
              <Grid container spacing={2}>
                
                <Grid size={{ xs: 12 }}>
                  <Field
                    name="title"
                    as={TextField}
                    label="Task Title *"
                    fullWidth
                    error={touched.title && Boolean(errors.title)}
                    helperText={touched.title && errors.title}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Field
                    name="description"
                    as={TextField}
                    label="Description"
                    multiline
                    rows={3}
                    fullWidth
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <DesktopDatePicker
                    label="Due Date"
                    value={values.dueDate}
                    onChange={(date) => setFieldValue("dueDate", date)}
                    slotProps={{ textField: { fullWidth: true, variant: "outlined" } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                   <TimePicker
                      label="Reminder Time"
                      value={values.reminder}
                      onChange={(time) => setFieldValue("reminder", time)}
                      slotProps={{ textField: { fullWidth: true, variant: "outlined" } }}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Priority *</InputLabel>
                    <Select
                      name="priority"
                      value={values.priority}
                      onChange={handleChange}
                      label="Priority *"
                    >
                      {PRIORITY_OPTIONS.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Status *</InputLabel>
                    <Select
                      name="status"
                      value={values.status}
                      onChange={handleChange}
                      label="Status *"
                    >
                      {STATUS_OPTIONS.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <FormControl fullWidth>
                    <InputLabel>List Category *</InputLabel>
                    <Select
                      name="listCategory"
                      value={values.listCategory}
                      onChange={handleChange}
                      label="List Category *"
                    >
                      {LIST_CATEGORY_OPTIONS.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Autocomplete
                    multiple
                    freeSolo
                    options={[]}
                    value={values.tags}
                    onChange={(e, newValue) => setFieldValue("tags", newValue)}
                    renderInput={(params) => (
                      <TextField {...params} label="Tags (Press Enter to add)" />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                   <FormControlLabel
                    control={
                      <Switch
                        checked={values.isPinned}
                        onChange={(e) => setFieldValue("isPinned", e.target.checked)}
                      />
                    }
                    label="Pin this task"
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" gutterBottom>Sub Tasks</Typography>
                  <FieldArray name="subTasks">
                    {({ push, remove }) => (
                      <Box>
                        {values.subTasks.map((sub, index) => (
                          <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                            <Field
                              name={`subTasks.${index}.title`}
                              as={TextField}
                              size="small"
                              fullWidth
                            />
                            <IconButton color="error" onClick={() => remove(index)}>
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        ))}
                        <Button 
                          startIcon={<AddIcon />} 
                          onClick={() => push({ title: '', isCompleted: false })}
                          variant="outlined"
                          size="small"
                        >
                          Add Subtask
                        </Button>
                      </Box>
                    )}
                  </FieldArray>
                </Grid>

              </Grid>
            </DialogContent>

            <DialogActions>
              <Button onClick={onClose} color="inherit">Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
                {mode === "add" ? "Create Task" : "Save Changes"}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}