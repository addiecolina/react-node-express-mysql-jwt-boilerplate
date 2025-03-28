import {
  BrowserRouter,
  Link as RouterLink,
  Route,
  Routes,
} from "react-router-dom";
import Landing from "./pages/landing/LandingPage";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import "./style.css";
import AuthProviderRoutes from "./utils/routes/AuthProviderRoutes";
import HeaderLayout from "./layouts/HeaderLayout";
import RegisterPage from "./pages/login/RegisterPage";
import { ErrorBoundary } from "react-error-boundary";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";
import { DialogProvider } from "muibox";
import { Box, Fab, Link } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { toast, Toaster } from "react-hot-toast";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (query.state.data !== undefined) {
        console.log("error", error);
        toast.error(
          "Oops! Something went wrong. Please contact your system administrator"
        );
      }
    },
    onSettled(data, error, query) {
      if (
        data &&
        typeof data === "object" &&
        "success" in data &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        !(data as any).success
      ) {
        console.log("error", data, error, query);
        toast.error(
          "Oops! Something went wrong. Please contact your system administrator"
        );
      }
    },
  }),
});

function Fallback({ error }: { error: Error }) {
  return (
    <Stack sx={{ width: "100%" }} spacing={2}>
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        {error.message}
      </Alert>
      <Box>
        <Link
          component={RouterLink}
          to="/"
          sx={{ display: "contents", color: "white" }}
        >
          <Fab
            color="primary"
            aria-label="add"
            variant="extended"
            sx={{ maxWidth: "fit-content", m: 1 }}
          >
            <span>Back To Home</span>
            <HomeIcon />
          </Fab>
        </Link>
      </Box>
    </Stack>
  );
}

function App() {
  return (
    <>
      <ErrorBoundary FallbackComponent={Fallback}>
        <DialogProvider>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter basename={import.meta.env.VITE_BASENAME}>
              <Toaster
                position="top-center"
                reverseOrder={false}
                gutter={8}
                containerClassName=""
                containerStyle={{}}
                toastOptions={{
                  // Define default options
                  className: "",
                  duration: 10000,
                  removeDelay: 1000,
                  style: {
                    background: "#363636",
                    color: "#fff",
                  },
                }}
              />
              <Routes>
                <Route path="*" element={<HeaderLayout />}>
                  <Route index element={<Landing />} />
                  <Route path="register" element={<RegisterPage />} />
                  <Route path="*" element={<AuthProviderRoutes />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </QueryClientProvider>
        </DialogProvider>
      </ErrorBoundary>
    </>
  );
}

export default App;
