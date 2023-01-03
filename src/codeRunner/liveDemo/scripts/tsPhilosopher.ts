// 管程 (Monitor) 解决哲学家进餐问题
// 注意: 是对 哲学家 设置信号量，非对筷子
// 参考: https://blog.forec.cn/2016/11/24/os-concepts-6/

let randomTickSpeedRate = 10;

let waitForMS = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
let randomWaitFor = () => waitForMS(Math.floor(Math.random() * 100 * randomTickSpeedRate));

/** 哲学家数量 */
const PHI_COUNT = 12;

/** 全局停止标记 */
let STOPPED = false;

/**
 * 这里我们对哲学家问题进行一下简化，可以让代码中不出现 "筷子" 本身：
 *  - 每个哲学家只可以在其 左右侧 俩人没有进餐时进餐
 * 
 * 由此，我们只需要维护一群哲学家本身的状态即可。
 */

const phiSelf = new Array<{ getHungryController: () => void, wait: () => void, signal: () => void, status: 'waiting' | 'active' }>();
for (let i = 0; i < PHI_COUNT; i++) {
    phiSelf.push({
        status: 'active',
        /**
         * 哲学家本身会负责随机在某一个时刻变成饥饿状态、或是在进餐过程中随机在某一个时刻放下筷子。
         */
        async getHungryController() {
            while (true) {
                await randomWaitFor();
                if (STOPPED) return;
                if (phiMonitor.phiStatus[i] === 'thinking') {
                    phiMonitor.pickUp(i);
                }
                if (phiMonitor.phiStatus[i] === 'eating') {
                    phiMonitor.putDown(i);
                }
            }
        },
        wait() {
            this.status = 'waiting'
        },
        async signal() {
            if (STOPPED) return;
            if (this.status === 'waiting') {
                this.status = 'active';
                phiMonitor.pickUp(i)
            }
        }
    });
}

let consoleLogFn = (s: string) => console.log(s);

const phiMonitor = {
    phiStatus: new Array<'thinking' | 'hungry' | 'eating'>(PHI_COUNT).fill('thinking'),

    printStatus() {
        let str = '';
        for (const stat of this.phiStatus) {
            switch (stat) {
                case 'eating':
                    str += 'E';
                    break;
                case 'hungry':
                    str += 'H';
                    break;
                case 'thinking':
                    str += '-';
                    break;
            }
        }
        consoleLogFn(str);
    },

    async pickUp(i: number) {
        if (STOPPED) return;
        this.phiStatus[i] = 'hungry';
        // test
        this.test(i);
        if (this.phiStatus[i] !== 'eating') {
            phiSelf[i].wait();
        }
        this.printStatus();
    },

    async putDown(i: number) {
        if (STOPPED) return;
        this.phiStatus[i] = 'thinking';
        this.printStatus();
        this.test((i + 1) % PHI_COUNT);
        this.test((i + PHI_COUNT - 1) % PHI_COUNT);
    },

    test(i: number) {
        if (this.phiStatus[(i + PHI_COUNT - 1) % PHI_COUNT] !== 'eating'
            && this.phiStatus[(i + 1) % PHI_COUNT] !== 'eating') {
            this.phiStatus[i] = 'eating';
            phiSelf[i].signal();
        }
    }
};

export const tsPhiEmuController = {
    registerConsoleLogCallback: (fn: (s: string) => void) => {
        consoleLogFn = fn;
    },
    unregisterConsoleLogCallback: () => {
        consoleLogFn = (s: string) => console.log(s);
    },
    start: () => {
        STOPPED = false;
        // 开始
        phiSelf.forEach((v, i) => {
            v.getHungryController();
        });
    },
    stop: () => {
        STOPPED = true;
    },
    setSpeedRate: (num: number) => {
        if (num < 0) {
            randomTickSpeedRate = 10;
            return;
        }
        randomTickSpeedRate = num;
    },
};