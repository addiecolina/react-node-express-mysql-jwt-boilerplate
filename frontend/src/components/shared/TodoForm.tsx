import { useForm, Controller } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Stack,
  Box,
  FormHelperText,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTodoUpdate } from "../../api/todo/todoUpdate";
import { useTodoCreate } from "../../api/todo/todoCreate";
import { useAuthContext } from "../../utils/hooks/useCustomContext";
import { v4 as uuidv4 } from "uuid";

const TodoFormSchema = z.object({
  status: z.enum(["1", "2", "3"]),
  priority: z.enum(["1", "2", "3"]),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  due_at: z.instanceof(dayjs as unknown as typeof Dayjs),
  created_at: z.instanceof(dayjs as unknown as typeof Dayjs).optional(),
  slug: z.string().optional(),
});

type TodoFormData = z.infer<typeof TodoFormSchema>;

const TodoForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const updateTodo = useTodoUpdate();
  const createTodo = useTodoCreate();
  const mode = location.state?.mode || "add";
  const data = location.state?.data || {};
  const { user } = useAuthContext();

  if (updateTodo.isSuccess) {
    navigate("/admin");
  }

  if (mode !== "add" && Object.keys(data).length === 0) {
    navigate(-1);
  }

  const { control, handleSubmit } = useForm<TodoFormData>({
    resolver: zodResolver(TodoFormSchema),
    defaultValues: {
      status: data.status,
      priority: data.priority,
      title: data.title,
      description: data.description,
      due_at: dayjs(data.due_at) as Dayjs,
      created_at: dayjs(data.created_at) as Dayjs,
    },
  });

  const onSubmit = async (data: TodoFormData) => {
    const formData = {
      ...data,
      created_at: dayjs(data.created_at).format("YYYY-MM-DD HH:MM:ss"),
      due_at: dayjs(data.due_at).format("YYYY-MM-DD HH:MM:ss"),
      user_id: user?.name as string,
      slug: mode === "add" ? uuidv4() : (data?.slug as string),
    };
    if (mode === "add") {
      createTodo.mutate(formData);
    } else {
      updateTodo.mutate(formData);
    }
    console.log(formData);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={3}>
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Controller
              name="status"
              control={control}
              render={({ field: { onChange, value }, fieldState }) => (
                <FormControl
                  variant="outlined"
                  margin="normal"
                  sx={{ minWidth: 230 }}
                  disabled={mode === "view"}
                  error={!!fieldState.error}
                >
                  <InputLabel>Status</InputLabel>
                  <Select onChange={onChange} label="Status" value={value}>
                    <MenuItem value="1">Completed</MenuItem>
                    <MenuItem value="2">In Progress</MenuItem>
                    <MenuItem value="3">Pending</MenuItem>
                  </Select>
                  <FormHelperText>
                    {fieldState.error ? fieldState.error.message : null}
                  </FormHelperText>
                </FormControl>
              )}
            />
            <Controller
              name="priority"
              control={control}
              render={({ field: { onChange, value }, fieldState }) => (
                <FormControl
                  variant="outlined"
                  margin="normal"
                  sx={{ minWidth: 230 }}
                  disabled={mode === "view"}
                  error={!!fieldState.error}
                >
                  <InputLabel>Priority</InputLabel>
                  <Select onChange={onChange} label="Priority" value={value}>
                    <MenuItem value="1">High</MenuItem>
                    <MenuItem value="2">Medium</MenuItem>
                    <MenuItem value="3">Low</MenuItem>
                  </Select>
                  <FormHelperText>
                    {fieldState.error ? fieldState.error.message : null}
                  </FormHelperText>
                </FormControl>
              )}
            />
          </Box>
          <Controller
            name="title"
            control={control}
            render={({ field: { onChange, value }, fieldState }) => (
              <TextField
                onChange={onChange}
                label="Title"
                variant="outlined"
                fullWidth
                margin="normal"
                disabled={mode === "view"}
                multiline
                rows={4}
                value={value}
                error={!!fieldState.error}
                helperText={fieldState.error ? fieldState.error.message : null}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field: { onChange, value }, fieldState }) => (
              <TextField
                onChange={onChange}
                label="Description"
                variant="outlined"
                fullWidth
                margin="normal"
                disabled={mode === "view"}
                multiline
                rows={4}
                value={value}
                error={!!fieldState.error}
                helperText={fieldState.error ? fieldState.error.message : null}
              />
            )}
          />
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Controller
              name="created_at"
              control={control}
              disabled
              render={({ field }) => (
                <DatePicker
                  {...field}
                  label="Created"
                  defaultValue={dayjs(data.created_at) as Dayjs}
                />
              )}
            />
            <Controller
              name="due_at"
              control={control}
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  onChange={onChange}
                  label="Due At"
                  // defaultValue={dayjs(data.due_at) as unknown as Dayjs}
                  value={dayjs(value) as Dayjs}
                  disablePast
                  disabled={mode === "view"}
                />
              )}
            />
          </Box>
          {mode !== "view" && (
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          )}
        </Box>
      </Stack>
      <Box>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Back
        </Button>
      </Box>
    </LocalizationProvider>
  );
};

export default TodoForm;
