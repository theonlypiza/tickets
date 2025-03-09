// Sidebar.tsx
"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation"; // New hook to access the pathname
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  ListItem,
  Box,
  Typography,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CoronavirusIcon from "@mui/icons-material/Coronavirus";

const drawerWidth = 240;

const Sidebar = () => {
  const pathname = usePathname(); // This hook gives you the current pathname
  const [selectedPath, setSelectedPath] = useState<string>("");

  useEffect(() => {
    // Update the selected path when the pathname changes
    setSelectedPath(pathname || "");
  }, [pathname]); // Dependency on pathname so it updates when the route changes

  const handleListItemClick = (path: string) => {
    setSelectedPath(path);
    window.location.href = path;
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 1,
          height: 64,
          paddingLeft: "15px",
          backgroundColor: "#1E1E1E", // Slightly lighter dark color
          borderBottom: "1px solid #333",
        }}
      >
        <CoronavirusIcon sx={{ color: "#00C900" }} /> {/* Company Icon */}
        <Typography variant="h6" fontWeight="bold">
          Nexus
        </Typography>
      </Box>

      {/* Drawer Content */}
      <List>
        <ListItem disablePadding>
          <ListItemButton
            selected={selectedPath === "/events"} // Check if the path matches /events
            onClick={() => handleListItemClick("/events")}
            sx={{
              backgroundColor:
                selectedPath === "/events" ? "#333" : "transparent",
              "&:hover": {
                backgroundColor: "#444",
              },
            }}
          >
            <ListItemIcon>
              <EventIcon
                sx={{ color: selectedPath === "/events" ? "#00C900" : "#fff" }}
              />
            </ListItemIcon>
            <ListItemText primary="Eventos" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            selected={selectedPath === "/orders"}
            onClick={() => handleListItemClick("/orders")}
            sx={{
              backgroundColor:
                selectedPath === "/orders" ? "#333" : "transparent",
              "&:hover": {
                backgroundColor: "#444",
              },
            }}
          >
            <ListItemIcon>
              <ShoppingCartIcon
                sx={{ color: selectedPath === "/orders" ? "#00C900" : "#fff" }}
              />
            </ListItemIcon>
            <ListItemText primary="Ordenes" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
