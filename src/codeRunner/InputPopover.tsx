import { Popover, Box, Typography, Stack, TextField, Button } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";

// [x] 避免空输入

function InputPopover() {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const inputNode = useRef<HTMLInputElement>(null);

    const [resolveFunc, setResolveFunc] = useState({
        resolve: (r: any) => { }
    });

    const onClose = useCallback((event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        // Not allowed....
        // setOpen(false);
    }, []);

    const textOnChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInput(e.target.value);
    }, []);


    const inputRequestHandler = useCallback((resolve: (i: any) => void) => {
        setInput('');
        setOpen(true);
        setAnchorEl(window.__CONSOLE_INPUT__.anchorEl);
        setResolveFunc({
            resolve
        });
        setTimeout(() => {
            inputNode.current?.focus();
        }, 0);
    }, [inputNode]);

    const handleSubmit = useCallback(() => {
        resolveFunc.resolve(input);
        setOpen(false);
    }, [input]);

    const onKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
        if (!open || document.activeElement !== inputNode.current || !input.length) return;
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSubmit();
        }
    }, [open, handleSubmit]);

    useEffect(() => {
        window.__CONSOLE_INPUT__.registerInputHandler(inputRequestHandler);
    }, [inputRequestHandler]);

    return <Popover open={open}
        onClose={onClose}
        anchorEl={anchorEl}
        anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
        }}
        transformOrigin={{
            vertical: "top",
            horizontal: "left"
        }}
    >
        <Box p={2}>

            <Stack spacing={1}>
                <Box>
                    <Typography component="span">
                        程序正在请求输入:
                    </Typography>
                </Box>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'end',
                }}>
                    <Box>
                        <TextField inputRef={inputNode} value={input} onChange={textOnChange}
                            variant="standard"
                            label="控制台输入"
                            onKeyDown={onKeyDown}
                        />
                    </Box>
                    <Box>
                        <Button variant="outlined" children="提交"
                            disabled={!input.length}
                            onClick={handleSubmit}
                        />
                    </Box>
                </Box>
            </Stack>
        </Box>
    </Popover>
}

export default InputPopover;