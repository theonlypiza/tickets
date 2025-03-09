"use client";
import { CssBaseline, ThemeProvider, createTheme, Box } from "@mui/material";

import "./globals.css";
import dynamic from "next/dynamic";
// Dynamically import Sidebar component with ssr: false
const Sidebar = dynamic(() => import("./components/sidebar"), { ssr: false });

// Dark theme setup
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const drawerWidth = 240;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <Box sx={{ display: "flex" }}>
            {/* Sidebar Component */}
            <Sidebar />

            {/* Main Content */}
            <Box
              component="main"
              sx={{ flexGrow: 1, p: 3, ml: `${drawerWidth}px` }}
            >
              {children}
            </Box>
          </Box>
        </ThemeProvider>
      </body>
    </html>
  );
}
