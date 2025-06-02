import AppTheme from "../../theme/AppTheme";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import NavBar from "../NavBar/NavBar";
import { CssBaseline } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { Typography, Link as MuiLink } from "@mui/material";
import SitemarkIcon from "../Landing/SitemarkIcon";

const StyledBox = styled("div")(({ theme }) => ({
  alignSelf: "center",
  width: "100%",
  height: 400,
  marginTop: theme.spacing(4),
  borderRadius: (theme.vars || theme).shape.borderRadius,
}));

export default function Hero() {
  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Box
        id="hero"
        sx={theme => ({
          width: "100%",
          backgroundRepeat: "no-repeat",

          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)",
          ...theme.applyStyles("dark", {
            backgroundImage:
              "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)",
          }),
        })}
      >
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pt: { xs: 14, sm: 20 },
            pb: { xs: 8, sm: 12 },
          }}
        >
          <SitemarkIcon />
          <Stack
            spacing={2}
            useFlexGap
            sx={{ alignItems: "center", width: { xs: "100%", sm: "70%" } }}
          >
            <Typography
              variant="h1"
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                fontSize: "clamp(3rem, 10vw, 3.5rem)",
              }}
            >
              404&nbsp;
              <Typography
                component="span"
                variant="h1"
                sx={theme => ({
                  fontSize: "inherit",
                  color: "primary.main",
                  ...theme.applyStyles("dark", {
                    color: "primary.light",
                  }),
                })}
              >
                Not Found
              </Typography>
            </Typography>
            <Typography
              sx={{
                textAlign: "center",
                color: "text.secondary",
                width: { sm: "100%", md: "80%" },
              }}
            >
              The content you're looking for isn't here. Try searching or visit
              our{" "}
              <MuiLink component={Link} to="/" color="primary.light">
                main
              </MuiLink>{" "}
              page.
            </Typography>
          </Stack>
          <StyledBox id="image" />
        </Container>
      </Box>
    </AppTheme>
  );
}
