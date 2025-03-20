import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: '"Roboto", "Public Sans", sans-serif',
  },
  palette: {
    primary: { main: "#027cec" },
    secondary: {
      main: "#CCC",
    },
    error: {
      main: "#ca0061",
    },
  },
  components: {
    MuiTextField: {
      variants: [
        {
          props: { variant: "outlined" },
          style: {
            borderRadius: "10px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
            },
          },
        },
      ],
    },
  },
});

export default theme;
