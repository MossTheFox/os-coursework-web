import { Box, Accordion, Typography } from "@mui/material"
import { memo } from 'react';


function PlaceholderEmu({
    // onFinished = null
}: {
}) {


    return <Accordion>
        <Box p={2} sx={{
            maxHeight: "10rem",
            overflowY: "auto"
        }}>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{'Work in progress...'}</Typography>
        </Box>
    </Accordion>;
}

export default memo(PlaceholderEmu);