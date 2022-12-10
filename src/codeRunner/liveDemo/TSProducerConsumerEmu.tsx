import { Box, Accordion, Typography } from "@mui/material"
import { useEffect, useCallback, useState, useRef } from "react";
import { tsPCEmuController } from "./scripts/tsPCE";

function TSProducerConsumerEmu({
    enable = false
}) {

    const [text, setText] = useState('未开始模拟');

    const handleChange = useCallback((str: string) => {
        let arr = str.split('\n');
        if (arr.length > 100) {
            arr = arr.splice(arr.length - 100, arr.length)
        }
        str = arr.join('\n');
        setText(str);
        if (boxRef?.current) {
            setTimeout(() => {
                boxRef.current?.scrollTo(0, boxRef.current?.scrollHeight);
            }, 0);
        }
    }, []);

    const boxRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (enable) {
            tsPCEmuController.registerLogChangeCallback(handleChange);
            tsPCEmuController.run();
            window.__CONSOLE_HANDLER__.registerEndAsyncTaskFunction(tsPCEmuController.stop);
        } else {
            tsPCEmuController.unregisterLogChangeCallback();
            tsPCEmuController.stop();
        }
    }, [enable]);

    return <Accordion>
        <Box ref={boxRef} p={2} sx={{
            maxHeight: "30rem",
            overflowY: "auto"
        }}>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{text}</Typography>
        </Box>
    </Accordion>;
}

export default TSProducerConsumerEmu;