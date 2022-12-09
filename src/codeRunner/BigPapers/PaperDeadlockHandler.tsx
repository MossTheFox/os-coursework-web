import { Box, Button, Container, Grid, Paper, Typography, TextField, Divider } from "@mui/material";
import { useState, useCallback, useEffect } from "react";
import TabbedPlaygroundTemplate from "../../components/TabbedPlaygroundTemplate";
import PlaceholderEmu from "../liveDemo/PlaceholderEmu";
import { wasmModules } from "../wasmModules";

function PaperDeadlockHandler() {

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
        wasmModules.debugModule?.stop();
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
                死锁处理 (WIP)
            </Typography>
            <Typography variant="body2" gutterBottom textAlign="center">
                以银行家算法为典型的避免死锁的算法
            </Typography>

            <TabbedPlaygroundTemplate onTabChange={cleanUpFunction}
                tabs={2}
                tabNames={[
                    "银行家算法示例",
                    "银行家算法 (2)",
                ]}
                tabNodes={[
                    <Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={8}>
                                <Typography gutterBottom variant="body1" sx={{ textIndent: "2rem" }}>
                                    银行家算法……
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
                                    银行家算法……
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

export default PaperDeadlockHandler;