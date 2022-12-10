import { Box, Accordion, Typography } from "@mui/material"
import { useEffect, useCallback, useState, useRef, useMemo } from "react";
import { wasmModules } from "../wasmModules";


function LrxThreadsEmu({
    enable = false,
}: {
    enable: boolean,
    onFinished?: () => any,
}) {

    const runToggle = useMemo(() => enable, [enable]);
    const [text, setText] = useState('...');
    const [lines, setLines] = useState<string[]>([]);

    const boxRef = useRef<HTMLDivElement>(null);

    const handleChange = useCallback((str: string) => {
        console.log(['New Line: ' + str])
        setLines((prev) => [...prev, str]);
        // if (boxRef?.current) {
        //     setTimeout(() => {
        //         if (boxRef.current?.scrollTop !== undefined) {
        //             boxRef.current.scrollTop = boxRef.current?.scrollHeight;
        //             console.log(['scrolled..'])
        //         }
        //     }, 0);
        // }
    }, []);

    useEffect(() => {
        if (lines.length) {
            setText(lines.join('\n'));
        } else {
            setText(wasmModules.err || '未运行...')
        }
    }, [lines]);


    useEffect(() => {
        if (wasmModules.err || !wasmModules.lrxThreads) {
            setText(wasmModules.err + '');
            return;
        }
        if (runToggle) {
            // reset
            setLines([]);
            // window anchorEl
            window.__CONSOLE_INPUT__.anchorEl = boxRef.current;
            window.__CONSOLE_HANDLER__.registerCallbackFunction(handleChange);
            wasmModules.lrxThreads.run_once_async();
            // return func, clean all
            return () => {
                window.__CONSOLE_HANDLER__.unregisterCallbackFunction();
            };
        } else {
            window.__CONSOLE_HANDLER__.unregisterCallbackFunction();
            // ok how to stop...
            setLines([]);
        }
    }, [runToggle]);

    return <Accordion>
        <Box ref={boxRef} p={2} sx={{
            // maxHeight: "80rem",
            // overflowY: "auto"
        }}>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{text}</Typography>
        </Box>
    </Accordion>;
}

export default LrxThreadsEmu;