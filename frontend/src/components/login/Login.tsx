import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useVerifyToken } from "../../utils/hooks/useVerifyToken";
import { useAuthContext } from "../../utils/hooks/useCustomContext";
import useAxiosInstance from "../../utils/config/axiosInstance";
import { ApiResponse } from "../../../types/ApiResponse";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import LandingWrapper from "../shared/LandingWrapper";
import Copyright from "../shared/Copyright";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [staySignedIn, setStaySignedIn] = useState<boolean>(false);
  const [urlSlug, setUrlSlug] = useState<string>("");

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
      /* verifyToken(); */
    }
  }, [urlSlug, navigate, isAuth, user, verifyToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    getLoginData();
  };

  const getLoginData = useCallback(async () => {
    const urlSlug =
      location.pathname.split("/") && location.pathname.split("/")[1]
        ? location.pathname.split("/")[1]
        : "admin";
    const response = await axiosInstance.post<ApiResponse>(
      "/auth/login",
      {
        username: username,
        password: password,
        role: urlSlug,
        staySignedIn: staySignedIn,
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
  }, [
    username,
    password,
    location,
    axiosInstance,
    staySignedIn,
    setAccessToken,
    setIsAuth,
    setUser,
  ]);

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
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              onChange={(e) => setUserName(e.target.value)}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="staySignedIn"
                  id="staySignedIn"
                  onChange={(e) => setStaySignedIn(e.currentTarget.checked)}
                  color="primary"
                />
              }
              label="Stay signed in"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
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
