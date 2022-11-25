/**
  * gitCommitLogsInfo v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
import '@ymc/run-bash';
import '@ymc/extend-string';
import { jsonstream } from '@ymc/json-stream-io';
import { store } from '@ymc/git-commit-msg-read';

const { log } = console;

/**
 * get loginfo function
 * @param {boolean} enable
 * @returns {()=>void} a function to log info
 */
function getLogInfo(enable) {
    return function (...msg) {
        if (enable) {
            log(...msg);
        }
    }
}
async function main(options = {}) {
    const option = {
        out: `gitlog-info.shim.tmp.json`,
        n: 10,
        logInfo: false,
        logTask: false,
        ...options
    };
    const loginfo = getLogInfo(option.logInfo);
    const logtask = getLogInfo(option.logTask);

    let loc = option.out;
    logtask(`[task] update git commited logs to ${loc}`);
    let o;
    // loginfo('[info] read gitlog')
    if (option.n) {
        loginfo('[info] read the last gitlog');
        store.options.n = option.n; //1 | 5,10,30 | all
    }
    //since-day
    const data = await store.parse();
    // log(data)

    loginfo('[info] store gitlog');
    jsonstream.init(loc);
    o = await jsonstream.read([]);
    let count = 0;
    data.forEach(v => {
        if (!o.some(nv => nv.hash === v.hash)) {
            o.unshift(v);
            count += 1;
        }
    });
    await jsonstream.write(o);
    loginfo(`[info] out: ${loc}`);
    log(`[info] update count: ${count}`);
}

export { main as default };
