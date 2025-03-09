"use client"; // Enables client-side fetching

import { useEffect, useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  Container,
  CircularProgress,
  Box,
  Breadcrumbs,
} from "@mui/material";
import Events from "./events";
import Orders from "./orders";
import Link from "next/link";

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
