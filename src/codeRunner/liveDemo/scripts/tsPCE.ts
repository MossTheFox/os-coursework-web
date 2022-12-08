// 整型信号量 生产者-消费者问题

let _in = 0;
let _out = 0;

let bufferLength = 10;

let itemBuffer = new Array<number>(bufferLength).fill(0);

let OUTPUT = ``;
let logChangeCB: ((str: string) => any) | null = (a) => null;
function writeLine(str: string) {
    OUTPUT += str + '\n';
    if (logChangeCB) {
        logChangeCB(OUTPUT);
    }
}

function visualizeBuffer() {
    writeLine(itemBuffer.map((v) => v ? '■' : '□').join(''));
}

const semaphore = {
    mutex: 1,
    empty: bufferLength,
    full: 0
};

function wait(target: keyof typeof semaphore) {
    return new Promise<void>((resolve, reject) => {
        let interval = setInterval(() => {
            if (semaphore[target] > 0) {
                semaphore[target] -= 1;
                clearInterval(interval);
                resolve();
            }
        }, 1);
    });
};

function signal(target: keyof typeof semaphore) {
    // debug
    visualizeBuffer();
    semaphore[target]++;
}

let waitForMS = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
let randomWaitFor = () => waitForMS(Math.floor(Math.random() * 100));

let runnerFlag = false;

async function producer() {
    while (runnerFlag) {
        await randomWaitFor();
        await wait("empty");
        await wait("mutex");
        itemBuffer[_in] = Math.random();
        writeLine('Producer >> ' + _in);
        _in = (_in + 1) % bufferLength;
        signal("mutex");
        signal("full");
    }
}

async function consumer() {
    while (runnerFlag) {
        await randomWaitFor();
        await wait('full');
        await wait('mutex');
        itemBuffer[_out] = 0;
        _out = (_out + 1) % bufferLength;
        writeLine('Consumer >> ' + _out);
        signal('mutex')
        signal('empty');
    }
}



export const tsPCEmuController = {
    run: () => {
        OUTPUT = '';
        runnerFlag = true;
        producer();
        consumer();
    },
    stop: () => {
        runnerFlag = false;
    },
    registerLogChangeCallback: (cb: (str: string) => any) => {
        logChangeCB = cb;
    },
    unregisterLogChangeCallback: () => logChangeCB = null,

};