import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { useLocation } from "react-router-dom";
import TodoForm from "../../todo/TodoForm";
import TodoView from "../../todo/TodoView";
import MainAppBar from "../../shared/MainAppBar";

const drawerWidth = 240;

export default function Details() {
  const location = useLocation();
  const mode = location.state?.mode || "view";

  return (
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
  );
}
