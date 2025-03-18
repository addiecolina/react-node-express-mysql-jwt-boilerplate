// import * as React from "react";
import { Fab, Box, Typography, Link } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const TodoView = () => {
  const location = useLocation();
  const data = location.state?.data || {};

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row-reverse",
          flexWrap: "wrap-reverse",
          "& > :not(style)": {
            m: 1,
          },
        }}
      >
        <Fab
          color="primary"
          aria-label="edit"
          variant="extended"
          sx={{ maxWidth: "fit-content" }}
        >
          <Link
            component={RouterLink}
            to="/admin/details"
            state={{ mode: "edit", data }}
            sx={{ display: "contents", color: "white" }}
          >
            <EditIcon />
          </Link>
        </Fab>
        <Fab
          color="default"
          aria-label="delete"
          variant="extended"
          sx={{ maxWidth: "fit-content" }}
        >
          <DeleteIcon />
        </Fab>
      </Box>
      <Box sx={{ width: "100%", maxWidth: 500 }}>
        <Typography variant="h1">{data.title}</Typography>
        <Typography variant="subtitle1" gutterBottom>
          {data.description}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {data.status}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {data.priority}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {data.due_at}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {data.created_at}
        </Typography>
      </Box>
    </>
  );
};

export default TodoView;
