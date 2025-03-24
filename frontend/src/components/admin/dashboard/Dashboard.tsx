import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { useAuthContext } from "../../../utils/hooks/useCustomContext";
import Fab from "@mui/material/Fab";
import Link from "@mui/material/Link";
import AddIcon from "@mui/icons-material/Add";
import { Link as RouterLink } from "react-router-dom";
import TodoTable from "../../todo/Table";
import MainAppBar from "../../shared/MainAppBar";
// import { useQuery } from "@tanstack/react-query";
// import { Alert } from "@mui/material";

const drawerWidth = 240;

export default function Dashboard() {
  const { user } = useAuthContext();

  return (
    <Box sx={{ display: "flex" }}>
      <MainAppBar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap-reverse",
            "& > :not(style)": {
              m: 1,
            },
          }}
        >
          <Link
            component={RouterLink}
            to="/admin/details"
            state={{ mode: "add" }}
            sx={{ display: "contents", color: "white" }}
          >
            <Fab
              color="primary"
              aria-label="add"
              variant="extended"
              sx={{ maxWidth: "fit-content", m: 1 }}
            >
              <span>New Todo</span>
              <AddIcon />
            </Fab>
          </Link>
          {user?.name && <TodoTable id={user.name} />}
        </Box>
      </Box>
    </Box>
  );
}
