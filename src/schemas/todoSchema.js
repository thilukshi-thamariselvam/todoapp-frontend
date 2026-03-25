import * as yup from 'yup';

export const todoSchema = yup.object().shape({
  title: yup.string().required('Task title is required').min(3, 'Too short'),
  description: yup.string().max(500, 'Description too long'),
  dueDate: yup.date()
    .nullable()
    .test(
      "not-in-past",
      "Due date cannot be in the past",
      function (value) {
        if (!value) return true;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return value >= today;
      }
    )
    .typeError("Invalid date"),
  priority: yup.string().required('Priority is required'),
  status: yup.string().required('Status is required'),
  listCategory: yup.string().required('List category is required'),
  tags: yup.array().of(yup.string()),
  subTasks: yup.array().of(
    yup.object().shape({
      title: yup.string().required('Subtask title required'),
      isCompleted: yup.boolean().default(false),
    })
  ),
  reminder: yup.date().nullable(),
  isPinned: yup.boolean().default(false),
});