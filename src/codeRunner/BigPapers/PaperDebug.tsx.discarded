import { Box, Button, Container, Grid, Paper, Typography, TextField, Divider } from "@mui/material";
import { useState, useCallback, useEffect } from "react";
import TabbedPlaygroundTemplate from "../../components/TabbedPlaygroundTemplate";
import DebugEmu from "../liveDemo/DebugEmu";
import { wasmModules } from "../wasmModules";

function PaperDebug() {

    const [enableA, setEnableA] = useState(false);
    const [enableB, setEnableB] = useState(false);
    const [enableC, setEnableC] = useState(false);
    const [cParam, setcParam] = useState("");
    const [enableD, setEnableD] = useState(false);
    const toggleA = useCallback(() => {
        setEnableA((v) => !v);
    }, []);
    const toggleB = useCallback(() => {
        setEnableB((v) => !v);
    }, []);
    const toggleC = useCallback(() => {
        setEnableC((v) => !v);
    }, []);
    const toggleD = useCallback(() => {
        setEnableD((v) => !v);
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
                程序模块测试
            </Typography>
            <Typography variant="body2" gutterBottom textAlign="center">
                这里提供由 C++ 程序编译来的程序模块的交互测试
            </Typography>

            <TabbedPlaygroundTemplate onTabChange={cleanUpFunction}
                tabs={4}
                tabNames={[
                    "纯粹的输出",
                    "永远不会停止的程序",
                    "传参运行函数",
                    "请求用户输入"
                ]}
                tabNodes={[
                    <Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={8}>
                                <Typography variant="body1">
                                    这是最普通的程序测试。
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
                                >程序语言: C++</Typography>
                                <Button variant="outlined"
                                    children={enableA ? '重置程序' : '启动程序'}
                                    onClick={toggleA}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <DebugEmu enable={enableA} select='A' />
                            </Grid>

                        </Grid>
                    </Box>,
                    <Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={8}>
                                <Typography variant="body1">
                                    这里测试程序的异步输出和强行终止。
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
                                >程序语言: C++</Typography>
                                <Button variant="outlined"
                                    children={enableB ? '重置程序' : '启动程序'}
                                    onClick={toggleB}
                                />

                            </Grid>

                            <Grid item xs={12}>
                                <DebugEmu enable={enableB} select='B' />
                            </Grid>

                        </Grid>
                    </Box>,
                    <Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={8}>
                                <Typography variant="body1">
                                    这里测试程传入参数运行的函数。
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
                                >程序语言: C++</Typography>
                                <Button variant="outlined"
                                    children={enableC ? '重置程序' : '启动程序'}
                                    onClick={toggleC}
                                    sx={{ mb: 2 }}
                                />
                                <Typography color="primary" sx={{
                                    fontWeight: "bolder"
                                }}
                                    variant="body1"
                                    gutterBottom
                                    borderBottom={1}
                                    borderColor="divider"
                                >参数: </Typography>
                                <TextField value={cParam} onChange={(e) => setcParam(e.target.value)}
                                    label="str" />

                            </Grid>

                            <Grid item xs={12}>
                                <DebugEmu enable={enableC} select='C' param={cParam} />
                            </Grid>

                        </Grid>
                    </Box>,
                    <Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={8}>
                                <Typography variant="body1">
                                    这里测试中间过程请求用户输入的程序。
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
                                >程序语言: C++</Typography>
                                <Button variant="outlined"
                                    children={enableD ? '重置程序' : '启动程序'}
                                    onClick={toggleD}
                                />

                            </Grid>

                            <Grid item xs={12}>
                                <DebugEmu enable={enableD} select='D' />
                            </Grid>

                        </Grid>
                    </Box>
                ]}
            />

        </Container>
    </Paper>


}

export default PaperDebug;