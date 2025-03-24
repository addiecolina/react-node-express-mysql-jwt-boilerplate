import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useMedia from "../../utils/hooks/useMedia";

const theme = createTheme();

const LandingWrapper = ({ children }: { children: React.ReactNode }) => {
  const isWide = useMedia("(min-width: 1024px)");

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: "url(http://localhost:5173/images/wallpaper.svg)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {isWide && (
          <img
            src="/images/brand.svg"
            alt="Navtask Brand"
            style={{
              position: "fixed",
              top: "40%",
              left: "20%",
            }}
          />
        )}

        {children}
      </Grid>
    </ThemeProvider>
  );
};

export default LandingWrapper;
