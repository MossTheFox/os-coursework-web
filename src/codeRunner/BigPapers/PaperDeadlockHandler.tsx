import { Box, Button, Container, Grid, Paper, Typography, TextField, Divider } from "@mui/material";
import { useState, useCallback, useEffect } from "react";
import { openCodeblockWindow } from "../../components/codeblockUtils";
import TabbedPlaygroundTemplate from "../../components/TabbedPlaygroundTemplate";
import ChenBanlerEmu from "../liveDemo/ChenBanlerEmu";
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
                死锁处理
            </Typography>
            <Typography variant="body2" gutterBottom textAlign="center">
                以银行家算法为典型的避免死锁的算法
            </Typography>

            <TabbedPlaygroundTemplate onTabChange={cleanUpFunction}
                // tabs={2}
                tabs={1}
                tabNames={[
                    "银行家算法示例",
                    // "银行家算法 (2)",
                ]}
                tabNodes={[
                    <Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={8}>
                                <Typography gutterBottom variant="body1" sx={{ textIndent: "2rem" }}>
                                    此程序按照教材的 122 ~ 123 页，完成了银行家算法的程序实现。
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography color="primary"
                                    fontWeight="bolder"
                                    variant="body1"
                                    gutterBottom
                                >组员: 陈锦天</Typography>
                                <Typography color="primary"
                                    fontWeight="bolder"
                                    variant="body1"
                                    gutterBottom
                                    borderBottom={1}
                                    borderColor="divider"
                                >程序语言: C++</Typography>
                                <Box pb={1}>
                                    <Button variant="outlined"
                                        children={enableA ? '重置程序' : '启动程序'}
                                        onClick={toggleA}
                                    />
                                </Box>
                                <Button variant="text"
                                    color="info"
                                    children={'查看源代码'}
                                    onClick={openCodeblockWindow.bind(null, 'chen-banker')}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <ChenBanlerEmu enable={enableA} />
                            </Grid>

                        </Grid>
                    </Box>,
                    // <Box>
                    //     <Grid container spacing={2}>
                    //         <Grid item xs={12} sm={8}>
                    //             <Typography gutterBottom variant="body1" sx={{ textIndent: "2rem" }}>
                    //                 银行家算法……
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

export default PaperDeadlockHandler;