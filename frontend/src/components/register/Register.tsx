import React, { useCallback, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ApiResponse } from "../../../types/ApiResponse";
import axios from "axios";

const schema = z.object({
  username: z.string().regex(/^[a-zA-Z0-9 !#()_-]+$/, "Invalid username"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type FormData = z.infer<typeof schema>;

const Register: React.FC = () => {
  const createAxiosInstance = useCallback(() => {
    const axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_API_PUBLIC_URL,
      timeout: 1000,
      withCredentials: true,
      validateStatus: function (status) {
        return status >= 200 && status < 600;
      },
    });

    return axiosInstance;
  }, []);

  const axiosInstance = useMemo(createAxiosInstance, [createAxiosInstance]);

  const { control, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const createUser = useCallback(
    async (data: { username: string; password: string }) => {
      const response = await axiosInstance.post<ApiResponse>(
        "/user/createUser",
        {
          username: data.username,
          password: data.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.data) {
        console.log(response.data.data);
      }
    },
    []
  );

  const onSubmit = (data: FormData) => {
    console.log(data);
    createUser(data);
  };

  return (
    <>
      <div>
        <div>
          <h1 style={{ textAlign: "center" }}>Create Account</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="username"
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Username"
                  error={!!fieldState.error}
                  helperText={
                    fieldState.error ? fieldState.error.message : null
                  }
                  margin="normal"
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Password"
                  type="password"
                  error={!!fieldState.error}
                  helperText={
                    fieldState.error ? fieldState.error.message : null
                  }
                  margin="normal"
                />
              )}
            />
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
