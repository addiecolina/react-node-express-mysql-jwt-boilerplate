import { Box, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { ReactNode } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useLocation } from "react-router-dom";

const DetailsPanel = () => {
  const location = useLocation();
  const mode = location.state?.mode || "add";
  const { control, watch, getValues, formState } = useFormContext();
  const status = watch("status");

  return (
    <>
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
              defaultValue={dayjs(getValues("created_at")) as Dayjs}
            />
          )}
        />
        <Controller
          name="due_at"
          control={control}
          render={({ field: { onChange, value } }) => (
            <DatePicker
              disabled={status === "Completed"}
              onChange={onChange}
              label="Due At"
              value={dayjs(value) as Dayjs}
              disablePast
              slotProps={{
                textField: {
                  helperText: formState.errors.due_at
                    ? (formState.errors.due_at.message as ReactNode)
                    : "",
                  error: !!formState.errors.due_at,
                },
              }}
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
            disabled={status === "Completed"}
            multiline
            rows={4}
            value={value}
            error={!!fieldState.error}
            helperText={fieldState.error ? fieldState.error.message : null}
          />
        )}
      />
    </>
  );
};

export default DetailsPanel;
