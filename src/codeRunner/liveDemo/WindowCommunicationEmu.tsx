import { Box, Accordion, Typography, Grid, TextField, Button, Paper, FormHelperText } from "@mui/material"
import { memo, useCallback, useEffect, useState } from 'react';


function WindowCommunicationEmu({
}) {
    const [receivedMessage, setReceivedMessage] = useState('');
    const [msgInput, setMsgInput] = useState('');
    const [childWindow, setChildWindow] = useState<Window | null>(null);

    const [tipText, setTipText] = useState('');

    useEffect(() => {
        // close it on unmount
        setReceivedMessage('');
        return () => {
            childWindow?.close();
        }
    }, [childWindow]);

    const openWindow = useCallback(() => {
        // (302 重定向会影响 window.opener... 用完整 URL)
        let wind = window.open('/post-message/', '子窗口', 'popup, width=360, height=480');
        setChildWindow(wind);
        if (!wind) {
            setTipText('打开窗口遇到问题，请确保当前页面是焦点页面、以及你的浏览器没有拦截此窗口。')
        } else {
            setTipText('');
        }
    }, []);

    const onMessage = useCallback((str: string) => {
        setReceivedMessage((v) => v ? `${v}\n${str}` : str);
    }, []);

    const sendMessage = useCallback(() => {
        if (!childWindow) return;
        if (childWindow.closed) {
            setTipText('子窗口已关闭。你可以重新唤起。');
            setChildWindow(null);
            return;
        }
        childWindow.postMessage(JSON.stringify({
            type: 'message',
            data: msgInput
        }));
        setMsgInput('');
    }, [childWindow, msgInput]);

    useEffect(() => {
        const fn = async (ev: MessageEvent<string>) => {
            try {

                let parsed = JSON.parse(ev.data);
                if ('type' in parsed && parsed.type === 'message' && typeof parsed.data === 'string') {
                    onMessage(parsed.data + '');
                }
            } catch (err) {
                // ignore
            }
        };
        window.addEventListener('message', fn);
        return () => {
            window.removeEventListener('message', fn);
        }
    }, []);

    return <Grid container gap={2}>
        <Grid item xs={12} textAlign="center">
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
                {childWindow ? <>
                    <TextField autoComplete='off'
                        sx={{ mr: 2, mb: 2 }}
                        size="small"
                        value={msgInput}
                        onChange={(e) => setMsgInput(e.target.value)}
                        label="向子窗口发消息"
                    />
                    <Button type='button' children={'发送'} variant="contained" onClick={sendMessage} />
                </> :
                    <Button type='button' sx={{ mb: 2 }} children={'打开子窗口'} variant="contained" onClick={openWindow} />
                }
            </form>
            <Typography variant="body2">{tipText}</Typography>
        </Grid>
        <Grid item xs={12}>
            <Typography variant="body1" gutterBottom>收到的消息：</Typography>
            <Paper sx={{ p: 2 }}>
                <Typography variant="body2" whiteSpace='pre-wrap' children={receivedMessage || '(暂无消息)'} />
            </Paper>
        </Grid>
    </Grid>;
}

export default WindowCommunicationEmu;