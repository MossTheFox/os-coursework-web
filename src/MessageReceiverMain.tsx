import { Box, Button, Container, Grid, Paper, TextField, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";

function MessageReceiverMain() {
    const [receivedMessage, setReceivedMessage] = useState('');
    const [msgInput, setMsgInput] = useState('');

    const onMessage = useCallback((str: string) => {
        setReceivedMessage((v) => v ? `${v}\n${str}` : str);
    }, []);

    const sendMessage = useCallback(() => {
        window.opener?.postMessage(JSON.stringify({
            type: 'message',
            data: msgInput
        }));
        setMsgInput('');
    }, [msgInput]);

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
    return <Container maxWidth="md" sx={{ py: 2 }}>
        <Typography variant="h6" textAlign="center" fontWeight="bolder" gutterBottom>子窗口</Typography>
        {
            !window.opener
            && <Typography variant="body1" textAlign="center" fontWeight="bolder" gutterBottom>留意：当前窗口并没有以子窗口形式打开</Typography>
        }
        <Grid container gap={2}>
            <Grid item xs={12} textAlign="center">
                <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
                    <TextField sx={{ pr: 2, mb: 2 }}
                        size="small" autoComplete='off'
                        value={msgInput}
                        onChange={(e) => setMsgInput(e.target.value)}
                        label="向父窗口发消息"
                    />
                    <Button type='button' children={'发送'} variant="contained" onClick={sendMessage} />
                </form>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="body1" gutterBottom>收到的消息：</Typography>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="body2" whiteSpace='pre-wrap' children={receivedMessage || '(暂无消息)'} />
                </Paper>
            </Grid>
        </Grid>
    </Container>
}

export default MessageReceiverMain;