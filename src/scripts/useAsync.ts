import { useCallback, useEffect, useState } from "react";

/**
 * 负责处理异步函数的 Hook, 来自 https://stackoverflow.com/questions/53949393/cant-perform-a-react-state-update-on-an-unmounted-component
 * @param asyncFunc 异步函数，不允许更新 state
 * @param onSuccess 成功后的回调，可以更新 state，但必须不被更新 (否则触发 rerender)
 * @param onError 失败后的回调，可以更新 state，但必须不被更新
 * @param fireOnMount 是否直接就开始执行，手动触发设为 false
 * @param abortSeconds 超时时间，默认为 10 秒
 * @returns 触发一次动作
 */
function useAsync<T>(asyncFunc: (
    signal?: (AbortSignal)) => Promise<T>,
    onSuccess?: (result: T) => void,
    onError?: (error: Error) => void,
    fireOnMount = false,
    abortSeconds = 10
) {
    const [fire, setFire] = useState(fireOnMount);
    useEffect(() => {
        let isActive = true;
        let abortController = new AbortController();
        let timeout = setTimeout(() => {
            abortController.abort();
        }, abortSeconds * 1000);
        if (fire) {
            asyncFunc(abortController.signal).then((res) => {
                if (isActive && typeof onSuccess === "function") {
                    setFire(false);     // ← ★ 防止 rerender 造成二次执行
                    onSuccess(res);
                }
            }).catch((err) => {
                if (isActive && typeof onError === "function") {
                    setFire(false);     // ← 这里也一样
                    onError(err);
                }
            }).finally(() => {
                if (isActive) {
                    setFire(false);
                }
                // console.trace("finally");
            });
        }
        return () => {
            isActive = false;
            abortController.abort();
            clearTimeout(timeout);
        }
    }, [fire, asyncFunc, onSuccess, onError, abortSeconds]);

    const fireOnce = useCallback(() => {
        setFire(true);
    }, []);

    return fireOnce;
}

export default useAsync;