/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable  @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import axios from "axios";
import { TodoFormData } from "../../../types/Todo";

const TodoForm: React.FC<{ mode: "view" | "edit"; data: TodoFormData }> = ({
  mode,
  data,
}) => {
  const { control, handleSubmit, setValue } = useForm<TodoFormData>({
    defaultValues: {
      created_at: new Date(),
      description: "",
      due_at: new Date(),
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
          />
        )}
      />
      {/* <Controller
        name="created"
        control={control}
        render={({ field }) => (
          <DatePicker
            {...field}
            label="Created"
            renderInput={(params: any) => (
              <TextField
                {...params}
                variant="outlined"
                fullWidth
                margin="normal"
                disabled={mode === "view"}
              />
            )}
          />
        )}
      />
      <Controller
        name="due"
        control={control}
        render={({ field }) => (
          <DatePicker
            {...field}
            label="Due"
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                fullWidth
                margin="normal"
                disabled={mode === "view"}
              />
            )}
          />
        )}
      /> */}
      <Controller
        name="status"
        control={control}
        render={({ field }) => (
          <FormControl
            variant="outlined"
            fullWidth
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
            fullWidth
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
  );
};

export default TodoForm;
