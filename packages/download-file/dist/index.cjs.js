/**
  * downloadFile v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
'use strict';

var node_fs = require('node:fs');
var node_https = require('node:https');

const {
  log
} = console;

function isString(s) {
  return typeof s === 'string';
}

function isFunction(s) {
  return typeof s === 'function';
}
/**
 *
 * @param {string} likepath
 * @param {{split:string}} option
 */


function getDirLoc(likepath, option = {}) {
  const {
    split,
    splitReg
  } = {
    splitReg: /\/|\\/,
    split: '/',
    ...option
  };
  let list = likepath.split(splitReg || split);
  const {
    length
  } = list;

  if (length > 1) {
    list = list.slice(0, length - 1);
    list = list.join(split);
  } else {
    list = '';
  }

  return list;
}

/**
 *
 * @param {showProgressNextOption} option
 */


function showProgressNext(option) {
  const {
    file,
    cur,
    len,
    total
  } = option;
  const progress = (100.0 * cur / len).toFixed(2);
  const downloadedSize = (cur / 1048576).toFixed(2);
  const totalSize = total.toFixed(2);
  const msg = `[process] downloading ${file} - ${progress} % (${downloadedSize} MB ) of total size: ${totalSize}MB`;
  log(msg);
}
/**
 *
 * @param {showProgressNextOption} option
 * @returns {showProgressNextOption}
 */


function initProgressState(option = {}) {
  const {
    len
  } = option; // const len = parseInt(response.headers["content-length"], 10);

  const total = len / 1048576; // 1048576 - bytes in 1 Megabyte

  return { ...option,
    len,
    cur: 0,
    total
  };
}
/* eslint-disable no-param-reassign */

/**
 *
 * @param {string} chunk
 * @param {showProgressNextOption} option
 * @returns {showProgressNextOption}
 */


function calcProgressState(option, chunk) {
  option.cur += chunk.length;
  return option;
}

/* eslint-disable no-unused-vars */

function makeTargetFileDir(targetFile) {
  const loc = getDirLoc(targetFile);

  if (loc && loc !== '.' && loc !== '..') {
    node_fs.mkdirSync(loc, {
      recursive: true
    });
  }
}
/**
 * save downloaded file
 * @param {saveFileThroughStreamOption} option
 */


function saveFileThroughStream(option) {
  const {
    response,
    data,
    stream,
    targetFile,
    resolve
  } = option;
  let fileWriter;

  if (!stream) {
    // feat: make targetFile loc
    makeTargetFileDir(targetFile); // feat: create writestream when passed file loctation and not stream

    fileWriter = node_fs.createWriteStream(targetFile);
  } else {
    fileWriter = stream;
  }

  fileWriter.on('finish', () => {
    // resolve({})
    // desc: reslove data when reponse finish saving to file
    resolve(data);
  });
  response.pipe(fileWriter);
}

/* eslint-disable no-unused-vars */
/**
 * Download a file from the given `url` into the `targetFile`.
 *
 * @param {String} url
 * @param {donwloadFileOption} options
 * @returns {Promise<void>}
 * @description
 * ```
 * ## feat
 * - [x] request with url
 * - [x] download file with option = targetFile
 * - [x] download file with option.targetFile
 * - [x] override file with option.overideTargetFile
 * - [x] custom request with option.cutomRequest
 *
 * ## idea
 * - [x] overide function args
 * - [x] write target file or not
 * - [x] overide target file or not
 * ```
 */

async function downloadFile(url, options = {}) {
  let option; // feat: downloadFile(url,targetFile)
  // feat: downloadFile(url,option)

  if (isString(options)) {
    option = {
      targetFile: options
    };
  } else {
    option = { ...options
    };
  }

  const {
    targetFile,
    overideTargetFile
  } = option; // desc: save file when option.targetFile and option.overideTargetFile
  // feat: save target file or not
  // feat: overide target file or not

  if (!overideTargetFile && node_fs.existsSync(targetFile)) {
    log(`[info] target file ${targetFile} exsits`);
    return;
  } // desc: set path param (todo)
  // desc: set headers (todo)


  return await new Promise((resolve, reject) => {
    let request = node_https.request;

    if (isFunction(option.customRequest)) {
      request = option.customRequest;
    } // request(url, cb)
    // request(url, option,cb)
    // request(option,cb)
    // log(option,url)
    // process.exit(0)


    const req = request(url, option, response => {
      // log(option)
      const code = response.statusCode ?? 0; // log(code, response.statusMessage);

      if (code >= 400) {
        // feat: info reponse code and msg when 4xx
        log('[info] get response state'); // log(response)

        log(code, response.statusMessage); // method,path,host,protocol

        return reject(new Error(response.statusMessage));
      } // Error: Not Found
      // feat: handle redirects when code is 3xx


      if (code > 300 && code < 400 && !!response.headers.location) {
        return downloadFile(response.headers.location, targetFile);
      }

      const progressOption = initProgressState({
        len: parseInt(response.headers['content-length'], 10),
        file: targetFile || response.url
      });
      let data = ''; // desc: show progress when reponse recive data

      response.on('data', chunk => {
        calcProgressState(progressOption, chunk); // cur += chunk.length;

        option.showProgress && showProgressNext(progressOption);
        data += chunk;
      }); // desc: show donwload complete msg when reponse recive data success
      // desc: reslove data when reponse recive data success + not save to file

      response.on('end', () => {
        option.showProgress && log('[process] download complete');

        if (!targetFile) {
          resolve(data);
        }
      }); // feat: save file to disk through stream

      if (targetFile) {
        saveFileThroughStream({
          targetFile,
          resolve,
          response,
          data
        }); // const fileWriter = createWriteStream(targetFile).on(
        //     "finish",
        //     () => {
        //         // resolve({})
        //         // desc: reslove data when reponse finish saving to file
        //         resolve(data);
        //     }
        // );
        // response.pipe(fileWriter);
      }
    }).on('error', error => {
      reject(error);
    }); // feat: support body parameters\n\nwith option.data when option.Method is POST,PUT,PATCH
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST

    if (option.data) {
      req.write(option.data);
    }

    req.end();
  });
} // export { downloadFile };
// node lib/download-file.js

module.exports = downloadFile;
