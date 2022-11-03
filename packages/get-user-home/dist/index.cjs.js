/**
  * getUserHome v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
'use strict';

/**
 * get user home through process.env and process.platform
 * @returns
 */
function getUserHome() {
  return process.env[process.platform == 'win32' ? 'USERPROFILE' : 'HOME'];
}

module.exports = getUserHome;
