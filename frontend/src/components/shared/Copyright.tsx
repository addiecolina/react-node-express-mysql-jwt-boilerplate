import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

export default function Copyright(props: { sx?: object }) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="#">
        Adrian.A.Colina
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
