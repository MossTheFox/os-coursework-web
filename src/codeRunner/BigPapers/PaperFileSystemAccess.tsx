import { ChevronRight, ExpandMore } from "@mui/icons-material";
import { TreeItem, TreeView } from "@mui/lab";
import { Box, Button, Container, Grid, Paper, Typography, TextField, Divider } from "@mui/material";
import React from "react";
import { useState, useCallback, useEffect } from "react";
import TabbedPlaygroundTemplate from "../../components/TabbedPlaygroundTemplate";
import useAsync from "../../scripts/useAsync";

class TreeNode<T> {
    root: T;
    children: TreeNode<T>[];
    constructor(root: T) {
        this.root = root;
        this.children = [];
    };
};

interface TreeViewObject {
    id: string;
    name: string;
    type: 'file' | 'directory';
    children?: this[]
};

const findIdObj = (obj: TreeViewObject, id: string) => {
    if (obj.id === id) return obj;
    if (!obj.children) return null;
    let arr: (TreeViewObject | null)[] = [];
    for (const i of obj.children) {
        arr.push(findIdObj(i, id));
    }
    arr = arr.filter((v) => v);
    if (arr.length) {
        return arr[0];
    }
    return null;
};

const getSizeString = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    if (size < 1024 * 1024 * 1024) return `${(size / 1024 / 1024).toFixed(2)} MB`;
    if (size < 1024 * 1024 * 1024 * 1024) return `${(size / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

const renderTree = (nodes: TreeViewObject) => (
    <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
        {Array.isArray(nodes.children) ?
            nodes.children.map((v) => renderTree(v))
            : null}
    </TreeItem>
);

function PaperFileSystemAccess() {

    const [rootHandle, setRootHandle] = useState<FileSystemDirectoryHandle | null>(null);
    // 存……
    /* 按 ID 索引拿 Handle 的 Map (不要把 handle 翻译成句柄，这翻译很烂的) */
    const [fsNodeMap, setFsNodeMap] = useState<Map<number, TreeNode<FileSystemDirectoryHandle | FileSystemFileHandle>>>();
    /* 按 ID 记录的树状结构, Rerender Hook */
    const [fsTreeViewObject, setFsTreeViewObject] = useState<TreeViewObject>();
    // 这个是文字提示
    const [selectedInfo, setSelectedInfo] = useState('');

    const asyncShowDirectoryPicker = useCallback(async () => {
        if (!window.showDirectoryPicker) throw new Error('u browser blew up');

        return window.showDirectoryPicker({
            id: 'file-system-access-demo',
            mode: 'read'
        });
    }, []);

    const onResolved = useCallback((handle: FileSystemDirectoryHandle) => {
        setRootHandle(handle);
        const newNode = new TreeNode(handle);
        const newMap = new Map<number, TreeNode<FileSystemDirectoryHandle | FileSystemFileHandle>>();
        newMap.set(0, newNode);
        setFsNodeMap(newMap);
        setFsTreeViewObject({ id: '0', name: handle.name, type: 'directory' });
        // 展开一下……
    }, []);

    const onError = useCallback((err: unknown) => {
        console.log(err);
    }, []);

    const showDirectoryPicker = useAsync(asyncShowDirectoryPicker, onResolved, onError);

    useEffect(() => {
        if (!rootHandle) return;
        handleSelect('', '0');
    }, [rootHandle]);

    const handleSelect = useCallback(async (_: React.SyntheticEvent | any, nodeIds: string | string[]) => {
        // 这里应该是 string 而非 string[]
        if (Array.isArray(nodeIds) || !fsNodeMap || !fsTreeViewObject) return;

        /** 当前选中的这个树节点 */
        let fileHandleNode = fsNodeMap.get(+nodeIds);
        if (!fileHandleNode) return;
        let root = fileHandleNode.root;

        // file
        if (root instanceof FileSystemFileHandle) {
            let fileInfo = await root.getFile();
            setSelectedInfo(`${fileInfo.name} (${getSizeString(fileInfo.size)})`);
            return;
        }

        // 是目录：
        /** 树状结构的此处节点 */
        let linkedObjectPosition = findIdObj(fsTreeViewObject, nodeIds);
        if (!linkedObjectPosition) {
            setSelectedInfo('出错 (未知错误)');
            return;
        }
        if (root instanceof FileSystemDirectoryHandle) {
            /** 清空重新填 */
            linkedObjectPosition.children = [];
            fileHandleNode.children = [];
            /** 展开下级，便于 TreeNode 组件显示展开提示符号 */
            const toBeUnfolded: [FileSystemDirectoryHandle, TreeNode<FileSystemDirectoryHandle | FileSystemFileHandle>, TreeViewObject][] = [];

            for await (const handle of root.values()) {
                const newID = fsNodeMap.size;
                const newNode = new TreeNode(handle);
                fileHandleNode.children.push(newNode);
                fsNodeMap.set(newID, newNode);
                const newEmbeddedObject = { id: newID + '', name: handle.name, type: handle.kind };
                linkedObjectPosition.children.push(newEmbeddedObject);
                if (handle.kind === 'directory') {
                    toBeUnfolded.push([handle, newNode, newEmbeddedObject]);
                }
            }

            linkedObjectPosition.children.sort((a, b) => {
                if (a.type === 'directory' && b.type === 'file') return -1;
                if (a.type === 'file' && b.type === 'directory') return 1;
                return a.name > b.name ? 1 : -1;
            });

            // 向下只展开一级
            for (const [what, theTreeNode, theViewObject] of toBeUnfolded) {
                theTreeNode.children = [];
                theViewObject.children = [];
                for await (const handle of what.values()) {
                    const newID = fsNodeMap.size;
                    const newNode = new TreeNode(handle);
                    theTreeNode.children.push(newNode);
                    fsNodeMap.set(newID, newNode);
                    theViewObject.children.push({ id: newID + '', name: handle.name, type: handle.kind });
                }

                theViewObject.children.sort((a, b) => {
                    if (a.type === 'directory' && b.type === 'file') return -1;
                    if (a.type === 'file' && b.type === 'directory') return 1;
                    return a.name > b.name ? 1 : -1;
                });
            }
        }
        // Rerender Hook
        setFsTreeViewObject((prev) => (prev ? { ...prev } : undefined));
    }, [fsNodeMap, fsTreeViewObject])

    return <Paper>
        <Container maxWidth="lg" sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight="bolder" gutterBottom textAlign={"center"}
                borderBottom={1} borderColor="divider"
            >
                外存访问
            </Typography>
            <Typography variant="body2" gutterBottom textAlign="center">
                访问操作系统的文件系统，观察其组织结构
            </Typography>

            <TabbedPlaygroundTemplate
                tabs={1}
                tabNames={[
                    "文件系统访问",
                ]}
                tabNodes={[
                    <Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={8}>
                                <Typography gutterBottom variant="body1" sx={{ textIndent: "2rem" }}>
                                    操作系统的文件系统会以树状结构来组织。你可以在这里选择一个目录、然后查看其层次结构。
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography color="primary" sx={{
                                    fontWeight: "bolder"
                                }}
                                    variant="body1"
                                    gutterBottom
                                    borderBottom={1}
                                    borderColor="divider"
                                >程序语言: TypeScript (React)</Typography>
                                <Button variant="contained"
                                    children={'showDirectoryPicker' in window ? '选择本地目录' : '浏览器不支持'}
                                    disabled={!('showDirectoryPicker' in window)}
                                    onClick={showDirectoryPicker}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant='body1' gutterBottom>{
                                    rootHandle ? (
                                        selectedInfo ||
                                        `根目名称: ${rootHandle.name}`
                                    ) : '没有选择目录'
                                }</Typography>
                                {rootHandle &&
                                    <TreeView
                                        defaultCollapseIcon={<ExpandMore />}
                                        defaultExpandIcon={<ChevronRight />}
                                        onNodeSelect={handleSelect}
                                    >
                                        {fsTreeViewObject ? renderTree(fsTreeViewObject) : null}
                                    </TreeView>
                                }

                            </Grid>

                        </Grid>
                    </Box>
                ]}
            />
        </Container>
    </Paper>


}

export default PaperFileSystemAccess;