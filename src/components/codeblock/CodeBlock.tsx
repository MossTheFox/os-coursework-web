import dataJSON from './preloadedCodeBlocks.json';

// css
import './gist-embed-e3cc60909cd2.css';
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';

export type PreloadedCodeBlockJsonKeys = '' | keyof typeof dataJSON;

function CodeBlock({ id = '' }: { id: '' | keyof typeof dataJSON }) {
    const [html, setHTML] = useState('');

    useEffect(() => {
        if (id) {
            setHTML(dataJSON[id] ?? 'null');
        }
    }, [id]);


    return <Box p={2} dangerouslySetInnerHTML={{
        __html: html
    }}>
    </Box>
}

export default CodeBlock;