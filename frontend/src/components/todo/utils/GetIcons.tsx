import { Typography } from "@mui/material";

export const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case "Critical":
      return <img src="/images/critical.svg" alt="Critical Priority" />;
    case "High":
      return <img src="/images/high.svg" alt="High Priority" />;
    case "Low":
      return <img src="/images/low.svg" alt="Low Priority" />;
    default:
      return null;
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
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
            {status}
          </Typography>
        </>
      );
    case "In Progress":
      return (
        <>
          <img src="/images/in-progress.svg" alt="In Progress" />
          <Typography
            component="span"
            sx={{
              marginLeft: 1,
              fontFamily: "inherit",
              fontSize: 14,
            }}
          >
            {status}
          </Typography>
        </>
      );
    case "Done":
      return (
        <>
          <img src="/images/complete.svg" alt="Done" />
          <Typography
            component="span"
            sx={{
              marginLeft: 1,
              fontFamily: "inherit",
              fontSize: 14,
            }}
          >
            {status}
          </Typography>
        </>
      );
    case "Not Done":
      return (
        <>
          <img src="/images/in-progress.svg" alt="Done" />
          <Typography
            component="span"
            sx={{
              marginLeft: 1,
              fontFamily: "inherit",
              fontSize: 14,
            }}
          >
            {status}
          </Typography>
        </>
      );
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
            {status}
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
            {status}
          </Typography>
        </>
      );

    default:
      return null;
  }
};
