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
import Menu from "@mui/material/Menu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";

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

export default function LandingBar() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const location = useLocation();
  const navigate = useNavigate();

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };
  const isLoggedIn = () => !!localStorage.getItem("token");

  const sections = ["features", "testimonials", "highlights", "pricing", "faq"];
  const settings = ["Profile", "Account", "Dashboard", "Logout"];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSitemarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/");
    } else {
      const hero = document.getElementById("hero");
      if (hero) {
        hero.scrollIntoView({ behavior: "smooth" });
      }
    }
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
            sx={{ flexGrow: 1, display: "flex", alignItems: "center", px: 0 }}
          >
            <a
              href={location.pathname === "/" ? "#hero" : "/"}
              onClick={handleSitemarkClick}
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              <Sitemark />
            </a>
            <Box sx={{ display: { xs: "none", md: "flex" }, ml: 2 }}>
              {sections.map((id) => (
                <Button
                  key={id}
                  href={`#${id}`}
                  variant="text"
                  color="info"
                  size="small"
                  onClick={(e) => {
                    e.preventDefault();
                    if (location.pathname !== "/") {
                      navigate("/", { replace: true });
                    } else {
                      scrollTo(id);
                    }
                  }}
                  sx={{ textTransform: "none" }}
                >
                  {id === "faq"
                    ? "FAQ"
                    : id.charAt(0).toUpperCase() + id.slice(1)}
                </Button>
              ))}
            </Box>
          </Box>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1,
              alignItems: "center",
            }}
          >
            {!isLoggedIn() ? (
              <>
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
              </>
            ) : (
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton
                    onClick={handleOpenUserMenu}
                    sx={{ p: 0, border: 0 }}
                  >
                    <Avatar />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting}
                      onClick={() => {
                        handleCloseUserMenu();
                        if (setting === "Logout") {
                          logout();
                        } else if (setting === "Dashboard") {
                          navigate("/dashboard");
                        } else if (setting === "Profile") {
                          navigate("/profile");
                        } else if (setting === "Account") {
                          navigate("/account");
                        }
                      }}
                    >
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            )}
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
        open={drawerOpen}
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

          {sections.map((id) => (
            <MenuItem
              key={id}
              onClick={() => {
                toggleDrawer(false)();
                if (location.pathname !== "/") {
                  navigate("/", { replace: true });
                } else {
                  scrollTo(id);
                }
              }}
            >
              <Typography>
                {id === "faq"
                  ? "FAQ"
                  : id.charAt(0).toUpperCase() + id.slice(1)}
              </Typography>
            </MenuItem>
          ))}

          <Divider sx={{ my: 3 }} />

          {!isLoggedIn() ? (
            <>
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
            </>
          ) : (
            settings.map((setting) => (
              <MenuItem
                key={setting}
                onClick={() => {
                  toggleDrawer(false)();
                  if (setting === "Logout") {
                    logout();
                  } else if (setting === "Dashboard") {
                    navigate("/dashboard");
                  } else if (setting === "Profile") {
                    navigate("/profile");
                  } else if (setting === "Account") {
                    navigate("/account");
                  }
                }}
              >
                <Typography textAlign="center">{setting}</Typography>
              </MenuItem>
            ))
          )}
        </Box>
      </Drawer>
    </AppBar>
  );
}
