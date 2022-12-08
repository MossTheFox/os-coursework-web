import { Box } from "@mui/material";
import { useEffect, useState, useCallback, useRef } from "react";
import hljs from "highlight.js";

function CodeBlock({
    lang = "typescript",
    value = "// 点击查看源码以在这里显示代码块"
}) {

    const [show, setShow] = useState(false);
    const codeElem = useRef<HTMLElement>(null);

    useEffect(() => {
        if (value && codeElem.current) {
            setShow(true);
            hljs.highlightElement(codeElem.current);
        }
    }, [value, codeElem]);

    return <Box sx={{
        position: "fixed",
        bottom: "0.125rem",
        right: "0.125rem",
        p: 2,
        maxheight: "10rem",
        overflow: "auto"
    }}
        display={show ? 'block' : 'none'}
    >
        <pre><code className={`language-${lang.toLowerCase()}`} ref={codeElem}>{value}</code></pre>
    </Box>
}

export default CodeBlock