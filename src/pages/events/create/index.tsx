import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, TextField, Button } from "@mui/material";
import axios from "axios";

export default function CreateEventPage() {
  const [newEvent, setNewEvent] = useState({ title: "", description: "" });
  const router = useRouter(); // Hook para navegar

  const handleCreateEvent = async () => {
    console.log("Nuevo evento creado:", newEvent);
    const product = {
      title: "Electric Animals fest 2025",
      body_html: "<strong>Gran producto</strong> en venta.",
      vendor: "Electric Animals",
      product_type: "Tipo de producto",
      variants: [
        {
          title: "General",
          price: "20",
          quantity: 300,
        },
        {
          title: "VIP",
          price: "50",
          quantity: 200,
        },
        {
          title: "Backstage",
          price: "100",
          quantity: 100,
        },
      ],
      images: [
        {
          src: "https://tus-imagenes.com/imagen.jpg",
        },
      ],
    };

    try {
      const { data } = await axios.post("/api/shopify/products", product);
      console.log("Producto creado:", data);
    } catch (error) {
      console.error("Failed to fetch events", error);
    } finally {
      // setLoading(false);
    }
    //router.push("/eventos"); // Redirige a la lista de eventos después de crear
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 600, mx: "auto", p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Crear Nuevo Evento
      </Typography>

      <TextField
        label="Título del Evento"
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
        value={newEvent.title}
        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
      />
      <TextField
        label="Descripción"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        sx={{ mb: 2 }}
        value={newEvent.description}
        onChange={(e) =>
          setNewEvent({ ...newEvent, description: e.target.value })
        }
      />

      <Box sx={{ display: "flex", gap: 2 }}>
        <Button variant="contained" color="primary" onClick={handleCreateEvent}>
          Guardar Evento
        </Button>
        <Button variant="outlined" onClick={() => router.push("/eventos")}>
          Cancelar
        </Button>
      </Box>
    </Box>
  );
}
