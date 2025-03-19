import { Fab, Box, Typography, Link } from "@mui/material";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTodoDelete } from "../../api";
import { useDialog } from "muibox";

const TodoView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state?.data || {};
  const deleteTodo = useTodoDelete();
  const dialog = useDialog();

  if (deleteTodo.isSuccess) {
    navigate("/admin");
  }

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

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "Critical":
        return (
          <img
            src="/images/critical.svg"
            alt="Critical Priority"
            style={{ paddingRight: "1rem" }}
          />
        );
      case "High":
        return (
          <img
            src="/images/high.svg"
            alt="High Priority"
            style={{ paddingRight: "1rem" }}
          />
        );
      case "Low":
        return (
          <img
            src="/images/low.svg"
            alt="Low Priority"
            style={{ paddingRight: "1rem" }}
          />
        );
      default:
        return null;
    }
  };

  const getStatusIcon = (priority: string) => {
    switch (priority) {
      case "Completed":
        return (
          <>
            <img src="/images/complete.svg" alt="Completed" />
            <Typography
              component="span"
              sx={{
                marginLeft: 1,
                fontFamily: "inherit",
                fontSize: 14,
              }}
            >
              Completed
            </Typography>
          </>
        );
      case "In Progress":
        return <img src="/images/in-progress.svg" alt="In Progress" />;
      case "Not Started":
        return (
          <>
            <img src="/images/not-started.svg" alt="Not Started" />
            <Typography
              component="span"
              sx={{
                marginLeft: 1,
                fontFamily: "inherit",
                fontSize: 14,
              }}
            >
              Not Started
            </Typography>
          </>
        );
      case "Cancelled":
        return (
          <>
            <img src="/images/cancelled.svg" alt="Cancelled" />
            <Typography
              component="span"
              sx={{
                marginLeft: 1,
                fontFamily: "inherit",
                fontSize: 14,
              }}
            >
              Cancelled
            </Typography>
          </>
        );

      default:
        return null;
    }
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
          }}
        >
          {getPriorityIcon(data.priority)}
          {getStatusIcon(data.status)}
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
        <Typography variant="h3">{data.title}</Typography>
        <Typography variant="subtitle1" gutterBottom>
          {dayjs(data.created_at).format("DD MMM YYYY")} -{" "}
          {dayjs(data.due_at).format("DD MMM YYYY")}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {data.description}
        </Typography>
      </Box>
    </>
  );
};

export default TodoView;
