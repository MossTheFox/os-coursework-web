import { Box, CssBaseline } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import MessageReceiverMain from "./MessageReceiverMain";
import "./style.css";
import MainContainer from "./ui/MainContainer";
import WrappedThemeProvider from "./ui/WrappedThemeProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <CssBaseline />
        <WrappedThemeProvider>
            <MainContainer disableBottomPadding>
                <Box minHeight={"100vh"}> {/* minHeight="calc(100vh - 10rem)" */}
                    <MessageReceiverMain />
                </Box>
            </MainContainer>
        </WrappedThemeProvider>
    </React.StrictMode>
);
