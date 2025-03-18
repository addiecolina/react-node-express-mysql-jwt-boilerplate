import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./pages/landing/LandingPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./style.css";
import AuthProviderRoutes from "./utils/routes/AuthProviderRoutes";
import HeaderLayout from "./layouts/HeaderLayout";
import RegisterPage from "./pages/login/RegisterPage";
import { ErrorBoundary } from "react-error-boundary";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";
import { DialogProvider } from "muibox";

const queryClient = new QueryClient();

function Fallback({ error }: { error: Error }) {
  return (
    <Stack sx={{ width: "100%" }} spacing={2}>
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        {error.message}
      </Alert>
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
