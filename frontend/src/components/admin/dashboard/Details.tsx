import React from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { useLocation, useNavigate } from "react-router-dom";
import TodoForm from "../../todo/TodoForm";
import TodoView from "../../todo/TodoView";
import MainAppBar from "../../shared/MainAppBar";
import { useAuthContext } from "../../../utils/hooks/useCustomContext";

const drawerWidth = 240;

export default function Details() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuth } = useAuthContext();

  React.useEffect(() => {
    if (!isAuth) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mode = location.state?.mode || "view";

  return (
    isAuth && (
      <Box sx={{ display: "flex" }}>
        <MainAppBar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { xs: "100%", md: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <Toolbar />
          {mode === "view" && <TodoView />}
          {mode !== "view" && <TodoForm />}
        </Box>
      </Box>
    )
  );
}
