import React, { useCallback, useMemo, useState } from "react";
import { useForm, Controller, useWatch, Control } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Alert,
  Typography,
  List,
  ListItem,
  ListItemText,
  Link,
} from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ApiResponse } from "../../../types/ApiResponse";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LandingWrapper from "../shared/LandingWrapper";
import Copyright from "../shared/Copyright";
import { InputAdornment, IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";

const schema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least three characters long"),
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

function PasswordWatched({ control }: { control: Control<FormData> }) {
  const password = useWatch({
    control,
    name: "password",
  });

  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[ !#()_-]/g.test(password);

  return password !== undefined && password !== "" ? (
    <List sx={{ width: "100%", bgcolor: "background.paper" }} dense>
      <ListItem
        sx={{ color: hasLetter ? "green" : "red", fontSize: "12px" }}
        disablePadding
      >
        {hasLetter ? <DoneIcon /> : <CloseIcon />}
        <ListItemText primary="Password must contain at least one letter" />
      </ListItem>
      <ListItem sx={{ color: hasNumber ? "green" : "red" }} disablePadding>
        {hasNumber ? <DoneIcon /> : <CloseIcon />}
        <ListItemText primary="Password must contain at least one number" />
      </ListItem>
      <ListItem sx={{ color: hasSpecial ? "green" : "red" }} disablePadding>
        {hasSpecial ? <DoneIcon /> : <CloseIcon />}
        <ListItemText primary="Password must contain at least one special character" />
      </ListItem>
    </List>
  ) : null;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
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
      setAlertMessage("");
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
        setShowToast(true);
        setTimeout(() => navigate("/", { replace: true }), 5000);
      }

      if (response.data.error) {
        setAlertMessage(response.data.error.message);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            {showToast && (
              <Alert severity="success">
                Successfully created user. Redirecting to Login...
              </Alert>
            )}
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
            <PasswordWatched control={control} />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Create Account
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/" variant="body2">
                  {"Already have an account? Login here"}
                </Link>
              </Grid>
            </Grid>
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
  );
};

export default Register;
