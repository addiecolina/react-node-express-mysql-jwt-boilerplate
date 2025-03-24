import { Box, Fab } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckIcon from "@mui/icons-material/Check";

const ActionPanel = () => {
  const { watch, setValue } = useFormContext();
  const navigate = useNavigate();
  const location = useLocation();
  const mode = location.state?.mode || "add";

  const status = watch("status");
  const subtasks = watch("subtasks");

  let isSubTaskComplete = true;
  if (subtasks && subtasks.length > 0) {
    isSubTaskComplete = subtasks.every(
      (task: { status: string }) => task.status === "Done"
    );
  }

  const handleComplete = (event: {
    preventDefault: () => void;
    stopPropagation: () => void;
  }) => {
    event.preventDefault();
    event.stopPropagation();
    setValue("status", "Completed");
  };

  return (
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
      {isSubTaskComplete &&
      status !== "Completed" &&
      subtasks.length > 0 &&
      mode !== "add" ? (
        <Fab
          color="primary"
          aria-label="mark as completed"
          variant="extended"
          type="button"
          onClick={(e) => handleComplete(e)}
          sx={{ maxWidth: "fit-content" }}
        >
          <span>MARK AS COMPLETE</span>
          <CheckIcon />
        </Fab>
      ) : (
        <Fab
          color="primary"
          aria-label="save"
          variant="extended"
          type="submit"
          sx={{ maxWidth: "fit-content" }}
        >
          <span>SAVE RECORD</span>
          <SaveIcon />
        </Fab>
      )}

      <Fab
        color="secondary"
        aria-label="cancel"
        variant="extended"
        sx={{ maxWidth: "fit-content" }}
        onClick={() => navigate(-1)}
      >
        <span>CANCEL</span>
        <CancelIcon />
      </Fab>
    </Box>
  );
};

export default ActionPanel;
