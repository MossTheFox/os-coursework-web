import { Box, Button, Container, Grid, Paper, Typography, TextField, Divider } from "@mui/material";
import { useState, useCallback, useEffect } from "react";
import { openCodeblockWindow } from "../../components/codeblockUtils";
import TabbedPlaygroundTemplate from "../../components/TabbedPlaygroundTemplate";
import LzwMemAllocationEmu from "../liveDemo/LzwMemAllocationEmu";
import PlaceholderEmu from "../liveDemo/PlaceholderEmu";
import { wasmModules } from "../wasmModules";

function PaperMemoryAllocation() {

    const [enableA, setEnableA] = useState(false);
    const [enableB, setEnableB] = useState(false);
    const [enableC, setEnableC] = useState(false);
    const [enableD, setEnableD] = useState(false);
    const toggleA = useCallback(() => {
        setEnableA((v) => !v);
    }, []);
    const toggleB = useCallback(() => {
        setEnableB((v) => !v);
    }, []);


    const cleanUpFunction = useCallback(() => {
        // Note: 多线程或循环任务需要调用取消方法
        setEnableA(false);
        setEnableB(false);
        setEnableC(false);
        setEnableD(false);
    }, []);

    /** 清理函数自动调用 */
    useEffect(() => {
        if (!(enableA || enableB || enableC || enableD)) {
            cleanUpFunction();
        }
    }, [cleanUpFunction]);

    return <Paper>
        <Container maxWidth="lg" sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight="bolder" gutterBottom textAlign={"center"}
                borderBottom={1} borderColor="divider"
            >
                内存分配
            </Typography>
            <Typography variant="body2" gutterBottom textAlign="center">
                学习和理解计算机主存的分配算法
            </Typography>

            <TabbedPlaygroundTemplate onTabChange={cleanUpFunction}
                tabs={1}
                tabNames={[
                    "动态分区分配",
                    // "TODO",
                ]}
                tabNodes={[
                    <Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={8}>
                                <Typography gutterBottom variant="body1" sx={{ textIndent: "2rem" }}>
                                    利用快速适应算法实现动态分区分配：将各空闲区按照其存取大小进行分类，并将基于索引搜索的动态分区分配算法。
                                </Typography>
                                <Typography gutterBottom variant="body1" sx={{ textIndent: "2rem" }}>
                                    为了提高搜索空间的分区的速度，在中大型系统中往往会采用基于索引搜索的动态分区分配算法。
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography color="primary"
                                    fontWeight="bolder"
                                    variant="body1"
                                    gutterBottom
                                >组员: 刘智文</Typography>
                                <Typography color="primary"
                                    fontWeight="bolder"
                                    variant="body1"
                                    gutterBottom
                                    borderBottom={1}
                                    borderColor="divider"
                                >程序语言: C++</Typography>
                                <Box pb={1}>
                                    <Button variant="outlined"
                                        children={enableA ? '重置程序' : '启动程序'}
                                        onClick={toggleA}
                                    />
                                </Box>
                                <Button variant="text"
                                    color="info"
                                    children={'查看源代码'}
                                    onClick={openCodeblockWindow.bind(null, 'lzw-mem-allocation')}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <LzwMemAllocationEmu enable={enableA} />
                            </Grid>

                        </Grid>
                    </Box>,
                    //     <Box>
                    //         <Grid container spacing={2}>
                    //             <Grid item xs={12} sm={8}>
                    //                 <Typography gutterBottom variant="body1" sx={{ textIndent: "2rem" }}>
                    //                     TODO
                    //                 </Typography>
                    //             </Grid>

                    //             <Grid item xs={12} sm={4}>
                    //                 <Typography color="primary" sx={{
                    //                     fontWeight: "bolder"
                    //                 }}
                    //                     variant="body1"
                    //                     gutterBottom
                    //                     borderBottom={1}
                    //                     borderColor="divider"
                    //                 >程序语言: TypeScript (React)</Typography>
                    //                 <Button variant="outlined"
                    //                     children={'WIP'}
                    //                     disabled
                    //                 />
                    //             </Grid>

                    //             <Grid item xs={12}>
                    //                 <PlaceholderEmu />
                    //             </Grid>

                    //         </Grid>
                    //     </Box>,
                ]}
            />
        </Container>
    </Paper>


}

export default PaperMemoryAllocation;