import { Box, Button, Container, Grid, Paper, Typography, TextField, Divider } from "@mui/material";
import { useState, useCallback, useEffect } from "react";
import TabbedPlaygroundTemplate from "../../components/TabbedPlaygroundTemplate";
import PlaceholderEmu from "../liveDemo/PlaceholderEmu";
import ProcessStatusChangeEmu from "../liveDemo/ProcessStatusChangeEmu";
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
                进程控制与状态切换
            </Typography>
            <Typography variant="body2" gutterBottom textAlign="center">
                这里模拟进程从创建开始的状态变化过程
            </Typography>

            <TabbedPlaygroundTemplate onTabChange={cleanUpFunction}
                tabs={2}
                tabNames={[
                    "可视化交互演示",
                    "C++ 实现 (WIP)",
                ]}
                tabNodes={[
                    <Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={8}>
                                <Typography gutterBottom variant="body1" sx={{ textIndent: "2rem" }}>
                                    这里是交互式演示。你可以从操作菜单中创建一个进程、并指定其接下来的行为。
                                </Typography>
                                <Typography gutterBottom variant="body1" sx={{ textIndent: "2rem" }}>
                                    你可以尝试让操作系统和进程分别做出不同的动作，观察进程的状态会如何变化。
                                </Typography>
                                <Typography gutterBottom variant="body1" sx={{ textIndent: "2rem" }}>
                                    (进入创建态的过程被暂时忽略)
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography color="primary" fontWeight="bolder"
                                    variant="body1"
                                >组员: 乔译</Typography>
                                <Typography color="primary" fontWeight="bolder"
                                    variant="body1"
                                    gutterBottom
                                    borderBottom={1}
                                    borderColor="divider"
                                >程序语言: TypeScript (React)</Typography>
                                <Typography color="primary" sx={{
                                    fontWeight: "bolder"
                                }}
                                    variant="body1"
                                    gutterBottom
                                >请在下方的交互菜单进行操作</Typography>

                            </Grid>

                            <Grid item xs={12}>
                                <ProcessStatusChangeEmu />
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