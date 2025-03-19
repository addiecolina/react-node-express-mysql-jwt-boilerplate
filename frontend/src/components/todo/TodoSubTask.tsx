import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, MenuItem, Grid } from "@mui/material";

const subTaskSchema = z.object({
  description: z.string().min(1, "Description is required"),
  status: z.enum(["Done", "Not Done"]),
});

const formSchema = z.object({
  subtasks: z
    .array(subTaskSchema)
    .max(10, "You can add up to 10 subtasks only"),
});

type FormValue = z.infer<typeof formSchema>;

const SubtaskForm: React.FC = () => {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValue>({
    defaultValues: {
      subtasks: [{ description: "", status: "Not Done" }],
    },
    resolver: zodResolver(formSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subtasks",
  });

  const onSubmit = (data: FormValue) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        {fields.map((field, index) => (
          <Grid container item spacing={2} key={field.id}>
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
                variant="outlined"
                color="error"
                onClick={() => remove(index)}
              >
                Delete
              </Button>
            </Grid>
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={() => append({ description: "", status: "Not Done" })}
            disabled={fields.length >= 10}
          >
            Add Subtask
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default SubtaskForm;
