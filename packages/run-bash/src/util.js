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
export const cmdOptStr2cmdOptArr = (cmdOptStr, splitChar = ' ') =>
  Array.isArray(cmdOptStr) ? cmdOptStr : cmdOptStr.split(splitChar)
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
export const cmdOptArr2cmdOptStr = (cmdOptStr, splitChar = ' ') =>
  Array.isArray(cmdOptStr) ? cmdOptStr.join(splitChar) : cmdOptStr

/**
 * exec wraper
 * @param {string} cmd some cmd
 * @param {object} cmdOpts some cmd opts
 * @param {object} execOpts some exec opts
 * @returns {Promise}
 */
export const execWraper = (cmd, cmdOpts, execOpts) =>
  new Promise((resolve, reject) => {
    const cmdList = cmdOptArr2cmdOptStr(cmdOpts)
    // eg:{exec}=require("child_process");
    const { exec } = execOpts
    // support exe opt : exec(cmd,execOpts,callback)
    // https://stackoverflow.com/questions/18894433/nodejs-child-process-working-directory
    // delete execOpts.exec;
    exec(`${cmd} ${cmdList}`, execOpts, (e, stdout, stderr) => {
      if (e) {
        reject(e)
      }
      // case:reject std err and resolve std res
      // if (stderr) {
      //    reject(e);
      // }
      // resolve(stdout)

      // case:resolve std err and res
      resolve({ stdout, stderr })
    })
  })
export default execWraper
