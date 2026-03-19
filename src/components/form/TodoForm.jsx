import React from "react";
import { Formik, Form, Field } from "formik";
import { TextField, Checkbox, FormControlLabel, Button, MenuItem, Select, Box } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

export default function TodoForm({ onSubmit }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Formik
        initialValues={{
          title: "",
          description: "",
          dueDate: null,
          completed: false,
          priority: "medium",
          category: "",
          reminder: false,
          tags: "",
          notes: "",
          assignee: ""
        }}
        onSubmit={(values, { resetForm }) => {
          onSubmit(values, resetForm);
        }}
      >
        {({ values, setFieldValue }) => (
          <Form style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
            <Field
              name="title"
              as={TextField}
              label="Title"
              variant="outlined"
              fullWidth
            />

            <Field
              name="description"
              as={TextField}
              label="Description"
              variant="outlined"
              fullWidth
            />

            <DesktopDatePicker
              label="Due Date"
              inputFormat="dd/MM/yyyy"
              value={values.dueDate}
              onChange={(date) => setFieldValue("dueDate", date)}
              slotProps={{ textField: { variant: "outlined", fullWidth: true } }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={values.completed}
                  onChange={(e) => setFieldValue("completed", e.target.checked)}
                />
              }
              label="Completed"
            />

            <Field
              name="priority"
              as={Select}
              fullWidth
              value={values.priority}
              onChange={(e) => setFieldValue("priority", e.target.value)}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Field>

            <Field
              name="category"
              as={TextField}
              label="Category"
              variant="outlined"
              fullWidth
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={values.reminder}
                  onChange={(e) => setFieldValue("reminder", e.target.checked)}
                />
              }
              label="Reminder"
            />

            <Field
              name="tags"
              as={TextField}
              label="Tags (comma separated)"
              variant="outlined"
              fullWidth
            />

            <Field
              name="notes"
              as={TextField}
              label="Notes"
              variant="outlined"
              fullWidth
            />

            <Field
              name="assignee"
              as={TextField}
              label="Assignee"
              variant="outlined"
              fullWidth
            />

            <Button type="submit" variant="contained" color="primary">
              Add Task
            </Button>
          </Form>
        )}
      </Formik>
    </LocalizationProvider>
  );
}