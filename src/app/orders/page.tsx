"use client"; // Enables client-side fetching

import Box from "@mui/material/Box";
import Orders from "../components/orders";
import { useEffect, useState } from "react";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

export default function BasicTabs() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("/api/shopify/products");
        const data = await response.json();
        console.log(data);
        setEvents(data.products.edges.map((edge: any) => edge.node)); // Extract event data
      } catch (error) {
        console.error("Failed to fetch events", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const handleEventChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedEvent(event.target.value as string); // Set selected event when changed
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Event Select Dropdown */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Event</InputLabel>
        <Select
          value={selectedEvent || ""}
          onChange={handleEventChange}
          label="Event"
          displayEmpty
        >
          {loading ? (
            <MenuItem disabled>
              <CircularProgress size={24} />
            </MenuItem>
          ) : (
            events.map((event) => (
              <MenuItem key={event.id} value={event.id}>
                {event.title}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>
      {selectedEvent && (
        <Orders eventId={selectedEvent?.split("/").pop() || ""} />
      )}
    </Box>
  );
}
