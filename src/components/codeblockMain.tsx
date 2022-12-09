import { Box, CssBaseline } from "@mui/material";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import MainContainer from "../ui/MainContainer";
import WrappedThemeProvider from "../ui/WrappedThemeProvider";
import CodeBlock, { PreloadedCodeBlockJsonKeys } from "./codeblock/CodeBlock";

function CodeblockMain() {
    const [id, setId] = useState<PreloadedCodeBlockJsonKeys>('');

    useEffect(() => {
        const fn = async (ev: MessageEvent) => {
            try {
                let parsed = JSON.parse(ev.data);
                if (parsed && parsed.type === 'codeblock' && typeof parsed.data === 'string') {
                    setId(parsed.data + '' as PreloadedCodeBlockJsonKeys);
                }
            } catch (err) {
                // skip
            }
        };
        window.addEventListener('message', fn);
        return () => {
            window.removeEventListener('message', fn);
        }
    }, []);
    return <CodeBlock id={id} />
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <CssBaseline />
        <WrappedThemeProvider>
            <MainContainer disableBottomPadding>
                <Box minHeight={"100vh"}> {/* minHeight="calc(100vh - 10rem)" */}
                    <CodeblockMain />
                </Box>
            </MainContainer>
        </WrappedThemeProvider>
    </React.StrictMode>
);
