/**
  * runBash v0.0.3
  * (c) 2018-2022 ymc
  * @license MIT
  */
/**
  * runBash v0.0.2
  * (c) 2018-2022 ymc
  * @license MIT
  */
import { exec } from 'child_process';

/**
 * opt to arr-format
 * @description
 * ```
 * str to arr
 * ```
 * @param {string|string[]} cmdOptStr some cmd opt str-format or arr-format
 * @param {string} [splitChar=' '] some string
 * @returns {string[]}
 */
/**
 * opt to str-format
 * @description
 * ```
 * arr to str
 * ```
 * @param {string|string[]} cmdOptStr some cmd opt str-format or arr-format
 * @param {string} [splitChar=' '] some string
 * @returns {string}
 */
const cmdOptArr2cmdOptStr = (cmdOptStr, splitChar = ' ') => {
  return Array.isArray(cmdOptStr) ? cmdOptStr.join(splitChar) : cmdOptStr
};

/**
 * exec wraper
 * @param {string} cmd some cmd
 * @param {object} cmdOpts some cmd opts
 * @param {object} execOpts some exec opts
 * @returns {Promise}
 * @sample
 * ```js
 * await exec(`git`,`--version`,execOpts) //correct
 * await exec(`git`,[`--version`],execOpts) //correct
 * await exec(`git --version`,execOpts) //correct
 * ```
 */
const execWraper = (cmd, cmdOpts, execOpts) => {
  return new Promise((resolve, reject) => {
    //desc: for exec(`git --version`],execOpts)
    if (!execOpts) {
      execOpts = cmdOpts;
      cmdOpts = cmd;
      cmd = '';
    }

    const option = cmdOptArr2cmdOptStr(cmdOpts); //desc: other yuyi to string
    let { exec } = execOpts; //eg:{exec}=require("child_process");

    cmd = cmd ? `${cmd} ${option}` : `${option}`;
    // cmd=`${cmd} ${option}`.trimStart()

    //delete execOpts.exec; //desc:clean some property to keep execOpts as native

    //support exe opt : exec(cmd,execOpts,callback)
    //https://stackoverflow.com/questions/18894433/nodejs-child-process-working-directory
    exec(`${cmd}`, execOpts, (e, stdout, stderr) => {
      if (e) {
        reject(e);
      }
      //case:reject std err and resolve std res
      //if (stderr) {
      //    reject(e);
      //}
      //resolve(stdout)

      //case:resolve std err and res
      resolve({ stdout, stderr });
    });
  })
};

const execOpts = {
  exec: exec
};

export { execWraper as exec, execOpts };
