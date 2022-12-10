import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { Box, Paper, Typography, Stack, Button, IconButton, TextField, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Grid, Slider } from '@mui/material';
import { JobSchedulingEmuJob, tsJobSchedulingEmuController } from './scripts/tsJobScheduling';
import { Add, Clear, PlayArrow, Refresh } from '@mui/icons-material';

type TableColumnData = {
    id: number;
    originalReq: number;
    req: number | string;
    hasWaitedFor: number | string;
    prior: number | string;
};

function AJobSchedulingEmu({
    enable = false,
    // onFinished = null
}: {
    enable: boolean,
    onFinished?: () => any,
}) {

    const [running, setRunning] = useState(false);

    const boxRef = useRef<HTMLDivElement>(null);
    const [text, setText] = useState('...');
    const [lines, setLines] = useState<string[]>([]);

    const [jobListInput, setJobListInput] = useState<number[]>([]);
    const [jobList, setJobList] = useState<JobSchedulingEmuJob[]>([]);
    const [activeIndex, setActiveIndex] = useState(-1);
    // slider
    const [speed, setSpeed] = useState(1000);

    const addJob = useCallback(() => {
        let newValue = Math.floor(Math.random() * 10 + 1);
        setJobListInput((prev) => [...prev, newValue]);
    }, []);

    const removeJob = useCallback((index: number) => {
        setJobListInput((prev) => {
            prev.splice(index, 1);
            return [...prev];
        });
    }, []);

    const updateJob = useCallback((index: number, newValue: number) => {
        if (newValue <= 0) newValue = 1;
        newValue = Math.floor(newValue);
        setJobListInput((prev) => {
            prev[index] = newValue;
            return [...prev];
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

    /**
     * 接管可视化界面 rerender
     */
    const handleRerender = useCallback(() => {
        const currentState = tsJobSchedulingEmuController.getCurrentStatus();
        setJobList([...currentState.jobList]);
        if (currentState.active) {
            setActiveIndex(currentState.active.id);
        } else {
            setActiveIndex(-1);
        }
    }, []);

    useEffect(() => {
        if (lines.length) {
            setText(lines.join('\n'));
        } else {
            setText('未运行...')
        }
    }, [lines]);

    const run = useCallback(() => {
        setLines(['准备开始调度。\n']);
        // window anchorEl
        window.__CONSOLE_INPUT__.anchorEl = boxRef.current;
        window.__CONSOLE_HANDLER__.registerCallbackFunction(handleChange);

        // RUN...
        tsJobSchedulingEmuController.registerOnChangeHook(handleRerender);
        // 初始化 JobList 的对象
        setJobList([...tsJobSchedulingEmuController.start(jobListInput, speed)]);
        setActiveIndex(-1);

    }, [jobListInput, speed]);

    const stop = useCallback(() => {
        window.__CONSOLE_HANDLER__.unregisterCallbackFunction();
        tsJobSchedulingEmuController.stop();
        setLines([]);
    }, []);

    const toggle = useCallback(() => {
        if (running) {
            stop();
            setRunning(false);
        } else {
            run();
            setRunning(true);
        }
    }, [running, run, stop]);

    // clean up 
    useEffect(() => {
        if (!enable) {
            stop();
        }
    }, [enable]);

    // table extra 
    const [tableRow, setTableRow] = useState<TableColumnData[]>([]);
    useEffect(() => {
        const rowArr: TableColumnData[] = [];
        jobListInput.forEach((v, i) => {
            let matchJob = jobList.find((v) => v.id === i);
            if (matchJob) {
                rowArr.push({
                    id: i,
                    originalReq: v,
                    hasWaitedFor: matchJob.hasWaitedFor,
                    req: matchJob.requestedTime,
                    prior: matchJob.getPrior().toFixed(2)
                });
            } else {
                rowArr.push({
                    id: i,
                    originalReq: v,
                    hasWaitedFor: '[已完成]',
                    req: '[已完成]',
                    prior: '[已完成]'
                });
            }
        });
        setTableRow(rowArr);
    }, [jobListInput, jobList]);


    return <Box>
        <Grid container spacing={2} mb={4}>
            <Grid item xs={12}>
                {/* 设置 */}
                {!running && <Grid container spacing={2}>
                    <Grid item xs={12} sm={8}>
                        <Typography variant="body1" fontWeight="bolder" pb={2}>作业列表</Typography>
                        <Stack spacing={2}>
                            {/* 录入 Jobs */}
                            {(
                                jobListInput.map((v, i) => (
                                    <Box
                                        key={i}
                                        display="flex" justifyContent="left" alignItems="center">
                                        <TextField sx={{ mr: 2 }}
                                            size="small"
                                            type="number"
                                            autoComplete='off'
                                            label={`作业 #${i} 的要求服务时间`}
                                            value={jobListInput[i]}
                                            onChange={(e) => updateJob(i, +e.target.value)}
                                        />
                                        <IconButton onClick={removeJob.bind(null, i)}>
                                            <Clear />
                                        </IconButton>
                                    </Box>
                                ))
                            )}
                            <Box>
                                <Box>
                                    <Button variant="outlined" size="small" color="secondary" startIcon={<Add />} onClick={addJob} children="添加作业" />
                                </Box>
                            </Box>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Box mb={2}>
                            <Typography>
                                模拟速度 ({speed} ms / 回合)
                            </Typography>
                            <Slider
                                // defaultValue={1000}
                                step={250}
                                min={250}
                                max={5000}
                                valueLabelDisplay="auto"
                                value={speed}
                                onChange={(e, v) => {
                                    setSpeed(v as number);
                                }}
                            />
                        </Box>
                        <Box mb={2}>
                            <Button variant='outlined' onClick={toggle} children={running ? '重置模拟' : '开始模拟'}
                                color={running ? 'error' : 'primary'}
                                startIcon={running ? <Refresh /> : <PlayArrow />}
                                disabled={jobListInput.length === 0}
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
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>作业编号</TableCell>
                                    <TableCell>请求服务时长</TableCell>
                                    <TableCell>剩余需要时长</TableCell>
                                    <TableCell>已等待时长</TableCell>
                                    <TableCell>优先级</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tableRow.map((v, i) => (
                                    <TableRow key={i}>
                                        <TableCell>{v.id + `${i === activeIndex ? ' (正在执行)' : ''}`}</TableCell>
                                        <TableCell>{v.originalReq}</TableCell>
                                        <TableCell>{v.req}</TableCell>
                                        <TableCell>{v.hasWaitedFor}</TableCell>
                                        <TableCell>{v.prior}</TableCell>
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
                maxHeight: "40rem",
                overflowY: "auto"
            }}>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{text}</Typography>
            </Box>
        </Paper>
    </Box >;
}

export default AJobSchedulingEmu;