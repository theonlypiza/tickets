"use client"; // Enables client-side fetching

import { useState } from "react";
import { Typography, Box, Breadcrumbs, Button } from "@mui/material";
import Events from "./events";
import Orders from "./orders";
import AddCircleIcon from "@mui/icons-material/AddCircle";

type Event = {
  id: string;
  title: string;
  descriptionHtml: string;
  images: {
    edges: {
      node: {
        src: string;
        altText: string;
      };
    }[];
  };
};

export default function EventsTab() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      {/* Create Event Button */}
      <Button
        variant="contained"
        color="primary"
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 1,
        }}
        startIcon={<AddCircleIcon />}
      >
        Crear Evento
      </Button>
      {/* Breadcrumb Navigation */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Typography
          color="text.primary"
          onClick={() => setSelectedEvent(null)}
          sx={{ cursor: "pointer" }}
        >
          Events
        </Typography>
        {selectedEvent && (
          <Typography sx={{ color: "text.primary" }}>
            {selectedEvent.title} Orders
          </Typography>
        )}
      </Breadcrumbs>

      {/* Conditional Rendering */}
      {selectedEvent ? (
        <Orders eventId={selectedEvent.id.split("/").pop() || ""} />
      ) : (
        <Events onSelectEvent={setSelectedEvent} />
      )}
    </Box>
  );
}
