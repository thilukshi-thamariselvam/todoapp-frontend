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

  const formattedValues = initialValues ? {
    ...defaultValues,
    ...initialValues,
    dueDate: initialValues.dueDate ? new Date(initialValues.dueDate) : null,
    reminder: initialValues.reminder ? new Date(initialValues.reminder) : null,
    tags: Array.isArray(initialValues.tags) ? initialValues.tags : [],
    subTasks: Array.isArray(initialValues.subTasks) ? initialValues.subTasks : [],
    isPinned: initialValues.isPinned ?? false,
  } : defaultValues;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {mode === "add" ? "Create New Task" : "Edit Task"}
      </DialogTitle>

      <Formik
        initialValues={formattedValues}
        validationSchema={todoSchema}
        enableReinitialize={true}
        onSubmit={async (values, { resetForm }) => {
          await onSubmit(values);
          resetForm();
          onClose();
        }}
      >
        {({ values, errors, touched, setFieldValue, handleChange, isSubmitting }) => (
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
                    error={touched.description && Boolean(errors.description)}
                    helperText={touched.description && errors.description}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <DesktopDatePicker
                    label="Due Date"
                    value={values.dueDate}
                    onChange={(date) => setFieldValue("dueDate", date)}
                    minDate={today}
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
                  <Autocomplete
                    options={LIST_CATEGORY_OPTIONS.map(opt => opt.label)}
                    value={
                      LIST_CATEGORY_OPTIONS.find(opt => opt.value === values.listCategory)?.label ??
                      values.listCategory ??
                      ""
                    }
                    onInputChange={(event, newInputValue, reason) => {
                      if (reason === "input" || reason === "clear") {
                        const selectedOption = LIST_CATEGORY_OPTIONS.find(
                          opt => opt.label === newInputValue
                        );

                        setFieldValue(
                          "listCategory",
                          selectedOption ? selectedOption.value : newInputValue
                        );
                      }
                    }}
                    onChange={(event, newValue) => {
                      const selectedOption = LIST_CATEGORY_OPTIONS.find(
                        opt => opt.label === newValue
                      );

                      setFieldValue(
                        "listCategory",
                        selectedOption ? selectedOption.value : newValue || ""
                      );
                    }}
                    freeSolo
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="List Category *"
                        error={touched.listCategory && Boolean(errors.listCategory)}
                        helperText={touched.listCategory && errors.listCategory}
                      />
                    )}
                  />
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
                              label={`Subtask ${index + 1}`}
                              size="small"
                              fullWidth
                            />
                            <IconButton
                              color="error"
                              onClick={() => remove(index)}
                              aria-label={`Delete subtask ${index + 1}`}
                            >
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
              <Button onClick={onClose} color="inherit" disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                {mode === "add" ? "Create Task" : "Save Changes"}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}