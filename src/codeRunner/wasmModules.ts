// @ts-nocheck

/**
 * emcc -std=c++11 -pthread -s test.cpp -o test.js 
 * -s MODULARIZE=1 -s EXPORT_NAME=createModule -s NO_EXIT_RUNTIME=1 👈 
 * -s "EXPORTED_RUNTIME_METHODS=['ccall']"   👈 这个允许调用函数
 * 
 * 实际上应该是下面这个
 */

// emcc -std=c++11 -pthread -s "./program.cpp" -o "wasm_module.js" -s MODULARIZE=1 -s EXPORT_NAME=moduleName -s NO_EXIT_RUNTIME=1 -s "EXPORTED_RUNTIME_METHODS=['ccall', 'cwrap']" -s PTHREAD_POOL_SIZE=4 -sASYNCIFY

// emcc -std=c++11 -pthread -s "./combined_LLF_EDF.cpp" -o "b_process_scheduling.js" -s MODULARIZE=1 -s EXPORT_NAME=createBProcessSchedulingModule -s NO_EXIT_RUNTIME=1 -s "EXPORTED_RUNTIME_METHODS=['ccall', 'cwrap']" -s PTHREAD_POOL_SIZE=1 -sASYNCIFY -s ASYNCIFY_IMPORTS=[wait_for_number, wait_for_string]

// emcc -std=c++11 -pthread -s "./LiuProgramsConbined.cpp" -o "liu-program-combined.js" -s MODULARIZE=1 -s EXPORT_NAME=liuModuleA -s NO_EXIT_RUNTIME=1 -s "EXPORTED_RUNTIME_METHODS=['ccall', 'cwrap']" -s PTHREAD_POOL_SIZE=1 -sASYNCIFY -s ASYNCIFY_IMPORTS=[wait_for_number, wait_for_string]

/**
 * 组员标记:
 * A: 乔译
 * B: 刘智文
 * C: 刘睿鑫
 * D: 陈锦天
 */

export const wasmModules: {
    err: null | string,
    // debugModule?: {
    //     run_print: () => {},
    //     run_endless: () => {},
    //     run_ask_input: () => {},
    //     run_give_param: (param?: string) => {},
    //     stop: () => {}
    // },
    liuCombinedA?: {
        run_EDF: () => {},
        run_LLF: () => {},
        run_programCommunication: () => {}
    },
    // lzwPD?: {
    //     run: () => {}
    // }
    lzwMemAllocation?: {
        run_once: () => {}
    },
    chenBanker?: {
        run_once_async: () => {}
    },
    lrxThreads?: {
        run_once_async: () => {}
    }
} = {
    err: null
};

(async () => {
    try {
        // PREPARE
        wasmModules.err = '模块正在加载。点击运行以确认加载状态并执行程序。';

        // 0: DEBUG
        // if (typeof debugModule !== 'undefined') {

        //     let debug = await debugModule();
        //     wasmModules.debugModule = {
        //         run_print() {
        //             debug.ccall('print_something', null, null, null);
        //         },
        //         run_endless() {
        //             debug.ccall('start_endless_thread', null, null, null);
        //         },
        //         run_give_param(param = "Hello 🦊") {
        //             debug.ccall('param_something', null, ['string'], [param]);
        //         },
        //         run_ask_input() {
        //             debug.ccall('input_something', null, null, null, { async: true });
        //         },
        //         stop: () => {
        //             debug.ccall('end', null, null, null);
        //         }
        //     };
        // }

        // 1. LiuModuleA
        if (typeof liuModuleA !== 'undefined') {
            let module1 = await liuModuleA();
            wasmModules.liuCombinedA = {
                run_EDF: () => {
                    module1.ccall('run_EDF', null, null, null);
                },
                run_LLF: () => {
                    module1.ccall('run_LLF', null, null, null);
                },
                run_programCommunication: () => {
                    module1.ccall('run_program_communication', null, null, null, { async: true });
                }
            };
        }
        // 2: async Producer Consumer (To be CHANGED since it cannot be stopped)
        // let module2 = await pdModule();
        // wasmModules.lzwPD = {
        //     run: () => {
        //         module2.ccall('run', null, null, null);
        //     }
        // };

        // 刘智文 内存分配 (保留上下文)
        if (typeof lzwMemAllocation !== 'undefined') {
            let m = await lzwMemAllocation();
            wasmModules.lzwMemAllocation = {
                run_once: () => {
                    m.callMain({ async: true });
                }
            };
        }

        // 陈锦天 银行家算法 (单次程序，不保留上下文)
        if (typeof chenBanker !== 'undefined') {
            wasmModules.chenBanker = {
                run_once_async: async () => {
                    let m = await chenBanker();
                    m.callMain();
                }
            };
        }

        // 刘瑞鑫 线程机制 (单次程序，不保留上下文)
        if (typeof lrxThread !== 'undefined') {
            wasmModules.lrxThreads = {
                run_once_async: async () => {
                    let m = await lrxThread();
                    m.callMain();
                }
            };
        }

        // END
        wasmModules.err = '';

    } catch (err) {
        console.log(err);
        wasmModules.err = `装载 WebAssembly 模块时发生错误。错误信息: ${err}`;
    }
})();
// 以下在 HTML Header 内完成定义

// // redirect console log
// let consoleLog = console.log;

// let consoleLogCallback: (s: string) => any  = (str: string) => consoleLog(str);

// export const consoleOutputHandler = {
//     registerCallbackFunction: (fn: (s: string) => any) => {
//         consoleLogCallback = fn;
//     },
//     unregisterCallbackFunction: () => {
//         consoleLogCallback = (s: string) => consoleLog(s);
//     }
// }


// console.log = function (...data: any[]) {
//     if (data.length === 1 && typeof data[0] === 'string') {
//         // handle
//         consoleLogCallback(data[0]);
//     } else {
//         consoleLog(...data);
//     }
// }