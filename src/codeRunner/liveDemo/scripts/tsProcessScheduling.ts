// 进程调度
// 从内存中选择进程交给处理机去执行，就是进程调度的任务。

// 这里采用用最低松弛度算法来决定进程的执行顺序。此算法属于实时调度算法。

/**
 * 最低松弛度优先 (LLF, Least Laxity First) 算法
 * 最紧急的任务最先调度。
 * 
 * 每个任务会有下面几个属性: 
 * - 最晚的完成截止时间 (Deadline)
 * - 本身运行耗时
 * 
 * 系统维护一个当前时间。
 * 松弛度 = (Deadline - CurrentTime - NeededTime)
 */
const calcLax = (now: number, ddl: number, needed: number) => ddl - now - needed;

class Task {
    constructor(
        /** 唯一编号，便于记录所以用字符串记一下 */
        public pid: string,

        /** 创建时间 */
        public issuedAt: number,

        /** 最晚完成时间 */
        public deadline: number,

        /** 运行需要的耗时 */
        public timeNeeded: number,
    ) { };

    getLax() {
        return this.deadline - SYS_CLOCK.current - this.timeNeeded;
    };
};

type SingleTaskConf = {
    timeNeeded: number;
    deadlineFromCreated: number;
};

type IntervalTaskConf = SingleTaskConf & {
    interval: number;
};

type TaskConf = {
    initialTasks: SingleTaskConf[],
    intervalTasks: IntervalTaskConf[];
};

const tasks: Task[] = [];
const intervalTaskSettings: IntervalTaskConf[] = [];

// 系统时钟
class SysClock {

    private _current: number;

    get current() {
        return this._current;
    };
    private set current(int: number) {
        this._current = int;
    };
    constructor() {
        this._current = -1;
    };

    init() {
        this._current = -1;
    };

    goOn() {
        this.current++;
        //////// 在这里指定某一时间刻要加入的新任务 ////////
        // if (this.current % 20 === 0) {
        //     // 添加一个任务 A (每 20ms 一个，执行耗时 10ms，需要在下一个 A 进来之前执行完成)
        //     let newTask = new Task(`A[${Math.floor(this.current / 20) + 1}]`, this.current, this.current + 20, 10);
        //     tasks.push(newTask);
        //     console.log(`新的任务 ${newTask.pid} 加入队列。要求服务时间 ${newTask.timeNeeded}, 最晚截止时间 ${newTask.deadline}`);
        // }
        // if (this.current % 50 === 0) {
        //     // 添加一个任务 B (每 50ms 一个，执行耗时 25ms，需要在下一个 A 进来之前执行完成)
        //     let newTask = new Task(`B[${Math.floor(this.current / 50) + 1}]`, this.current, this.current + 50, 25)
        //     tasks.push(newTask);
        //     console.log(`新的任务 ${newTask.pid} 加入队列。要求服务时间 ${newTask.timeNeeded}, 最晚截止时间 ${newTask.deadline}`);
        // }
        intervalTaskSettings.forEach((v, i) => {
            if (this.current % v.interval === 0) {
                let newTask = new Task(`定时任务 #${i}[${Math.floor(this.current / v.interval) + 1}]`,
                    this.current,
                    this.current + v.deadlineFromCreated,
                    v.timeNeeded);
                tasks.push(newTask);
                console.log(`新的任务 ${newTask.pid} 加入队列。要求服务时间 ${newTask.timeNeeded}, 最晚截止时间 ${newTask.deadline}`);
            }
        });

    }
};
const SYS_CLOCK = new SysClock();

// 初始化初始任务

// ...


// 直接按每毫秒来执行每回合的调度任务
let currentRunningTask: Task | null = null;
let finishedTasks: Task[] = [];

const emuConfig = {
    rerenderCB: () => { },
    intervalMS: 100,
    emuTillMS: 200,
};

function startEmu() {
    SYS_CLOCK.init();
    currentRunningTask = null;
    finishedTasks = [];
    const interval = setInterval(() => {
        if (SYS_CLOCK.current >= emuConfig.emuTillMS) {
            clearInterval(interval);
            return;
        }
        SYS_CLOCK.goOn();

        console.log(`系统时间: ${SYS_CLOCK.current}`);
        if (tasks.length === 0) {
            console.log('当前没有待执行的任务。');
        } else {
            // 没有正在执行的任务，就拿松弛度最小的出来执行
            if (!currentRunningTask) {
                console.log('选取新的任务: 当前任务列表 (按 松弛度大小 排序)');
                tasks.sort((a, b) => a.getLax() - b.getLax());
                for (const t of tasks) {
                    console.log(`${t.pid}, ddl: ${t.deadline}, need: ${t.timeNeeded}, issuedAt: ${t.issuedAt}. Lax: ${t.getLax()}`);
                }
                currentRunningTask = tasks[0];
            } else {
                // 有正在执行的任务，留意有无其他任务的松弛度变为了 0
                let emergencyTasks = tasks.filter((v) => v.getLax() <= 0);
                emergencyTasks.sort((a, b) => a.getLax() - b.getLax());
                let emergencyTask = emergencyTasks[0];
                // TODO: -1 cb
                if (emergencyTask && emergencyTask.getLax() < 0) {
                    console.log(`出现松弛度为负数的任务，将无法按预期完成。\n模拟提前结束。`);
                    emuConfig.rerenderCB();
                    clearInterval(interval);
                    return;
                }
                if (emergencyTask && emergencyTask !== currentRunningTask) {
                    // 切换
                    console.log(`等待状态的任务 ${emergencyTask.pid} 松弛度变为 0，切换之。`);
                    currentRunningTask = emergencyTask;
                }
            }

            // 执行...
            currentRunningTask.timeNeeded--;
            console.log(`执行: ${currentRunningTask.pid}, 剩余时间: ${currentRunningTask.timeNeeded}, 松弛度: ${currentRunningTask.getLax()}`);
            if (currentRunningTask.timeNeeded === 0) {
                console.log(`已完成任务 ${currentRunningTask.pid}.`);
                tasks.splice(tasks.findIndex((v) => v === currentRunningTask), 1);
                finishedTasks.push(currentRunningTask);
                currentRunningTask = null;
            }
        }

        // Rerender...
        emuConfig.rerenderCB();

        console.log('-+-+-+-+-+-+-+-+-+-');
    }, emuConfig.intervalMS);

    return () => clearInterval(interval);
}

export const tsProcessSchedulingEmuController = {
    clearIntervalFunc: () => { },

    registerRerenderHandler(fn: () => any) {
        emuConfig.rerenderCB = fn;
    },
    stop() {
        this.clearIntervalFunc();
        emuConfig.rerenderCB = () => { };

        emuConfig.intervalMS = 100;
        intervalTaskSettings.splice(0, intervalTaskSettings.length);
        tasks.splice(0, tasks.length);

    },
    start(taskConf: TaskConf, intervalMS = 100, emuTillMS = 200) {
        emuConfig.intervalMS = intervalMS;
        emuConfig.emuTillMS = emuTillMS;
        // init data...
        tasks.splice(0, tasks.length);
        taskConf.initialTasks.forEach((v, i) => {
            tasks.push(new Task(`任务 #${i}`, 0, v.deadlineFromCreated, v.timeNeeded));
        });
        intervalTaskSettings.splice(0, intervalTaskSettings.length);
        intervalTaskSettings.push(...taskConf.intervalTasks);

        this.clearIntervalFunc = startEmu();
    },
    getCurrentState() {
        return ({
            taskQueue: tasks,
            finishedTasks,
            currentRunningTask
        });
    }
};

export {
    Task as ProcessSchedulingTask,
}

export type {
    SingleTaskConf,
    IntervalTaskConf,
};