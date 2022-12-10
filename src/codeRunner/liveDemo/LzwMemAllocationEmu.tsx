import { Box, Accordion, Typography } from "@mui/material"
import { useEffect, useCallback, useState, useRef, useMemo } from "react";
import { wasmModules } from "../wasmModules";


function LzwMemAllocationEmu({
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
        //         // boxRef.current?.scrollTo(0, boxRef.current?.scrollHeight);
        //         if (boxRef.current?.scrollTop !== undefined) {
        //             boxRef.current.scrollTop = boxRef.current?.scrollHeight;
        //         }
        //     }, 0);
        // }
        // }, [boxRef]);
    }, []);

    useEffect(() => {
        if (lines.length) {
            setText(lines.join('\n'));
        } else {
            setText(wasmModules.err || '未运行...')
        }
    }, [lines]);

    useEffect(() => {
        if (wasmModules.err || !wasmModules.lzwMemAllocation) {
            setText(wasmModules.err + '');
            return;
        }
        if (runToggle) {
            // reset
            setLines([]);
            // window anchorEl
            window.__CONSOLE_INPUT__.anchorEl = boxRef.current;
            window.__CONSOLE_HANDLER__.registerCallbackFunction(handleChange);
            wasmModules.lzwMemAllocation.run_once();
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
            // maxHeight: "10rem",
            // overflowY: "auto"
        }}>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{text}</Typography>
        </Box>
    </Accordion>;
}

export default LzwMemAllocationEmu;