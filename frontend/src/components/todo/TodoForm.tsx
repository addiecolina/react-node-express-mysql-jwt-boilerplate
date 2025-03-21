import {
  FormProvider,
  useForm,
  Controller,
  useFieldArray,
} from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import {
  TextField,
  MenuItem,
  Stack,
  Box,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTodoCreate, useTodoUpdate } from "../../api";
import { useAuthContext } from "../../utils/hooks/useCustomContext";
import { v4 as uuidv4 } from "uuid";
import DeleteIcon from "@mui/icons-material/Delete";
import { TodoFormSchema } from "../../model/todoSchema";
import StatusPanel from "./panels/StatusPanel";
import DetailsPanel from "./panels/DetailsPanel";
import ActionPanel from "./panels/ActionPanel";

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

  const methods = useForm<TodoFormData>({
    resolver: zodResolver(TodoFormSchema),
    defaultValues: {
      status: data.status,
      priority: data.priority,
      title: data.title,
      description: data.description,
      due_at: dayjs(data.due_at).add(1, "day") as Dayjs,
      created_at: dayjs(data.created_at) as Dayjs,
      completed_at: dayjs(data.completed_at) as Dayjs,
      subtasks: data.subtasks ? JSON.parse(data.subtasks) : [],
    },
  });

  const {
    control,
    watch,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = methods;
  const status = watch("status");

  if (status === "Completed") setValue("completed_at", dayjs() as Dayjs);

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
      completed_at:
        status === "Completed"
          ? dayjs(form.completed_at).format("YYYY-MM-DD HH:MM:ss")
          : null,
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
        <FormProvider {...methods}>
          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "baseline",
                flexWrap: "wrap",
              }}
            >
              <StatusPanel />
            </Box>
            <DetailsPanel />
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
                      helperText={
                        errors.subtasks?.[index]?.description?.message
                      }
                      disabled={status === "Completed"}
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
                          disabled={status === "Completed"}
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
                      color="warning"
                      onClick={() => remove(index)}
                      disabled={status === "Completed"}
                    >
                      <DeleteIcon />
                    </Button>
                  </Grid>
                </Grid>
              ))}
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  onClick={() =>
                    append({ description: "", status: "Not Done" })
                  }
                  disabled={fields.length >= 10 || status === "Completed"}
                >
                  Add Subtask
                </Button>
              </Grid>
            </Grid>
            <ActionPanel />
          </Box>
        </FormProvider>
      </Stack>
    </LocalizationProvider>
  );
};

export default TodoForm;
