import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Sitemark from "../Landing/SitemarkIcon";
import { Link, useLocation } from "react-router-dom";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: "8px 12px",
}));

export default function AuthBar() {
  const [open, setOpen] = React.useState(false);
  const location = useLocation();

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        mt: "calc(var(--template-frame-height, 0px) + 28px)",
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              px: 0,
            }}
          >
            <Link
              to="/"
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              <Sitemark />
            </Link>

            <Box sx={{ display: { xs: "none", md: "flex" }, ml: 2 }}>
              <Button
                component={Link}
                to="/"
                color="primary"
                variant={location.pathname === "/" ? "contained" : "text"}
                size="small"
              >
                Home
              </Button>
              <Button
                component={Link}
                to="/demo"
                color="primary"
                variant={location.pathname === "/demo" ? "contained" : "text"}
                size="small"
              >
                Demo
              </Button>
            </Box>
          </Box>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1,
              alignItems: "center",
            }}
          >
            <Button
              component={Link}
              to="/signin"
              color="primary"
              variant="text"
              size="small"
            >
              Sign in
            </Button>
            <Button
              component={Link}
              to="/signup"
              color="primary"
              variant="contained"
              size="small"
            >
              Sign up
            </Button>
          </Box>

          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton aria-label="open menu" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
          </Box>
        </StyledToolbar>
      </Container>

      <Drawer
        anchor="top"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            top: "var(--template-frame-height, 0px)",
          },
        }}
      >
        <Box sx={{ p: 2, backgroundColor: "background.default" }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton onClick={toggleDrawer(false)}>
              <CloseRoundedIcon />
            </IconButton>
          </Box>

          <MenuItem onClick={toggleDrawer(false)}>
            <Button
              component={Link}
              to="/"
              fullWidth
              color="primary"
              variant="text"
            >
              Home
            </Button>
          </MenuItem>
          <MenuItem onClick={toggleDrawer(false)}>
            <Button
              component={Link}
              to="/demo"
              fullWidth
              color="primary"
              variant="text"
            >
              Demo
            </Button>
          </MenuItem>

          <Divider sx={{ my: 2 }} />

          <MenuItem onClick={toggleDrawer(false)}>
            <Button
              component={Link}
              to="/signup"
              fullWidth
              color="primary"
              variant="contained"
            >
              Sign up
            </Button>
          </MenuItem>
          <MenuItem onClick={toggleDrawer(false)}>
            <Button
              component={Link}
              to="/signin"
              fullWidth
              color="primary"
              variant="outlined"
            >
              Sign in
            </Button>
          </MenuItem>
        </Box>
      </Drawer>
    </AppBar>
  );
}
