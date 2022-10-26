/**
  * streamIo v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["stream-io"] = {}));
})(this, (function (exports) { 'use strict';

  function readStream(stream) {
    return new Promise((resolve, reject) => {
      let data = '';
      stream.on('data', chunk => {
        data += chunk.toString();
      }).on('end', () => {
        resolve(data);
      }).on('error', reject);
    });
  }

  function writeStream({
    stream,
    data
  }) {
    return new Promise((resolve, reject) => {
      // write
      stream.write(data, 'utf-8'); // fire end

      stream.end(); // desc-x-s: handle event finish and err

      stream.on('finish', () => {
        resolve(data);
      }).on('error', reject); // desc-x-e: handle event finish and err
    });
  }

  exports.readStream = readStream;
  exports.writeStream = writeStream;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
