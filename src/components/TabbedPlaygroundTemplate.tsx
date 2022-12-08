import { Box, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useState, useCallback, memo } from 'react';

function TabbedPlaygroundTemplate({
    tabs = 0,
    tabNames = [],
    tabNodes = [],
    onTabChange = null
}: {
    // children: React.ReactNode,
    tabs: number,
    tabNames: Array<string>,
    tabNodes: Array<React.ReactNode>,
    onTabChange?: Function | null
}) {
    const [tabValue, setTabValue] = useState('0');

    if (tabNames.length !== tabNodes.length || tabNames.length !== tabs) {
        throw new Error('Tabs count and provided array length not matched.');
    }

    const handleChange = useCallback((event: React.SyntheticEvent, value: string) => {
        setTabValue(value);
        if (typeof onTabChange === 'function') {
            onTabChange();
        }
    }, [onTabChange]);

    return <TabContext value={tabValue}>
        <TabList onChange={handleChange}>
            {tabNames.map((v, i) => (
                <Tab wrapped key={i} label={v} value={i + ''} />
            ))}
        </TabList>
        {tabNodes.map((v, i) => (
            <TabPanel key={i} value={i + ''} children={v} />
        ))}
    </TabContext>;
}

export default memo(TabbedPlaygroundTemplate);