import { Box, Button, Container, Grid, Paper, Typography, TextField, Divider } from "@mui/material";
import { useState, useCallback, useEffect } from "react";
import TabbedPlaygroundTemplate from "../../components/TabbedPlaygroundTemplate";
import AJobSchedulingEmu from "../liveDemo/AJobSchedulingEmu";
import AProcessSchedulingEmu from "../liveDemo/AProcessSchedulingEmu";
import BProcessSchedulingEmu from "../liveDemo/BProcessSchedulingEmu";
import PlaceholderEmu from "../liveDemo/PlaceholderEmu";
import { wasmModules } from "../wasmModules";

function PaperProcessScheduling() {

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
                进程控制与状态切换
            </Typography>
            <Typography variant="body2" gutterBottom textAlign="center">
                这里模拟进程从创建开始的状态变化过程
            </Typography>

            <TabbedPlaygroundTemplate onTabChange={cleanUpFunction}
                tabs={4}
                tabNames={[
                    "作业调度",
                    "LLF (交互式)",
                    "EDF",
                    "LLF",
                ]}
                tabNodes={[
                    <Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={8}>
                                <Typography gutterBottom variant="body1" sx={{ textIndent: "2rem" }}>
                                    为了在内存中创建出进程，会需要磁盘中先取出作业 (Jobs)。将这些作业以什么样的顺序和方式装入内存，是作业调度的工作。
                                </Typography>
                                <Typography gutterBottom variant="body1" sx={{ textIndent: "2rem" }}>
                                    这里，我们采用 高响应比优先调度算法 (Highest Response Ratio Next, HRRN) 来进行作业调度的模拟。
                                </Typography>
                                <Typography gutterBottom variant="body1" sx={{ textIndent: "2rem" }}>
                                    在下方菜单中创建一系列作业。然后，观察调度算法是如何选择作业进行调度的。
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography color="primary" sx={{
                                    fontWeight: "bolder"
                                }}
                                    variant="body1"
                                >组员: 乔译</Typography>
                                <Typography color="primary" sx={{
                                    fontWeight: "bolder"
                                }}
                                    variant="body1"
                                    gutterBottom
                                    borderBottom={1}
                                    borderColor="divider"
                                >程序语言: TypeScript (React)</Typography>
                                {/* <Button variant="outlined"
                                    children={'WIP'}
                                    disabled
                                /> */}
                                <Typography variant="body2">
                                    请在下方菜单进行操作。
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <AJobSchedulingEmu enable={enableA} />
                            </Grid>

                        </Grid>
                    </Box>,
                    <Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={8}>
                                <Typography gutterBottom variant="body1" sx={{ textIndent: "2rem" }}>
                                    作业调度是选择作业装入内存成为进程, 而进程调度则是选择哪些内存中的进程进行执行。从内存中选择进程交给处理机去执行，就是进程调度的任务。
                                </Typography>
                                <Typography gutterBottom variant="body1" sx={{ textIndent: "2rem" }}>
                                    这里采用用 最低松弛度 (LLF, Least Laxity First) 算法 来决定进程的执行顺序。此算法属于实时调度算法，旨在根据任务的紧急程度来决定执行。
                                </Typography>
                                <Typography gutterBottom variant="body1" sx={{ textIndent: "2rem" }}>
                                    留意: 对于判定调度的时机，有两种方式:
                                </Typography>
                                <ul>
                                    <li>有新的进程进入队列;</li>
                                    <li>有进程的松弛度变为 0 了。</li>
                                </ul>
                                <Typography gutterBottom variant="body1" sx={{ textIndent: "2rem" }}>
                                    此模拟根据教材的实现方式来实现，采用的是后者 (有进程松弛度变为 0 时触发调度)。
                                </Typography>
                                <Typography gutterBottom variant="body1" sx={{ textIndent: "2rem" }}>
                                    你可以指定任务队列的初始任务列表和一些周期性任务，观察调度算法如何进行。请留意，如果有进程的松弛度变为了负数，模拟会自动以失败停止。
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography color="primary" sx={{
                                    fontWeight: "bolder"
                                }}
                                    variant="body1"
                                >组员: 乔译</Typography>
                                <Typography color="primary" sx={{
                                    fontWeight: "bolder"
                                }}
                                    variant="body1"
                                    gutterBottom
                                    borderBottom={1}
                                    borderColor="divider"
                                >程序语言: TypeScript (React)</Typography>
                                <Typography variant="body2">
                                    请在下方菜单进行操作。
                                </Typography>

                            </Grid>

                            <Grid item xs={12}>
                                <AProcessSchedulingEmu enable={enableB} />
                            </Grid>

                        </Grid>
                    </Box>,
                    <Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={8}>
                                <Typography gutterBottom variant="body1" sx={{ textIndent: "2rem" }}>
                                    EDF (Earliest Deadline First) 算法，即最早截止时间算法，会根据任务队列中截止时间的信息来分配处理机。
                                </Typography>
                                <Typography gutterBottom variant="body1" sx={{ textIndent: "2rem" }}>
                                    截止时间越早，越会排在队列首部。
                                </Typography>
                                <Typography gutterBottom variant="body1" sx={{ textIndent: "2rem" }}>
                                    有新的任务加入时，会重新计算最早截至的任务、并决定是否要调整当前的处理机分配。
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography color="primary" sx={{
                                    fontWeight: "bolder"
                                }}
                                    variant="body1"
                                >组员: 刘智文</Typography>
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
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <BProcessSchedulingEmu enable={enableC} select="A" />
                            </Grid>

                        </Grid>
                    </Box>,
                    <Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={8}>
                                <Typography gutterBottom variant="body1" sx={{ textIndent: "2rem" }}>
                                    LLF (Least Laxity First) 算法，即最低松弛度优先算法，会根据任务队列中每个任务的松弛度来分配处理机。
                                </Typography>
                                <Typography gutterBottom variant="body1" sx={{ textIndent: "2rem" }}>
                                    一个进程松弛度 = 其必须完成时间 - 运行需要的时间 - 当前时间。
                                </Typography>
                                <Typography gutterBottom variant="body1" sx={{ textIndent: "2rem" }}>
                                    有进程松弛度变为 0 时，将触发调度。
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography color="primary" sx={{
                                    fontWeight: "bolder"
                                }}
                                    variant="body1"
                                >组员: 刘智文</Typography>
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
                                <BProcessSchedulingEmu enable={enableD} select="B" />
                            </Grid>

                        </Grid>
                    </Box>

                ]}
            />
        </Container>
    </Paper>


}

export default PaperProcessScheduling;