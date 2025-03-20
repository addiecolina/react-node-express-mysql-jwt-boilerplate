import { useForm, Controller, useFieldArray } from "react-hook-form";
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
  Button,
  Grid,
  Typography,
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
import DeleteIcon from "@mui/icons-material/Delete";
import { TodoFormSchema } from "../../model/TodoSchema";

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

  const {
    control,
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<TodoFormData>({
    resolver: zodResolver(TodoFormSchema),
    defaultValues: {
      status: data.status,
      priority: data.priority,
      title: data.title,
      description: data.description,
      due_at: dayjs(data.due_at) as Dayjs,
      created_at: dayjs(data.created_at) as Dayjs,
      completed_at: dayjs(data.completed_at) as Dayjs,
      subtasks: data.subtasks ? JSON.parse(data.subtasks) : [],
    },
  });

  const status = watch("status");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subtasks",
  });

  const onSubmit = async (form: TodoFormData) => {
    const formData = {
      ...form,
      created_at: dayjs(form.created_at).format("YYYY-MM-DD HH:MM:ss"),
      due_at: dayjs(form.due_at).format("YYYY-MM-DD HH:MM:ss"),
      user_id: user?.name as string,
      slug: mode === "add" ? uuidv4() : (data?.slug as string),
      completed_at: dayjs(form.completed_at).format("YYYY-MM-DD HH:MM:ss"),
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
                  disabled={mode === "edit"}
                  error={!!fieldState.error}
                >
                  <InputLabel>Priority</InputLabel>
                  <Select
                    onChange={onChange}
                    label="Priority"
                    value={value}
                    autoWidth
                  >
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
                  error={!!fieldState.error}
                >
                  <InputLabel>Status</InputLabel>
                  <Select
                    onChange={onChange}
                    label="Status"
                    value={value}
                    autoWidth
                  >
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
                  slotProps={{
                    textField: {
                      helperText: errors.due_at ? errors.due_at.message : "",
                      error: !!errors.due_at,
                    },
                  }}
                />
              )}
            />
            {status === "Completed" && (
              <Controller
                name="completed_at"
                control={control}
                disabled
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Completed At"
                    defaultValue={dayjs(data.completed_at) as Dayjs}
                  />
                )}
              />
            )}
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
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ paddingLeft: "16px" }}>
              Subtasks
            </Typography>
            {fields.map((field, index) => (
              <Grid
                container
                item
                spacing={2}
                key={field.id}
                alignItems="center"
              >
                <Grid item xs={6}>
                  <TextField
                    {...register(`subtasks.${index}.description` as const)}
                    label="Description"
                    fullWidth
                    error={!!errors.subtasks?.[index]?.description}
                    helperText={errors.subtasks?.[index]?.description?.message}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Controller
                    name={`subtasks.${index}.status` as const}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        label="Status"
                        fullWidth
                        error={!!errors.subtasks?.[index]?.status}
                      >
                        <MenuItem value="Done">Done</MenuItem>
                        <MenuItem value="Not Done">Not Done</MenuItem>
                      </TextField>
                    )}
                  />
                </Grid>
                <Grid item xs={2}>
                  <Button
                    variant="text"
                    color="error"
                    onClick={() => remove(index)}
                  >
                    <DeleteIcon />
                  </Button>
                </Grid>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button
                variant="outlined"
                onClick={() => append({ description: "", status: "Not Done" })}
                disabled={fields.length >= 10}
              >
                Add Subtask
              </Button>
            </Grid>
          </Grid>
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
