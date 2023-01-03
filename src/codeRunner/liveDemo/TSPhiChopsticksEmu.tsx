import { HourglassEmpty, Psychology, SetMeal } from "@mui/icons-material";
import { Grid, Box, Typography, Paper, Slider } from "@mui/material";
import { useEffect, useCallback, useState, useRef } from "react";
import { tsPhiEmuController } from "./scripts/tsPhilosopher";

const getIcon = (str: string, num: number) => {
    switch (str[num]) {
        case '-':
            return <Psychology fontSize="large" />;
        case 'E':
            return <SetMeal fontSize="large" />;
        case 'H':
            return <HourglassEmpty fontSize="large" />
    }
};

function TSPhiChopsticksEmu({
    enable = false
}) {

    const [text, setText] = useState('未开始模拟');
    const [phiStatus, setPhiStatus] = useState('------------');
    const [speedRate, setSpeedRate] = useState(10);

    useEffect(() => {
        tsPhiEmuController.setSpeedRate(speedRate);
    }, [speedRate]);

    const handleLine = useCallback((line: string) => {
        setPhiStatus(line);
        setText((prev) => {
            let str = (prev ? (prev + '\n') : '') + line;
            let arr = str.split('\n');
            if (arr.length > 100) {
                arr = arr.splice(arr.length - 100, arr.length)
            }
            str = arr.join('\n');
            return str;
        })
        if (boxRef?.current) {
            setTimeout(() => {
                boxRef.current?.scrollTo(0, boxRef.current?.scrollHeight);
            }, 0);
        }
    }, []);

    const boxRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (enable) {
            setText('');
            tsPhiEmuController.registerConsoleLogCallback(handleLine);
            tsPhiEmuController.start();
            window.__CONSOLE_HANDLER__.registerEndAsyncTaskFunction(tsPhiEmuController.stop);
        } else {
            setPhiStatus('------------');
            tsPhiEmuController.unregisterConsoleLogCallback();
            tsPhiEmuController.stop();
        }
    }, [enable]);

    return <Paper sx={{ p: 2 }}>
        {/* 6 x 6 | 放 12 个哲学家 | 圆形布局不好写就用网格凑合一下 */}
        <Box textAlign="center">
            <Box display="inline-block" maxWidth="16rem">
                <Grid container>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={2}>{getIcon(phiStatus, 0)}</Grid>
                    <Grid item xs={2}>{getIcon(phiStatus, 1)}</Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={2}></Grid>

                    <Grid item xs={2}></Grid>
                    <Grid item xs={2}>{getIcon(phiStatus, 11)}</Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={2}>{getIcon(phiStatus, 2)}</Grid>
                    <Grid item xs={2}></Grid>

                    <Grid item xs={2}>{getIcon(phiStatus, 10)}</Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={2}>{getIcon(phiStatus, 3)}</Grid>

                    <Grid item xs={2}>{getIcon(phiStatus, 9)}</Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={2}>{getIcon(phiStatus, 4)}</Grid>

                    <Grid item xs={2}></Grid>
                    <Grid item xs={2}>{getIcon(phiStatus, 8)}</Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={2}>{getIcon(phiStatus, 5)}</Grid>
                    <Grid item xs={2}></Grid>

                    <Grid item xs={2}></Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={2}>{getIcon(phiStatus, 7)}</Grid>
                    <Grid item xs={2}>{getIcon(phiStatus, 6)}</Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={2}></Grid>
                </Grid>
            </Box>
        </Box>

        <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
                <Box ref={boxRef} p={2} sx={{
                    maxHeight: "10rem",
                    overflowY: "auto",
                }}>
                    <Typography variant="body2" sx={{
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'monospace'
                    }}>{text}</Typography>
                </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
                <Typography gutterBottom>随机刻间隔时间倍率 ({speedRate}x)</Typography>
                <Slider valueLabelDisplay="auto" min={10} max={500} step={10} value={speedRate} onChange={(e, v) => { setSpeedRate(+v) }} />
            </Grid>
        </Grid>

    </Paper >;
}

export default TSPhiChopsticksEmu;