import { Box, CssBaseline } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import MainApp from "./MainApp";
import "./style.css";
import MainContainer from "./ui/MainContainer";
import NavBar from "./ui/NavBar";
import WrappedThemeProvider from "./ui/WrappedThemeProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <CssBaseline />
        <WrappedThemeProvider>
            <MainContainer>
                <Box minHeight={"100vh"}> {/* minHeight="calc(100vh - 10rem)" */}
                    {/* MAIN */}
                    <NavBar />
                    <MainApp />
                </Box>
            </MainContainer>
        </WrappedThemeProvider>
    </React.StrictMode>
);
