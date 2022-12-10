import { Box, Button, Container, Grid, Paper, Typography, TextField, Divider } from "@mui/material";
import { useState, useCallback, useEffect } from "react";
import { openCodeblockWindow } from "../../components/codeblockUtils";
import TabbedPlaygroundTemplate from "../../components/TabbedPlaygroundTemplate";
import LrxThreadsEmu from "../liveDemo/LrxThreadsEmu";
import PlaceholderEmu from "../liveDemo/PlaceholderEmu";
import { wasmModules } from "../wasmModules";

function PaperThreadMechanism() {

    const [enableA, setEnableA] = useState(false);
    const [enableB, setEnableB] = useState(false);
    const [enableC, setEnableC] = useState(false);
    const [enableD, setEnableD] = useState(false);
    const toggleA = useCallback(() => {
        setEnableA((v) => !v);
    }, []);
    const toggleB = useCallback(() => {
        setEnableB((v) => !v);
    }, []);


    const cleanUpFunction = useCallback(() => {
        // Note: 多线程或循环任务需要调用取消方法
        setEnableA(false);
        setEnableB(false);
        setEnableC(false);
        setEnableD(false);
    }, []);

    /** 清理函数自动调用 */
    useEffect(() => {
        if (!(enableA || enableB || enableC || enableD)) {
            cleanUpFunction();
        }
    }, [cleanUpFunction]);

    return <Paper>
        <Container maxWidth="lg" sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight="bolder" gutterBottom textAlign={"center"}
                borderBottom={1} borderColor="divider"
            >
                线程机制
            </Typography>
            <Typography variant="body2" gutterBottom textAlign="center">
                {/* 内核支持线程 KST (Kernel Supported Threads) 与用户级线程 ULT (User Level Threads) */}
                理解和认识操作系统线程的运作机制
            </Typography>

            <TabbedPlaygroundTemplate onTabChange={cleanUpFunction}
                // tabs={2}
                tabs={1}
                tabNames={[
                    "线程调度机制模拟",
                    // "TODO",
                ]}
                tabNodes={[
                    <Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={8}>
                                <Typography gutterBottom variant="body1" sx={{ textIndent: "2rem" }}>
                                    采用最高优先级算法进行线程的调度。
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography color="primary"
                                    fontWeight="bolder"
                                    variant="body1"
                                    gutterBottom
                                >组员: 刘瑞鑫</Typography>
                                <Typography color="primary"
                                    fontWeight="bolder"
                                    variant="body1"
                                    gutterBottom
                                    borderBottom={1}
                                    borderColor="divider"
                                >程序语言: TypeScript (React)</Typography>
                                <Box pb={1}>
                                    <Button variant="outlined"
                                        children={enableA ? '重置程序' : '启动程序'}
                                        onClick={toggleA}
                                    />
                                </Box>
                                <Button variant="text"
                                    color="info"
                                    children={'查看源代码'}
                                    onClick={openCodeblockWindow.bind(null, 'lrx-threads')}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <LrxThreadsEmu enable={enableA} />
                            </Grid>

                        </Grid>
                    </Box>,
                    // <Box>
                    //     <Grid container spacing={2}>
                    //         <Grid item xs={12} sm={8}>
                    //             <Typography gutterBottom variant="body1" sx={{ textIndent: "2rem" }}>
                    //                 TODO
                    //             </Typography>
                    //         </Grid>

                    //         <Grid item xs={12} sm={4}>
                    //             <Typography color="primary" sx={{
                    //                 fontWeight: "bolder"
                    //             }}
                    //                 variant="body1"
                    //                 gutterBottom
                    //                 borderBottom={1}
                    //                 borderColor="divider"
                    //             >程序语言: TypeScript (React)</Typography>
                    //             <Button variant="outlined"
                    //                 children={'WIP'}
                    //                 disabled
                    //             />
                    //         </Grid>

                    //         <Grid item xs={12}>
                    //             <PlaceholderEmu />
                    //         </Grid>

                    //     </Grid>
                    // </Box>,
                ]}
            />
        </Container>
    </Paper>


}

export default PaperThreadMechanism;