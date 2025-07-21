import * as React from "react";
import {
  AppBar, Box, Toolbar, IconButton, Typography, InputBase,
  Drawer, List, ListItem, ListItemButton, ListItemText
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import api from "../auth/axios";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": { backgroundColor: alpha(theme.palette.common.white, 0.25) },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": { width: "20ch" },
    },
  },
}));

export default function SearchAppBar({ searchQuery, setSearchQuery }) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [savedPages, setSavedPages] = React.useState([]);
  const navigate = useNavigate();

  const toggleDrawer = (open) => () => setDrawerOpen(open);

  React.useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      api.get("/auth/saved-pages", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setSavedPages(res.data.saved_pages || []))
      .catch((err) => console.error("Failed to load saved pages:", err));
    }
  }, []);

  const drawerItems = [
    { text: "Dashboard", route: "/dashboard" },
    { text: "New Page", route: "/new-page" },
    ...savedPages.map((name) => ({
      text: name,
      route: `/character/${name}`,
    })),
    { text: "Reset Password", route: "/reset-password" },
    { text: "Timeline", route: "/timeline" },
    { text: "Logout", action: handleLogout },
  ];

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/");
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large" edge="start" color="inherit"
            aria-label="menu" sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            DCU News Dashboard
          </Typography>
          <Search>
            <SearchIconWrapper><SearchIcon /></SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…" inputProps={{ "aria-label": "search" }}
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Search>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
          <List>
            {drawerItems.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  onClick={() => {
                    if (item.route) navigate(item.route);
                    if (item.action) item.action();
                  }}
                >
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
