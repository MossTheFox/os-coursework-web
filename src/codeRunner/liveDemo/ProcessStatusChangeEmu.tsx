import { Box, Accordion, Typography, Grid, Stack, Button } from "@mui/material"
import { memo, useEffect, useRef, useState } from 'react';

const anchorPositonData = {
    'create': {
        x: 0.05227,    // 5.22%
        y: 0.0258
    },
    'running': {
        x: 0.573,
        y: 0.0258
    },
    'end': {
        x: 0.944,
        y: 0.039
    },
    'active-ready': {
        x: 0.3829,
        y: 0.3649
    },
    'inactive-ready': {
        x: 0.7387,
        y: 0.3649
    },
    'active-blocked': {
        x: 0.2220,
        y: 0.7644
    },
    'inactive-blocked': {
        x: 0.5732,
        y: 0.7678
    }
} as const;

const statusText = {
    'create': '创建',
    'running': '执行',
    'end': '终止',
    'active-ready': '活动就绪',
    'inactive-ready': '静止就绪',
    'active-blocked': '活动阻塞',
    'inactive-blocked': '静止阻塞'
} as const;

const allowedActions = {
    'create': {
        os: {
            '许可 (资源充足)': 'active-ready',
            '许可 (资源不足)': 'inactive-ready'
        },
        process: {}
    },
    'running': {
        os: {
            '挂起': 'inactive-ready',
            '结束进程': 'end'
        },
        process: {
            '时间片用尽': 'active-ready',
            '请求 I/O': 'active-blocked',
            '任务完成': 'end',
            '出现严重故障': 'end',
        }
    },
    'end': {
        os: {},
        process: {}
    },
    'active-ready': {
        os: {
            '调度': 'running',
            '挂起': 'inactive-ready'
        },
        process: {}
    },
    'inactive-ready': {
        os: {
            '激活': 'active-ready'
        },
        process: {}
    },
    'active-blocked': {
        os: {
            'I/O 完成': 'active-ready',
            '挂起': 'inactive-blocked'
        },
        process: {}
    },
    'inactive-blocked': {
        os: {
            '激活': 'active-blocked'
        },
        process: {}
    }
} as const;

const getCSSFromPercentage = (coordPerventage: { x: number; y: number; }) => {
    return {
        left: `${(coordPerventage.x * 100).toFixed(2)}%`,
        top: `${(coordPerventage.y * 100).toFixed(2)}%`,
    };
};

function ProcessStatusChangeEmu({
    // onFinished = null
}: {
    }) {

    const anchor = useRef<HTMLDivElement>(null);

    const [currentProcessPosition, setCurrentProcessPosition] = useState<keyof typeof anchorPositonData>('create');
    const [arrowPositionCSS, setArrowPositionCSS] = useState({
        left: '5.23%',
        top: '2.58%',
    });

    useEffect(() => {
        setArrowPositionCSS(getCSSFromPercentage(anchorPositonData[currentProcessPosition]));
    }, [currentProcessPosition]);

    /*  以下是取坐标用的临时代码
    useEffect(() => {
        if (!anchor.current) return;
        const fn = (e: MouseEvent) => {
            console.log(e.clientX, e.clientY);
            let rect = anchor.current!.getBoundingClientRect();
            const mousePosition = {
                xOffset: e.clientX - rect.left,
                yOffset: e.clientY - rect.top
            };
            console.log(mousePosition);
 
            const mousePercentagePersition = {
                x: mousePosition.xOffset / rect.width,
                y: mousePosition.yOffset / rect.height
            };
            console.log(mousePercentagePersition);
        };
        anchor.current.addEventListener('click', fn);
 
        return () => { anchor.current?.removeEventListener('click', fn); }
    }, [anchor]);
    */

    return <Box>
        <Grid container spacing={2}>
            <Grid item xs={12} sm={8} display="flex" justifyContent="center" alignItems="start">
                <Box ref={anchor}
                    position="relative"
                    width="100%"
                    maxWidth="500px"
                >
                    <Box sx={{
                        position: 'absolute',
                        ...arrowPositionCSS,
                        transform: 'translate(-50%, -100%)',
                        transition: 'all 0.25s'
                    }}>
                        <img src="/static/arrow_down.svg" style={{ width: '1.5rem' }} alt="👇" />
                    </Box>
                    <img src="/static/process_status.svg" style={{ width: '100%' }} alt="进程状态切换 7 种" />
                </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
                <Stack spacing={2}>
                    <Box>
                        <Typography variant="body1" fontWeight="bolder" gutterBottom>
                            当前进程状态: {statusText[currentProcessPosition]}
                        </Typography>
                        <Button size="small" variant="outlined" onClick={setCurrentProcessPosition.bind(null, 'create')}>重置</Button>
                    </Box>
                    <Stack spacing={1}>
                        <Typography variant="body1" fontWeight="bolder" gutterBottom>
                            进程的动作:
                        </Typography>
                        {(() => {
                            const actions = allowedActions[currentProcessPosition].process;
                            if (Object.keys(actions).length === 0) {
                                return <Typography variant="body2" gutterBottom>没有可以执行的动作。</Typography>
                            }
                            return Object.entries(actions).map((v, i) =>
                                <Button key={i} size="small" variant="contained"
                                    onClick={setCurrentProcessPosition.bind(null, v[1])}
                                >{v[0]}</Button>
                            );
                        })()}
                    </Stack>
                    <Stack spacing={1}>
                        <Typography variant="body1" fontWeight="bolder" gutterBottom>
                            操作系统的动作:
                        </Typography>
                        {(() => {
                            const actions = allowedActions[currentProcessPosition].os;
                            if (Object.keys(actions).length === 0) {
                                return <Typography variant="body2" gutterBottom>没有可以执行的动作。</Typography>
                            }
                            return Object.entries(actions).map((v, i) =>
                                <Button key={i} size="small" variant="contained"
                                    onClick={setCurrentProcessPosition.bind(null, v[1])}
                                >{v[0]}</Button>
                            );
                        })()}
                    </Stack>

                </Stack>
            </Grid>
        </Grid>
    </Box>
}

export default memo(ProcessStatusChangeEmu);