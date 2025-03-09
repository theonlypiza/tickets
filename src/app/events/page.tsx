"use client"; // Enables client-side fetching

import Box from "@mui/material/Box";
import EventsTab from "../components/eventsTab";

export default function BasicTabs() {
  return (
    <Box sx={{ width: "100%" }}>
      <EventsTab></EventsTab>
    </Box>
  );
}
