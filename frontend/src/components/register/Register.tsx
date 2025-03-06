/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Alert } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ApiResponse } from "../../../types/ApiResponse";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import LandingWrapper from "../shared/LandingWrapper";
import Copyright from "../shared/Copyright";
import { InputAdornment, IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const schema = z
  .object({
    username: z.string(),
    password: z
      .string()
      .regex(/[a-zA-Z]/, "Password must contain at least one letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^a-zA-Z0-9]/,
        "Password must contain at least one special character"
      )
      .regex(
        /^[a-zA-Z0-9 !#()_-]+$/,
        "Password can only contain alphanumeric characters and special characters !#()_-."
      )
      .min(6, "Password must be at least 6 characters long"),
  })
  .refine((data) => data.username !== data.password, {
    message: "Username and password should not be equal",
    path: ["password"],
  });

type FormData = z.infer<typeof schema>;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
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

      if (response.data.success) {
        navigate("/admin/login");
      }
      if (response.data.error) {
        setAlertMessage(response.data.error.message);
      }
    },
    []
  );

  const onSubmit = async (data: FormData) => {
    createUser(data);
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  function handleMouseDownPassword(
    event: React.MouseEvent<HTMLButtonElement>
  ): void {
    event.preventDefault();
  }

  return (
    <LandingWrapper>
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 1 }}
          >
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
                  fullWidth
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
                  type={showPassword ? "text" : "password"}
                  error={!!fieldState.error}
                  helperText={
                    fieldState.error ? fieldState.error.message : null
                  }
                  margin="normal"
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Create Account
            </Button>
            {alertMessage && (
              <Alert sx={{ mt: 1, mb: 1 }} severity="error">
                {alertMessage}
              </Alert>
            )}
            <Copyright sx={{ mt: 5 }} />
          </Box>
        </Box>
      </Grid>
    </LandingWrapper>
    // <>
    //   <div>
    //     <div>
    //       <h1 style={{ textAlign: "center" }}>Create Account</h1>
    //       <form onSubmit={handleSubmit(onSubmit)}>
    //         <Controller
    //           name="username"
    //           control={control}
    //           defaultValue=""
    //           render={({ field, fieldState }) => (
    //             <TextField
    //               {...field}
    //               label="Username"
    //               error={!!fieldState.error}
    //               helperText={
    //                 fieldState.error ? fieldState.error.message : null
    //               }
    //               margin="normal"
    //             />
    //           )}
    //         />
    //         <Controller
    //           name="password"
    //           control={control}
    //           defaultValue=""
    //           render={({ field, fieldState }) => (
    //             <TextField
    //               {...field}
    //               label="Password"
    //               type="password"
    //               error={!!fieldState.error}
    //               helperText={
    //                 fieldState.error ? fieldState.error.message : null
    //               }
    //               margin="normal"
    //             />
    //           )}
    //         />
    //         <Button type="submit" variant="contained" color="primary">
    //           Submit
    //         </Button>
    //       </form>
    //     </div>
    //   </div>
    // </>
  );
};

export default Register;
