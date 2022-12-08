import { Add, Clear, PlayArrow, Refresh } from "@mui/icons-material";
import { Box, Button, Grid, IconButton, Paper, Slider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useState, useRef, useCallback, useEffect } from "react";
import { SingleTaskConf, IntervalTaskConf, tsProcessSchedulingEmuController, ProcessSchedulingTask } from "./scripts/tsProcessScheduling";

function AProcessSchedulingEmu({
    enable = false
}) {
    const [running, setRunning] = useState(false);

    const boxRef = useRef<HTMLDivElement>(null);
    const [text, setText] = useState('...');
    const [lines, setLines] = useState<string[]>([]);

    const [initialTaskListInput, setInitialTaskListInput] = useState<SingleTaskConf[]>([]);
    const [intervalTaskListInput, setIntervalTaskListInput] = useState<IntervalTaskConf[]>([]);
    /** 系统时钟 1ms 对应的模拟等待时长 */
    const [speed, setSpeed] = useState(200);
    /** 模拟时钟上限 */
    const [emuUntil, setEmuUntil] = useState(200);

    /** 表格数据 */
    const [finishedTasks, setFinishedTasks] = useState<ProcessSchedulingTask[]>([]);
    const [tasksInQueue, setTasksInQueue] = useState<ProcessSchedulingTask[]>([]);
    const [activeTask, setActiveTask] = useState<ProcessSchedulingTask | null>(null);

    const addInitialTask = useCallback(() => {
        let newTask: SingleTaskConf = {
            deadlineFromCreated: Math.floor(10 + Math.random() * 10),
            timeNeeded: Math.floor(5 + Math.random() * 5)
        };
        setInitialTaskListInput((prev) => [...prev, newTask]);
    }, []);

    const removeInitialTask = useCallback((index: number) => {
        setInitialTaskListInput((prev) => {
            prev.splice(index, 1);
            return [...prev];
        });
    }, []);

    const updateInitialTask = useCallback((index: number, conf: Partial<SingleTaskConf>) => {
        setInitialTaskListInput((prev) => {
            let returnResult = [...prev];
            returnResult[index] = {
                ...returnResult[index],
                ...conf
            };
            return returnResult;
        });
    }, []);

    const addIntervalTask = useCallback(() => {
        let newTask: IntervalTaskConf = {
            deadlineFromCreated: Math.floor(10 + Math.random() * 10),
            timeNeeded: Math.floor(2 + Math.random() * 5),
            interval: Math.floor(Math.random() * 5 + 1) * 10
        };
        setIntervalTaskListInput((prev) => [...prev, newTask]);
    }, []);

    const removeIntervalTask = useCallback((index: number) => {
        setIntervalTaskListInput((prev) => {
            prev.splice(index, 1);
            return [...prev];
        });
    }, []);

    const updateIntervalTask = useCallback((index: number, conf: Partial<IntervalTaskConf>) => {
        setIntervalTaskListInput((prev) => {
            let returnResult = [...prev];
            returnResult[index] = {
                ...returnResult[index],
                ...conf
            };
            return returnResult;
        });
    }, []);


    /**
     * 接管控制台输出
     */
    const handleChange = useCallback((str: string) => {
        console.log(['New Line: ' + str])
        setLines((prev) => [...prev, str]);
        if (boxRef?.current) {
            setTimeout(() => {
                boxRef.current?.scrollTo(0, boxRef.current?.scrollHeight);
            }, 0);
        }
    }, [boxRef]);

    const rerenderHandler = useCallback(() => {
        // todo..
        let status = tsProcessSchedulingEmuController.getCurrentState();
        setTasksInQueue(status.taskQueue);
        setFinishedTasks(status.finishedTasks);
        setActiveTask(status.currentRunningTask);
    }, []);

    const run = useCallback(() => {
        setLines(['准备开始。\n']);
        setTasksInQueue([]);
        setFinishedTasks([]);
        setActiveTask(null);

        window.__CONSOLE_INPUT__.anchorEl = boxRef.current;
        window.__CONSOLE_HANDLER__.registerCallbackFunction(handleChange);
        tsProcessSchedulingEmuController.registerRerenderHandler(rerenderHandler);
        tsProcessSchedulingEmuController.start({
            initialTasks: initialTaskListInput,
            intervalTasks: intervalTaskListInput
        }, speed, emuUntil);

    }, [boxRef, handleChange, initialTaskListInput, intervalTaskListInput, speed, emuUntil]);

    const stop = useCallback(() => {
        window.__CONSOLE_HANDLER__.unregisterCallbackFunction();

        // TODO:
        tsProcessSchedulingEmuController.stop();
    }, []);

    const toggle = useCallback(() => {
        if (running) {
            setRunning(false);
            stop();
        } else {
            setRunning(true);
            run();
        }
    }, [stop, run, running]);

    useEffect(() => {
        if (!enable) {
            stop();
        }
    }, [enable]);

    useEffect(() => {
        if (lines.length) {
            setText(lines.join('\n'));
        } else {
            setText('未运行...')
        }
    }, [lines]);


    return <Box>

        <Grid container spacing={2}>
            <Grid item xs={12} mb={4}>
                {/* 设置 */}
                {!running && <Grid container spacing={2}>
                    <Grid item xs={12} sm={8}>
                        <Typography variant="body1" fontWeight="bolder" pb={2}>周期性任务队列</Typography>
                        <Stack spacing={2} mb={4}>
                            {/* 录入 Jobs */}
                            {(
                                intervalTaskListInput.map((v, i) => (
                                    <Box
                                        key={i}
                                        display="flex" justifyContent="left" alignItems="center">
                                        <TextField sx={{ mr: 2 }}
                                            size="small"
                                            type="number"
                                            autoComplete='off'
                                            label={`周期`}
                                            value={v.interval}
                                            onChange={(e) => updateIntervalTask(i, { interval: +e.target.value })}
                                        />
                                        <TextField sx={{ mr: 2 }}
                                            size="small"
                                            type="number"
                                            autoComplete='off'
                                            label={`需要的运行时间`}
                                            value={v.timeNeeded}
                                            onChange={(e) => updateIntervalTask(i, { timeNeeded: +e.target.value })}
                                        />
                                        <TextField sx={{ mr: 2 }}
                                            size="small"
                                            type="number"
                                            autoComplete='off'
                                            label={`时限`}
                                            value={v.deadlineFromCreated}
                                            onChange={(e) => updateIntervalTask(i, { deadlineFromCreated: +e.target.value })}
                                        />
                                        <IconButton onClick={removeIntervalTask.bind(null, i)}>
                                            <Clear />
                                        </IconButton>
                                    </Box>
                                ))
                            )}
                            <Box>
                                <Button variant="outlined" size="small" color="secondary" startIcon={<Add />} onClick={addIntervalTask} children="添加周期性任务" />
                            </Box>
                        </Stack>

                        <Typography variant="body1" fontWeight="bolder" pb={2}>初始任务队列</Typography>
                        <Stack spacing={2}>
                            {/* 录入 Jobs */}
                            {(
                                initialTaskListInput.map((v, i) => (
                                    <Box
                                        key={i}
                                        display="flex" justifyContent="left" alignItems="center">
                                        <TextField sx={{ mr: 2 }}
                                            size="small"
                                            type="number"
                                            autoComplete='off'
                                            label={`任务 #${i} 需要的运行时间`}
                                            value={v.timeNeeded}
                                            onChange={(e) => updateInitialTask(i, { timeNeeded: +e.target.value })}
                                        />
                                        <TextField sx={{ mr: 2 }}
                                            size="small"
                                            type="number"
                                            autoComplete='off'
                                            label={`时限`}
                                            value={v.deadlineFromCreated}
                                            onChange={(e) => updateInitialTask(i, { deadlineFromCreated: +e.target.value })}
                                        />
                                        <IconButton onClick={removeInitialTask.bind(null, i)}>
                                            <Clear />
                                        </IconButton>
                                    </Box>
                                ))
                            )}
                            <Box>
                                <Button variant="outlined" size="small" color="secondary" startIcon={<Add />} onClick={addInitialTask} children="添加任务" />
                            </Box>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Box mb={2}>
                            <Typography>
                                模拟速度 ({speed} ms = 模拟时钟的 1 ms)
                            </Typography>
                            <Slider
                                // defaultValue={1000}
                                step={25}
                                min={50}
                                max={1000}
                                valueLabelDisplay="auto"
                                value={speed}
                                onChange={(e, v) => {
                                    setSpeed(v as number);
                                }}
                            />
                        </Box>
                        <Box mb={2}>
                            <Typography>
                                模拟时钟长度 (0 ~ {emuUntil}ms)
                            </Typography>
                            <Slider
                                // defaultValue={1000}
                                step={5}
                                min={10}
                                max={500}
                                valueLabelDisplay="auto"
                                value={emuUntil}
                                onChange={(e, v) => {
                                    setEmuUntil(v as number);
                                }}
                            />
                        </Box>
                        <Box mb={2}>
                            <Button variant='outlined' onClick={toggle} children={running ? '重置模拟' : '开始模拟'}
                                color={running ? 'error' : 'primary'}
                                startIcon={running ? <Refresh /> : <PlayArrow />}
                                disabled={intervalTaskListInput.length === 0 && initialTaskListInput.length === 0}
                            />
                        </Box>
                    </Grid>
                </Grid>}

                {/* 运行 */}
                {running && <Box>
                    <Box mb={2}>
                        <Button variant='outlined' onClick={toggle} children={running ? '重置模拟' : '开始模拟'}
                            color={running ? 'error' : 'primary'}
                            startIcon={running ? <Refresh /> : <PlayArrow />}
                        />
                    </Box>
                    <Typography variant="body1" fontWeight="bolder">已完成的任务</Typography>
                    <TableContainer sx={{ mb: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>任务编号</TableCell>
                                    <TableCell>进入队列的时间</TableCell>
                                    <TableCell>截止时间</TableCell>
                                    {/* <TableCell>已等待时长</TableCell>
                                    <TableCell>优先级</TableCell> */}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {finishedTasks.map((v, i) => (
                                    <TableRow key={i}>
                                        <TableCell>{v.pid}</TableCell>
                                        <TableCell>{v.issuedAt}</TableCell>
                                        <TableCell>{v.deadline}</TableCell>
                                        {/* <TableCell>{v.hasWaitedFor}</TableCell>
                                        <TableCell>{v.prior}</TableCell> */}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Typography variant="body1" fontWeight="bolder">当前任务队列</Typography>
                    <TableContainer sx={{ mb: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>任务编号</TableCell>
                                    <TableCell>进入队列的时间</TableCell>
                                    <TableCell>截止时间</TableCell>
                                    <TableCell>需要的执行时间</TableCell>
                                    <TableCell>松弛度</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tasksInQueue.map((v, i) => (
                                    <TableRow key={i}>
                                        <TableCell>{v.pid + `${v.pid === activeTask?.pid ? ' (运行中)' : ''}`}</TableCell>
                                        <TableCell>{v.issuedAt}</TableCell>
                                        <TableCell>{v.deadline}</TableCell>
                                        <TableCell>{v.timeNeeded}</TableCell>
                                        <TableCell>{v.getLax()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                </Box>
                }
            </Grid>

        </Grid>

        <Paper>
            <Box ref={boxRef} p={2} sx={{
                maxHeight: "10rem",
                overflowY: "auto"
            }}>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{text}</Typography>
            </Box>
        </Paper>
    </Box>
}

export default AProcessSchedulingEmu;