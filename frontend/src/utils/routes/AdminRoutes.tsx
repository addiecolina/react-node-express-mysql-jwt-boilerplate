import { useRoutes } from "react-router-dom";
import ProtectedRoutes from "../../components/ProtectedRoutes";
import Dashboard from "../../components/admin/dashboard/Dashboard";
import PageNotFound from "../../components/PageNotFound";
import { ThemeProvider } from "@emotion/react";
import theme from "../../theme";
import { CssBaseline } from "@mui/material";
import Details from "../../components/admin/dashboard/Details";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const AdminRoutes = () => {
  const routes = useRoutes([
    {
      path: "*",
      element: (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ProtectedRoutes>
            {useRoutes([
              {
                path: "/",
                children: [
                  { index: true, element: <Dashboard /> },
                  { path: "admin", element: <Dashboard /> },
                  { path: "details", element: <Details /> },
                ],
              },
              { path: "*", element: <PageNotFound /> },
            ])}
          </ProtectedRoutes>
        </ThemeProvider>
      ),
    },
    { path: "*", element: <PageNotFound /> },
  ]);

  return routes;
};

export default AdminRoutes;
