/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button } from "@mui/material";
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
import bcrypt from "bcryptjs";

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

  const onSubmit = async (data: FormData) => {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const modifiedData = { ...data, password: hashedPassword };
    createUser(modifiedData);
    console.log(modifiedData);
  };

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
                  type="password"
                  error={!!fieldState.error}
                  helperText={
                    fieldState.error ? fieldState.error.message : null
                  }
                  margin="normal"
                  fullWidth
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
