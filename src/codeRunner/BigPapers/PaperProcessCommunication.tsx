import { Box, Button, Container, Grid, Paper, Typography, TextField, Divider, Stack } from "@mui/material";
import { useState, useCallback, useEffect } from "react";
import { openCodeblockWindow } from "../../components/codeblockUtils";
import TabbedPlaygroundTemplate from "../../components/TabbedPlaygroundTemplate";
import LiuProcessCommunicationEmu from "../liveDemo/LiuProcessCommunicationEmu";
import WindowCommunicationEmu from "../liveDemo/WindowCommunicationEmu";
import { wasmModules } from "../wasmModules";

function PaperProcessCommunication() {

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
                进程通信
            </Typography>
            <Typography variant="body2" gutterBottom textAlign="center">
                进程之间信息交换的不同方式
            </Typography>

            <TabbedPlaygroundTemplate onTabChange={cleanUpFunction}
                tabs={3}
                tabNames={[
                    "共享存储器系统",
                    "消息缓冲队列 (直接消息传递)",
                    "信箱通信模拟 (间接消息传递)",
                ]}
                tabNodes={[
                    <Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={8}>
                                <Typography gutterBottom variant="body1" sx={{ textIndent: "2rem" }}>
                                    此程序对于所有的 C++ 模块 (编译为 WASM 执行) 的多线程执行，均用到了浏览器运行环境提供的 <strong>sharedArrayBuffer</strong> API。
                                </Typography>
                                <Typography gutterBottom variant="body1" sx={{ textIndent: "2rem" }}>
                                    此 API 允许申请可以在不同的 Web Workers 之间共享的 Buffer, 用于映射到 C++ 模块的内存地址。每个线程单独拥有一个 Web Worker。
                                </Typography>
                                <Typography gutterBottom variant="body1" sx={{ textIndent: "2rem" }}>
                                    虽说与进程<strong>之间</strong>通信有些区别，但这里面的相同点还是有的。不同的 Web Worker 通过共享 sharedArrayBuffer 来实现对多线程程序的支持、保证程序内的数据互通。
                                </Typography>
                                <Typography gutterBottom variant="body1" sx={{ textIndent: "2rem" }}>
                                    注: JavaScript 是单线程语言。借助 Web Worker 可以间接地实现一些多线程程序的样子。Web Worker 本身相当于是一个独立的进程——其<strong>宿主程序无法访问其内部的任何资源</strong>，从这个角度来说，它更接近一个<strong>进程</strong> (process) 而非 thread。
                                </Typography>
                                <Typography gutterBottom variant="body1" sx={{ textIndent: "2rem" }}>
                                    通过向浏览器申请共享存储 (sharedArrayBuffer)，它才可以实现和宿主页面或者其他 Web Workers 共用资源或实现高效的数据通信 (传递大量数据而不用创建副本)。此特性也可以基于其来创建<strong>通信管道</strong>来传输大量数据。
                                </Typography>
                                <Typography gutterBottom variant="body1" sx={{ textIndent: "2rem" }}>
                                    浏览器提供的还有另一种通信方式: postMessage, 这个更接近消息传递系统的信箱通信的模式，会需要创建数据的副本，可用于页面之间或是与 Web Workers、Service Worker 的通信。参见当前卡片的 信箱通信 演示。
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography color="primary" sx={{
                                    fontWeight: "bolder"
                                }}
                                    variant="body1"
                                    gutterBottom
                                >没有独立的模拟程序</Typography>
                            </Grid>

                        </Grid>
                    </Box>,
                    <Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={8}>
                                <Typography gutterBottom variant="body1" sx={{ textIndent: "2rem" }}>
                                    本程序实现了运用消息缓冲队列的直接消息传递系统。程序利用 send 原语将消息直接发送给接受进程，接收进程利用 receive 原语文接收消息。
                                </Typography>
                                <Typography gutterBottom variant="body1" sx={{ textIndent: "2rem" }}>
                                    虽说本质上是 C++ 的线程 (thread) 之间交换数据，但这里的线程没有访问临界资源的操作。我们将其视为对进程的模拟、并将主程序所提供的消息缓冲队列视为操作系统提供的消息传递方式。
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

                                <Box sx={{ pb: 2 }}>
                                    <Button variant="outlined"
                                        children={enableB ? '重置程序' : '启动程序'}
                                        onClick={toggleB}
                                    />
                                </Box>

                                <Button variant="text"
                                    color="info"
                                    children={'查看源代码'}
                                    onClick={openCodeblockWindow.bind(null, 'liu-process-communication')}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <LiuProcessCommunicationEmu enable={enableB} />
                            </Grid>

                        </Grid>
                    </Box>,
                    <Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={8}>
                                <Typography gutterBottom variant="body1" sx={{ textIndent: "2rem" }}>
                                    浏览器提供了 postMessage 方法来为 window 之间、window 与 worker 之间来通信。
                                </Typography>
                                <Typography gutterBottom variant="body1" sx={{ textIndent: "2rem" }}>
                                    这里，我们会唤出一个新的 window, 你可以在两个窗口之间让它们交换数据。当前窗口收到的数据会显示在下方输出。
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
                                <Typography color="primary" sx={{
                                    fontWeight: "bolder"
                                }}
                                    variant="body1"
                                    gutterBottom
                                >在下方菜单中，唤出子窗口</Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <WindowCommunicationEmu />
                            </Grid>

                        </Grid>
                    </Box>
                ]}
            />
        </Container>
    </Paper>


}

export default PaperProcessCommunication;