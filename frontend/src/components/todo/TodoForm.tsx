import { useForm, Controller } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Box,
  FormHelperText,
  Fab,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTodoCreate, useTodoUpdate } from "../../api";
import { useAuthContext } from "../../utils/hooks/useCustomContext";
import { v4 as uuidv4 } from "uuid";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

const TodoFormSchema = z.object({
  status: z.enum(["Not Started", "In Progress", "Cancelled", "Completed"]),
  priority: z.enum(["Critical", "High", "Low"]),
  title: z
    .string()
    .min(1, "Title is required")
    .max(25, "Maximum of 25 characters allowed"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(300, "Maximum of 300 characters allowed"),
  due_at: z.instanceof(dayjs as unknown as typeof Dayjs),
  created_at: z.instanceof(dayjs as unknown as typeof Dayjs).optional(),
  slug: z.string().optional(),
  completed_at: z.instanceof(dayjs as unknown as typeof Dayjs).optional(),
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

  if (updateTodo.isSuccess || createTodo.isSuccess) {
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
      completed_at: dayjs(data.completed_at) as Dayjs,
    },
  });

  const onSubmit = async (form: TodoFormData) => {
    const formData = {
      ...form,
      created_at: dayjs(data.created_at).format("YYYY-MM-DD HH:MM:ss"),
      due_at: dayjs(data.due_at).format("YYYY-MM-DD HH:MM:ss"),
      user_id: user?.name as string,
      slug: mode === "add" ? uuidv4() : (data?.slug as string),
      completed_at: null,
    };
    if (mode === "add") {
      createTodo.mutate(formData);
    } else {
      updateTodo.mutate(formData);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={3}>
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Controller
              name="priority"
              control={control}
              render={({ field: { onChange, value }, fieldState }) => (
                <FormControl
                  variant="outlined"
                  margin="normal"
                  sx={{ minWidth: 185 }}
                  disabled={mode === "edit"}
                  error={!!fieldState.error}
                >
                  <InputLabel>Priority</InputLabel>
                  <Select onChange={onChange} label="Priority" value={value}>
                    <MenuItem value="Critical">Critical</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                  </Select>
                  <FormHelperText>
                    {fieldState.error ? fieldState.error.message : null}
                  </FormHelperText>
                </FormControl>
              )}
            />
            <Controller
              name="status"
              control={control}
              render={({ field: { onChange, value }, fieldState }) => (
                <FormControl
                  variant="outlined"
                  margin="normal"
                  sx={{ minWidth: 185 }}
                  disabled={mode === "view"}
                  error={!!fieldState.error}
                >
                  <InputLabel>Status</InputLabel>
                  <Select onChange={onChange} label="Status" value={value}>
                    <MenuItem value="Not Started">Not Started</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                  </Select>
                  <FormHelperText>
                    {fieldState.error ? fieldState.error.message : null}
                  </FormHelperText>
                </FormControl>
              )}
            />
            <Controller
              name="completed_at"
              control={control}
              disabled
              render={({ field }) => (
                <DatePicker
                  {...field}
                  label="Completed"
                  defaultValue={dayjs(data.completed_at) as Dayjs}
                />
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
                disabled={mode === "edit"}
                multiline
                rows={4}
                value={value}
                error={!!fieldState.error}
                helperText={fieldState.error ? fieldState.error.message : null}
              />
            )}
          />
          <Box sx={{ display: "grid", gridAutoFlow: "column", gap: 2, mt: 2 }}>
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
                  value={dayjs(value) as Dayjs}
                  disablePast
                />
              )}
            />
          </Box>
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
          {mode !== "view" && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row-reverse",
                flexWrap: "wrap-reverse",
                "& > :not(style)": {
                  m: 1,
                },
              }}
            >
              <Fab
                color="primary"
                aria-label="save"
                variant="extended"
                type="submit"
                sx={{ maxWidth: "fit-content" }}
              >
                <span>SAVE RECORD</span>
                <SaveIcon />
              </Fab>
              <Fab
                color="secondary"
                aria-label="cancel"
                variant="extended"
                sx={{ maxWidth: "fit-content" }}
                onClick={() => navigate(-1)}
              >
                <span>CANCEL</span>
                <CancelIcon />
              </Fab>
            </Box>
          )}
        </Box>
      </Stack>
    </LocalizationProvider>
  );
};

export default TodoForm;
