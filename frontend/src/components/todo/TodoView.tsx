import {
  Fab,
  Box,
  Typography,
  Link,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTodoDelete } from "../../api";
import { useDialog } from "muibox";
import { Key } from "react";
import { getPriorityIcon, getStatusIcon } from "./utils/GetIcons";

const TodoView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state?.data || {};
  const deleteTodo = useTodoDelete();
  const dialog = useDialog();

  if (deleteTodo.isSuccess) {
    navigate("/admin");
  }

  const subtasks = JSON.parse(data.subtasks) ?? [];

  const handleDelete = () => {
    dialog
      .confirm(`This record will be deleted. Do you want to proceed?`)
      .then(() => {
        const slugArray = [];
        slugArray.push(data.slug);
        deleteTodo.mutate(slugArray);
      })
      .catch(() => console.log("Cancelled Deletion!"));
  };

  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridAutoFlow: "column",
          justifyContent: "space-between",
          alignItems: "center",
          "& > :not(style)": {
            m: 1,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            flexWrap: "wrap",
            columnGap: "14px",
          }}
        >
          <div>{getPriorityIcon(data.priority)}</div>
          <div>{getStatusIcon(data.status)}</div>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row-reverse",
            columnGap: "1rem",
            flexWrap: "wrap",
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
            onClick={handleDelete}
          >
            <DeleteIcon />
          </Fab>
        </Box>
      </Box>
      <Box sx={{ width: "100%", maxWidth: 500 }}>
        <Typography variant="h4">{data.title}</Typography>
        <Typography variant="subtitle1" gutterBottom>
          {dayjs(data.created_at).format("DD MMM YYYY")} -{" "}
          {dayjs(data.due_at).format("DD MMM YYYY")}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {data.description}
        </Typography>
      </Box>
      {subtasks && subtasks.length > 0 && (
        <Box sx={{ width: "100%" }}>
          <Divider sx={{ mt: 1 }} />
          <Typography variant="h5" sx={{ mt: 1 }}>
            Subtasks
          </Typography>
          <List>
            {subtasks.map(
              (
                value: { description: string; status: string },
                index: Key | null | undefined
              ) => (
                <ListItem
                  key={index}
                  sx={{
                    display: "grid",
                    gridAutoFlow: "column",
                    gridAutoColumns: "50% 50%",
                  }}
                >
                  <ListItemText primary={value.description} />
                  <ListItemText primary={getStatusIcon(value.status)} />
                </ListItem>
              )
            )}
          </List>
        </Box>
      )}
    </>
  );
};

export default TodoView;
