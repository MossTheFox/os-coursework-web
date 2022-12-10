interface Window {
    __CONSOLE_HANDLER__: {
        registerCallbackFunction: (fn: (s: string) => any) => {},
        unregisterCallbackFunction: () => {},
        checkBindStatus: () => boolean,

        registerEndAsyncTaskFunction: (fn: () => void) => {},
        unregisterEndAsyncFunction: () => {}
    },
    __CONSOLE_INPUT__: {
        registerInputHandler: (fn: (resolve: (any)) => void) => void,
        removeInputHandler: () => void,
        getTrigger: () => ((resolve: (any)) => void),
        anchorEl: HTMLElement | null
    };
}
