import { Box, Button, Container, Grid, Paper, Typography, Stack, Divider } from "@mui/material";
import { useState, useCallback } from "react";
import PaperDeadlockHandler from "./codeRunner/BigPapers/PaperDeadlockHandler";
import PaperDebug from "./codeRunner/BigPapers/PaperDebug";
import PaperProcessCommunication from "./codeRunner/BigPapers/PaperProcessCommunication";
import PaperProcessControlAndStateChange from "./codeRunner/BigPapers/PaperProcessControlAndStateChange";
import PaperProcessMutAndSync from "./codeRunner/BigPapers/PaperProcessMutAndSync";
import PaperProcessScheduling from "./codeRunner/BigPapers/PaperProcessScheduling";
import InputPopover from "./codeRunner/InputPopover";
import CodeBlock from "./codeRunner/monacoBlocks/CodeBlock";

function MainApp() {

    const [enable, setEnable] = useState(false);
    const toggle = useCallback(() => {
        setEnable((v) => !v);
    }, []);

    return <Container sx={{ py: 2 }}>
        <Typography variant="h4" textAlign={"center"} sx={{ fontWeight: "bolder" }} gutterBottom>
            OS Coursework | Playground
        </Typography>


        <Stack gap={4}>

            <InputPopover />

            {/* TODO: Global Reset All Function (避免控制台输出接管冲突), 用 Context 做 */}

            {/* DEBUG ONLY */}
            {/* <PaperDebug /> */}

            {/* 1. 进程控制与状态切换 */}
            <PaperProcessControlAndStateChange />

            {/* 2. 进程调度 (EDF, LLF) */}
            <PaperProcessScheduling />

            {/* 3. 互斥、进程同步 */}
            <PaperProcessMutAndSync />

            {/* 4. 进程通信 */}
            <PaperProcessCommunication />

            {/* 5. 死锁避免 */}
            <PaperDeadlockHandler />

            {/* 6. 内存分配 */}


            {/* 7. 外存访问 */}


            {/* 8. 线程机制 */}
            

        </Stack>

    </Container>
}

export default MainApp;