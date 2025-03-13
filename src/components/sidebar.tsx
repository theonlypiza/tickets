"use client";
import { useRouter, usePathname } from "next/navigation"; // Import useRouter
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
  const router = useRouter();
  const pathname = usePathname(); // Get the current path

  const handleListItemClick = (path: string) => {
    router.push(path); // Client-side navigation
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
          backgroundColor: "#1E1E1E",
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
            selected={pathname === "/events"} // Highlight based on current path
            onClick={() => handleListItemClick("/events")}
            sx={{
              backgroundColor: pathname === "/events" ? "#333" : "transparent",
              "&:hover": { backgroundColor: "#444" },
            }}
          >
            <ListItemIcon>
              <EventIcon
                sx={{ color: pathname === "/events" ? "#00C900" : "#fff" }}
              />
            </ListItemIcon>
            <ListItemText primary="Eventos" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            selected={pathname === "/orders"}
            onClick={() => handleListItemClick("/orders")}
            sx={{
              backgroundColor: pathname === "/orders" ? "#333" : "transparent",
              "&:hover": { backgroundColor: "#444" },
            }}
          >
            <ListItemIcon>
              <ShoppingCartIcon
                sx={{ color: pathname === "/orders" ? "#00C900" : "#fff" }}
              />
            </ListItemIcon>
            <ListItemText primary="Órdenes" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
