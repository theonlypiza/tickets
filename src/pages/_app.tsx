import { AppProps } from "next/app";
import { CssBaseline, ThemeProvider, createTheme, Box } from "@mui/material";
import dynamic from "next/dynamic";

import "../styles/globals.css";

// Dynamically import Sidebar with SSR disabled
const Sidebar = dynamic(() => import("../components/sidebar"), { ssr: false });

// Dark theme setup
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const drawerWidth = 240;

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
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
          <Component {...pageProps} />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
