import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLocation, useNavigate } from "react-router-dom";
import { useVerifyToken } from "../../utils/hooks/useVerifyToken";
import { useAuthContext } from "../../utils/hooks/useCustomContext";
import useAxiosInstance from "../../utils/config/axiosInstance";
import { ApiResponse } from "../../../types/ApiResponse";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import LandingWrapper from "../shared/LandingWrapper";
import Copyright from "../shared/Copyright";
import { InputAdornment, IconButton, Alert } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const schema = z.object({
  username: z.string().min(1, { message: "Username cannot be blank" }),
  password: z.string().min(6, { message: "Password cannot be blank" }),
  staySignedIn: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [urlSlug, setUrlSlug] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

  const { control, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { isAuth, user, setIsAuth, setUser, setAccessToken } = useAuthContext();

  const verifyToken = useVerifyToken();

  const createAxiosInstance = useAxiosInstance();
  const axiosInstance = useMemo(createAxiosInstance, [
    setAccessToken,
    createAxiosInstance,
  ]);

  useEffect(() => {
    setUrlSlug(
      location.pathname.split("/") && location.pathname.split("/")[1]
        ? "/" + location.pathname.split("/")[1]
        : "/admin"
    );
  }, [location]);

  useEffect(() => {
    if (isAuth && user) {
      navigate(urlSlug, { replace: true });
    } else {
      console.log("Login: user not authenticated");
      verifyToken();
    }
  }, [urlSlug, navigate, isAuth, user, verifyToken]);

  const onSubmit = async (data: FormData) => {
    getLoginData(data);
  };

  const getLoginData = useCallback(
    async (data: FormData) => {
      const urlSlug =
        location.pathname.split("/") && location.pathname.split("/")[1]
          ? location.pathname.split("/")[1]
          : "admin";
      const response = await axiosInstance.post<ApiResponse>(
        "/auth/login",
        {
          username: data.username,
          password: data.password,
          role: urlSlug,
          staySignedIn: data?.staySignedIn || false,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.data) {
        const refreshTok = response.data.auth?.refreshToken;
        const accessTok = response.data.auth?.accessToken;
        const userData = response.data.auth?.user;
        if (
          response.data.success &&
          refreshTok &&
          accessTok &&
          response.data.auth.authenticated &&
          userData
        ) {
          setUser(userData);
          setAccessToken(accessTok);
          setIsAuth(true);
        }
      }
      if (response.data.error) {
        setAlertMessage(response.data.error.message);
      }
    },
    [location, axiosInstance, setAccessToken, setIsAuth, setUser]
  );

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
            Sign in
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
            <label>Stay signed in</label>
            <Controller
              name="staySignedIn"
              control={control}
              render={({ field }) => (
                <Checkbox
                  onChange={(e) => field.onChange(e.target.checked)}
                  checked={field.value}
                />
              )}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            {alertMessage && (
              <Alert sx={{ mt: 1, mb: 1 }} severity="error">
                {alertMessage}
              </Alert>
            )}
            <Grid container>
              <Grid item>
                <Link href="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            <Copyright sx={{ mt: 5 }} />
          </Box>
        </Box>
      </Grid>
    </LandingWrapper>
  );
};

export default Login;
