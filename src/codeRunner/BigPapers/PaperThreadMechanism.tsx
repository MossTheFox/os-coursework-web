import { Box, Button, Container, Grid, Paper, Typography, TextField, Divider } from "@mui/material";
import { useState, useCallback, useEffect } from "react";
import TabbedPlaygroundTemplate from "../../components/TabbedPlaygroundTemplate";
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
                线程机制 (WIP)
            </Typography>
            <Typography variant="body2" gutterBottom textAlign="center">
                内核支持线程 KST (Kernel Supported Threads) 与用户级线程 ULT (User Level Threads)
            </Typography>

            <TabbedPlaygroundTemplate onTabChange={cleanUpFunction}
                tabs={2}
                tabNames={[
                    "TODO",
                    "TODO",
                ]}
                tabNodes={[
                    <Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={8}>
                                <Typography gutterBottom variant="body1" sx={{ textIndent: "2rem" }}>
                                    TODO
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography color="primary" sx={{
                                    fontWeight: "bolder"
                                }}
                                    variant="body1"
                                    gutterBottom
                                    borderBottom={1}
                                    borderColor="divider"
                                >程序语言: TypeScript (React)</Typography>
                                <Button variant="outlined"
                                    children={'WIP'}
                                    disabled
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <PlaceholderEmu />
                            </Grid>

                        </Grid>
                    </Box>,
                    <Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={8}>
                                <Typography gutterBottom variant="body1" sx={{ textIndent: "2rem" }}>
                                    TODO
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <Typography color="primary" sx={{
                                    fontWeight: "bolder"
                                }}
                                    variant="body1"
                                    gutterBottom
                                    borderBottom={1}
                                    borderColor="divider"
                                >程序语言: TypeScript (React)</Typography>
                                <Button variant="outlined"
                                    children={'WIP'}
                                    disabled
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <PlaceholderEmu />
                            </Grid>

                        </Grid>
                    </Box>,
                ]}
            />
        </Container>
    </Paper>


}

export default PaperThreadMechanism;