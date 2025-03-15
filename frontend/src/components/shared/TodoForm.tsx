/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable  @typescript-eslint/no-explicit-any */
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
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TodoFormData } from "../../../types/Todo";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const TodoForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const mode = location.state?.mode || "view";
  const data = location.state?.data || {};

  if (Object.keys(data).length === 0) {
    navigate(-1);
  }

  const { control, handleSubmit, setValue } = useForm<TodoFormData>();

  const onSubmit = (data: TodoFormData) => {
    console.log(data);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={3}>
        <Box>
          <h1>{mode === "edit" ? "Edit" : "View"} Todo</h1>
        </Box>
        <Box component="form" noValidate>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormControl
                  variant="outlined"
                  margin="normal"
                  sx={{ minWidth: 230 }}
                  disabled={mode === "view"}
                >
                  <InputLabel>Status</InputLabel>
                  <Select {...field} label="Status" value={data.status}>
                    <MenuItem value="1">Completed</MenuItem>
                    <MenuItem value="2">In Progress</MenuItem>
                    <MenuItem value="3">Pending</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <FormControl
                  variant="outlined"
                  margin="normal"
                  sx={{ minWidth: 230 }}
                  disabled={mode === "view"}
                >
                  <InputLabel>Priority</InputLabel>
                  <Select {...field} label="Priority" value={data.priority}>
                    <MenuItem value="1">High</MenuItem>
                    <MenuItem value="2">Medium</MenuItem>
                    <MenuItem value="3">Low</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Box>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Title"
                variant="outlined"
                fullWidth
                margin="normal"
                disabled={mode === "view"}
                multiline
                rows={4}
                value={data.title}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                variant="outlined"
                fullWidth
                margin="normal"
                disabled={mode === "view"}
                multiline
                rows={4}
                value={data.description}
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
                  defaultValue={dayjs(data.created_at) as unknown as Dayjs}
                />
              )}
            />
            <Controller
              name="due_at"
              control={control}
              disabled={mode === "view"}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  label="Due At"
                  defaultValue={dayjs(data.due_at) as unknown as Dayjs}
                />
              )}
            />
          </Box>
          {mode === "edit" && (
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
