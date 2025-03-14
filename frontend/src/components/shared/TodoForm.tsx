/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable  @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from "axios";
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
    navigate("/admin");
  }

  const { control, handleSubmit, setValue } = useForm<TodoFormData>({
    defaultValues: {
      created_at: dayjs(data.created_at) as unknown as Dayjs,
      description: "",
      due_at: dayjs(data.due_at) as unknown as Dayjs,
      id: 0,
      priority: "",
      slug: "",
      status: "",
      title: "",
      user_id: "",
    },
  });

  // useEffect(() => {
  //   // Fetch default values from API
  //   axios
  //     .get("/api/details")
  //     .then((response) => {
  //       const { title, created, due, status, priority } = response.data;
  //       setValue("title", title);
  //       setValue("created", new Date(created));
  //       setValue("due", new Date(due));
  //       setValue("status", status);
  //       setValue("priority", priority);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching details:", error);
  //     });
  // }, [setValue]);

  const onSubmit = (data: TodoFormData) => {
    console.log(data);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form onSubmit={handleSubmit(onSubmit)}>
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
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <FormControl
              variant="outlined"
              margin="normal"
              disabled={mode === "view"}
            >
              <InputLabel>Status</InputLabel>
              <Select {...field} label="Status">
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
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
              disabled={mode === "view"}
            >
              <InputLabel>Priority</InputLabel>
              <Select {...field} label="Priority">
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
          )}
        />
        {mode === "edit" && (
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
        )}
      </form>
    </LocalizationProvider>
  );
};

export default TodoForm;
