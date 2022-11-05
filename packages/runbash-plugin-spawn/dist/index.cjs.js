/**
  * runbashPluginSpawn v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
'use strict';

var node_child_process = require('node:child_process');

/* eslint-disable max-len */

function isString(s) {
  return typeof s === 'string';
}

function str2arr(s, sc = ' ') {
  return s.split(sc);
}
/**
 * @param {string} executable
 * @param {string|string[]} args
 * @param {import('child_process').SpawnOptions} opts
 * @return {Promise<number>} return code
 * @sample
 * ```
 * await runps('powershell', ['-executionpolicy', 'unrestricted', `Get-FileHash ${file.name} -Algorithm SHA256`])
 * await runps('powershell', ['-executionpolicy', 'unrestricted', '-file', 'script.tmp.ps1'])
 * ```
 * */


async function main(executable, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const option = isString(opts) ? str2arr(opts, ' ') : opts;
    const child = node_child_process.spawn(executable, args, {
      shell: true,
      // stdio: ["pipe", process.stdout, process.stderr],
      stdio: 'inherit',
      ...option
    });
    child.on('error', reject);
    child.on('exit', code => {
      if (code === 0) {
        resolve(code);
      } else {
        const e = new Error(`Process exited with error code ${code}`);
        e.code = code;
        reject(e);
      }
    });
  });
}

module.exports = main;
