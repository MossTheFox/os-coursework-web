// 作业调度
// 作业调度是选择作业装入内存成为进程, 而进程调度则是选择哪些内存中的进程进行执行
// 此处为作业调度的模拟实现。作业调度是决定装入内存的顺序的调度方式。

// 调度算法采用 高响应比优先调度算法 (Highest Response Ratio Next, HRRN)

/**
 * HRRN, Highest Response Ratio Next
 *  Priority:
 *      P = (awaited time + requested time) / requested time
 *  Response Rate:
 *      R_p = P
 */
const calcP = (awaitedTime: number, requstedTime: number) => (awaitedTime + requstedTime) / requstedTime;

// 下面是模拟的一系列作业任务
class Job {
    id: number;
    requestedTime: number;
    hasWaitedFor: number;

    constructor(id: number, reqTime: number, hasWaitedFor = 0) {
        this.id = id;
        this.requestedTime = reqTime;
        this.hasWaitedFor = hasWaitedFor;
    };

    getPrior() {
        return calcP(this.hasWaitedFor, this.requestedTime);
    }
};

const jobs: Job[] = [];

// 测试数据
// for (let i = 0; i < 10; i++) {
//     const newJob = new Job(i, 1 + Math.floor(Math.random() * 30));
//     jobs.push(newJob);
// }

// console.log(jobs);

let currentJob: Job | null = null;

let onChangeCB = () => { };
let intervalSet = 1000;

function startEmu() {
    const interval = setInterval(() => {
        if (currentJob) {
            // 已有作业将会需要等待当前作业的完成时间
            jobs.forEach((v) => v.hasWaitedFor += currentJob!.requestedTime);
            // 删掉完成的这个
            jobs.shift();
        }
        currentJob = null;

        if (jobs.length === 0) {
            console.log('所有作业调度已完成。');
            onChangeCB();
            clearInterval(interval);
            return;
        }

        // 按优先级从大到小排序
        jobs.sort((a, b) => b.getPrior() - a.getPrior());

        console.log('当前作业按优先级排序: ');
        for (const j of jobs) {
            console.log(`- #${j.id} (awaited: ${j.hasWaitedFor}, requestFor: ${j.requestedTime}, Prior: ${j.getPrior().toFixed(2)})`);
        }

        // 抽出当前将调度的作业 (别急着删，每回合开头删)
        const curr = jobs[0];
        currentJob = curr;
        console.log(`作业 #${curr.id} 被调入内存 (已等待时间: ${curr.hasWaitedFor}, 要求服务时间: ${curr.requestedTime});`);

        // 到开头那边继续

        // rerender...
        onChangeCB();

        console.log('-+-+-+-+-+-+-+-+-+-');

    }, intervalSet);
    return () => clearInterval(interval);
};

export const tsJobSchedulingEmuController = {
    clearCurrentEmuFunc: () => { },
    stop() {
        this.clearCurrentEmuFunc();
        // 注销 hook
        onChangeCB = () => { };
    },

    registerOnChangeHook(cb: () => any) {
        onChangeCB = cb;
    },

    getCurrentStatus() {
        return {
            jobList: jobs,
            active: currentJob
        };
    },

    /** 会返回 JobList, 留意初始化 */
    start(jobList: number[], intervalSettingMS = 1000) {
        // clear arr
        jobs.splice(0, jobs.length);
        intervalSet = intervalSettingMS;
        jobList.forEach((v, i) => {
            jobs.push(new Job(i, v));
        });
        this.clearCurrentEmuFunc = startEmu();
        return jobs;
    }
};

export {
    Job as JobSchedulingEmuJob
};
