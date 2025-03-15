import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  Input,
  FormControl,
  Paper,
} from "@mui/material";
import { Add, Delete, PhotoCamera } from "@mui/icons-material";
import axios from "axios";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

// Rich Text Editor Component
function RichTextEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <Box sx={{ border: "1px solid #ccc", p: 2, borderRadius: 1, mb: 2 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
        Descripción
      </Typography>
      <EditorContent editor={editor} />
    </Box>
  );
}

export default function CreateEventPage() {
  const [newEvent, setNewEvent] = useState({ title: "", description: "" });
  const [variants, setVariants] = useState([
    { title: "", price: 0, quantity: 0 },
  ]);
  const [image, setImage] = useState(null); // Track image file state
  const [imagePreview, setImagePreview] = useState(null); // Track image preview state
  const [imageFileName, setImageFileName] = useState(""); // Track image file name
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCreateEvent = async () => {
    setLoading(true);
    const product = {
      title: newEvent.title,
      body_html: newEvent.description,
      vendor: "Electric Animals",
      product_type: "Tipo de producto",
      variants: variants.map((v) => ({
        title: v.title,
        price: v.price,
        quantity: v.quantity,
      })),
      images: image
        ? [
            {
              base64Image: imagePreview.split(",")[1], // Send the base64 image string
              fileName: imageFileName, // Include the file name
            },
          ]
        : [],
    };

    console.log(product);
    try {
      const { data } = await axios.post("/api/shopify/products", product);
      console.log("Producto creado:", data);
      // router.push("/eventos");
    } catch (error) {
      console.error("Error al crear el producto:", error);
    } finally {
      setLoading(false);
      router.push("/eventos");
    }
  };

  const handleVariantChange = (index: number, field: string, value: any) => {
    const updatedVariants = [...variants];

    if (field === "price" || field === "quantity") {
      value = parseInt(value, 10);
    }

    updatedVariants[index] = { ...updatedVariants[index], [field]: value };
    setVariants(updatedVariants);
  };

  const addVariant = () => {
    setVariants([...variants, { title: "", price: 0, quantity: 0 }]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(file);
        setImagePreview(reader.result as string); // Set the preview to base64
        setImageFileName(file.name); // Set the file name
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box sx={{ width: "100%", mx: "auto", p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        Crear Nuevo Evento
      </Typography>

      <Paper sx={{ padding: 3, borderRadius: 2, boxShadow: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Título del Evento
        </Typography>
        <TextField
          label="Título del Evento"
          variant="outlined"
          fullWidth
          sx={{ mb: 3 }}
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
        />

        <RichTextEditor
          value={newEvent.description}
          onChange={(value) => setNewEvent({ ...newEvent, description: value })}
        />

        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Variantes
        </Typography>
        {variants.map((variant, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              gap: 2,
              mb: 2,
              alignItems: "center",
              borderBottom: "1px solid #ddd",
              pb: 2,
            }}
          >
            <TextField
              label="Título"
              variant="outlined"
              fullWidth
              value={variant.title}
              onChange={(e) =>
                handleVariantChange(index, "title", e.target.value)
              }
            />
            <TextField
              label="Precio"
              variant="outlined"
              type="number"
              value={variant.price}
              onChange={(e) =>
                handleVariantChange(index, "price", e.target.value)
              }
              sx={{ width: "120px" }}
            />
            <TextField
              label="Cantidad"
              variant="outlined"
              type="number"
              value={variant.quantity}
              onChange={(e) =>
                handleVariantChange(index, "quantity", e.target.value)
              }
              sx={{ width: "100px" }}
            />
            <IconButton onClick={() => removeVariant(index)} color="error">
              <Delete />
            </IconButton>
          </Box>
        ))}

        <Button
          variant="outlined"
          color="primary"
          startIcon={<Add />}
          onClick={addVariant}
          sx={{ mb: 2 }}
        >
          Agregar Variante
        </Button>

        {/* Image Upload Section */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Subir Imagen
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Input
              type="file"
              onChange={handleImageChange}
              sx={{ display: "none" }}
              id="image-upload"
            />
            <label htmlFor="image-upload">
              <Button
                variant="contained"
                color="secondary"
                component="span"
                startIcon={<PhotoCamera />}
              >
                Seleccionar Imagen
              </Button>
            </label>

            {imagePreview && (
              <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
                <IconButton
                  color="error"
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                    setImageFileName(""); // Reset the filename
                  }}
                  sx={{ ml: 1 }}
                >
                  <Delete />
                </IconButton>
              </Box>
            )}
          </Box>
        </FormControl>

        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateEvent}
            disabled={loading}
            sx={{ position: "relative" }}
          >
            {loading && (
              <CircularProgress
                size={24}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-12px",
                  marginLeft: "-12px",
                }}
              />
            )}
            {loading ? "Cargando..." : "Guardar Evento"}
          </Button>
          <Button variant="outlined" onClick={() => router.push("/eventos")}>
            Cancelar
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
