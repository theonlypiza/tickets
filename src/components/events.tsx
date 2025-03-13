"use client"; // Enables client-side fetching

import { useEffect, useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";

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

type EventsProps = {
  onSelectEvent: (event: Event) => void;
};

export default function Events({ onSelectEvent }: EventsProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const handleEventClick = (event: Event) => {
    onSelectEvent(event);
  };

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

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Shopify Events
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          {events.length > 0 ? (
            events.map((event) => (
              <Grid item key={event.id} xs={12} sm={6} md={4}>
                <Card onClick={() => handleEventClick(event)}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={
                      event.images?.edges[0]?.node.src || "/default-image.jpg"
                    } // Fallback image
                    alt={event.images?.edges[0]?.node.altText || "Event image"}
                  />
                  <CardContent>
                    <Typography variant="h6">{event.title}</Typography>
                    <Typography
                      variant="body2"
                      dangerouslySetInnerHTML={{
                        __html: event.descriptionHtml,
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography>No events found</Typography>
          )}
        </Grid>
      )}
    </>
  );
}
