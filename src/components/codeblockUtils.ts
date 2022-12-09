import { PreloadedCodeBlockJsonKeys } from "./codeblock/CodeBlock";

let existedWindow: Window | null = null;

export function openCodeblockWindow(id: PreloadedCodeBlockJsonKeys) {
    if (!existedWindow || existedWindow.closed) {
        existedWindow = window.open('/code-block/', '源代码', 'popup, width=720, height=1280, status=no, menubar=no');
        existedWindow?.addEventListener('load', (e) => {
            existedWindow?.postMessage(JSON.stringify({
                type: 'codeblock',
                data: id
            }));
        });
    } else {
        existedWindow?.postMessage(JSON.stringify({
            type: 'codeblock',
            data: id
        }));
    }
    existedWindow?.focus();
}