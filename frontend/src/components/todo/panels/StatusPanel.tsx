import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { Controller, useFormContext } from "react-hook-form";
import { useLocation } from "react-router-dom";

const StatusPanel = () => {
  const location = useLocation();
  const mode = location.state?.mode || "add";
  const { control, watch, setValue, getValues } = useFormContext();
  const [minWidth, setMinWidth] = React.useState<number | null>(null);
  const menuCallbackRef = React.useCallback(
    (menuDiv: HTMLDivElement | null) => {
      if (menuDiv !== null) {
        if (minWidth === null || minWidth !== menuDiv.clientWidth) {
          setMinWidth(menuDiv.clientWidth);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const status = watch("status");
  const subtasks = watch("subtasks");

  let isSubTaskComplete = true;
  if (status === "Completed") setValue("completed_at", dayjs() as Dayjs);
  if (subtasks && subtasks.length > 0) {
    isSubTaskComplete = subtasks.every(
      (task: { status: string }) => task.status === "Done"
    );
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "baseline",
          flexWrap: "wrap",
        }}
      >
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
                value={value ?? ""}
                sx={minWidth === null ? {} : { minWidth: minWidth + 14 }}
                MenuProps={{
                  keepMounted: true,
                  slotProps: { paper: { ref: menuCallbackRef } },
                }}
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
                sx={minWidth === null ? {} : { minWidth: minWidth + 14 }}
                MenuProps={{
                  keepMounted: true,
                  slotProps: { paper: { ref: menuCallbackRef } },
                }}
              >
                <MenuItem value="Not Started">Not Started</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
                <MenuItem
                  value="Completed"
                  disabled={!isSubTaskComplete || mode === "add"}
                >
                  Completed
                </MenuItem>
              </Select>
              <FormHelperText>
                {fieldState.error ? fieldState.error.message : null}
              </FormHelperText>
            </FormControl>
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
                defaultValue={dayjs(getValues("completed_at")) as Dayjs}
              />
            )}
          />
        )}
      </Box>
    </>
  );
};

export default StatusPanel;
