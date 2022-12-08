import { Box, Button, Container, Grid, Paper, Typography, TextField, Divider } from "@mui/material";
import { useState, useCallback, useEffect } from "react";
import TabbedPlaygroundTemplate from "../../components/TabbedPlaygroundTemplate";
import PlaceholderEmu from "../liveDemo/PlaceholderEmu";
import { wasmModules } from "../wasmModules";

function PaperProcessControlAndStateChange() {

    const [enableA, setEnableA] = useState(false);
    const [enableB, setEnableB] = useState(false);
    const [enableC, setEnableC] = useState(false);
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
    }, []);

    /** 清理函数自动调用 */
    useEffect(() => {
        if (!(enableA || enableB || enableC)) {
            cleanUpFunction();
        }
    }, [cleanUpFunction]);

    return <Paper>
        <Container maxWidth="lg" sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight="bolder" gutterBottom textAlign={"center"}
                borderBottom={1} borderColor="divider"
            >
                进程调度 (WIP)
            </Typography>
            <Typography variant="body2" gutterBottom textAlign="center">
                采用经典的实时调度算法来模拟进程的调度
            </Typography>

            <TabbedPlaygroundTemplate onTabChange={cleanUpFunction}
                tabs={2}
                tabNames={[
                    "可视化交互演示",
                    "C++ 实现",
                ]}
                tabNodes={[
                    <Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={8}>
                                <Typography gutterBottom variant="body1" sx={{ textIndent: "2rem" }}>
                                    这里是交互式演示。你可以从操作菜单中创建一个进程、并指定其接下来的行为。
                                </Typography>
                                <Typography gutterBottom variant="body1" sx={{ textIndent: "2rem" }}>
                                    你可以尝试在其执行过程中申请临界资源，观察进程状态的变化方式。
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
                                    此程序采用 C++ 完成进程状态的模拟。
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

export default PaperProcessControlAndStateChange;