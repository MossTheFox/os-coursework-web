import { Box, Button, Container, Grid, Paper, Typography, TextField, Divider } from "@mui/material";
import { useState, useCallback, useEffect } from "react";
import TabbedPlaygroundTemplate from "../../components/TabbedPlaygroundTemplate";
import TSPhiChopsticksEmu from "../liveDemo/TSPhiChopsticksEmu";
import TSProducerConsumerEmu from "../liveDemo/TSProducerConsumerEmu";
import { HourglassEmpty, Psychology, SetMeal } from "@mui/icons-material";
import { openCodeblockWindow } from "../../components/codeblockUtils";


function PaperProcessMutAndSync() {

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
                互斥与进程同步
            </Typography>
            <Typography variant="body2" gutterBottom textAlign="center">
                采用信号量与管程来解决多道程序的资源共享问题
            </Typography>

            <TabbedPlaygroundTemplate onTabChange={cleanUpFunction}
                tabs={2}
                tabNames={[
                    "生产者、消费者问题 (信号量)",
                    "哲学家进餐 (管程)",
                ]}
                tabNodes={[
                    <Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={8}>
                                <Typography gutterBottom variant="body1" sx={{ textIndent: "2rem" }}>
                                    生产者、消费者问题是很经典的进程同步问题，生产者、消费者会分别共享一个 Buffer (临界资源)。
                                </Typography>
                                <Typography gutterBottom variant="body1" sx={{ textIndent: "2rem" }}>
                                    程序运行过程中，如果生产者的生产速度与消费者的消费速度不匹配，你就会观察到信号量起到的作用：互斥信号量保证了生产者只在 Buffer 不满的情况下工作、消费者只在 Buffer 非空的情况下工作。
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography color="primary"
                                    fontWeight="bolder"
                                    variant="body1"
                                    gutterBottom
                                >组员: 乔译</Typography>
                                <Typography color="primary"
                                    fontWeight="bolder"
                                    variant="body1"
                                    gutterBottom
                                    borderBottom={1}
                                    borderColor="divider"
                                >程序语言: TypeScript</Typography>
                                <Box pb={1}>
                                    <Button variant="outlined"
                                        children={enableA ? '重置程序' : '启动程序'}
                                        onClick={toggleA}
                                    />
                                </Box>
                                <Button variant="text"
                                    color="info"
                                    children={'查看源代码'}
                                    onClick={openCodeblockWindow.bind(null, 'joe-producer-consumer')}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TSProducerConsumerEmu enable={enableA} />
                            </Grid>

                        </Grid>
                    </Box>,
                    <Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={8}>
                                <Typography gutterBottom variant="body1" sx={{ textIndent: "2rem" }}>
                                    哲学家进餐问题中，若将每个哲学家视为一个进程，就可以引入管程 (Monitor) 的思想。
                                </Typography>
                                <Typography gutterBottom variant="body1" sx={{ textIndent: "2rem" }}>
                                    管程会负责控制进程和操作数据。进程尝试申请临界资源时，管程会根据情况来决定进程会直接得到资源还是进入阻塞状态。当陷入阻塞状态的进程所申请的资源可用，进入阻塞状态的进程会被管程唤醒。
                                </Typography>
                                <Typography gutterBottom variant="body1" sx={{ textIndent: "2rem" }}>
                                    引入管程的程序有一个特点：对信号量的等待不再会需要有用于轮询的 while 死循环，而是类似于事件触发型 (当有临界资源被申请和释放时才会占用 CPU 资源)。
                                </Typography>
                                <Typography gutterBottom variant="body1" sx={{ textIndent: "2rem" }}>
                                    哲学家的状态：饥饿 (<HourglassEmpty fontSize="inherit" />)、正在用餐 (<SetMeal fontSize="inherit" />)、正在思考 (<Psychology fontSize="inherit" />)。
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <Typography color="primary"
                                    fontWeight="bolder"
                                    variant="body1"
                                    gutterBottom
                                >组员: 乔译</Typography>
                                <Typography color="primary"
                                    fontWeight="bolder"
                                    variant="body1"
                                    gutterBottom
                                    borderBottom={1}
                                    borderColor="divider"
                                >程序语言: TypeScript (React)</Typography>
                                <Box pb={1}>
                                    <Button variant="outlined"
                                        children={enableB ? '重置程序' : '启动程序'}
                                        onClick={toggleB}
                                    />
                                </Box>
                                <Button variant="text"
                                    color="info"
                                    children={'查看源代码'}
                                    onClick={openCodeblockWindow.bind(null, 'joe-philosopher')}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TSPhiChopsticksEmu enable={enableB} />
                            </Grid>

                        </Grid>
                    </Box>,
                ]}
            />
        </Container>
    </Paper>


}

export default PaperProcessMutAndSync;