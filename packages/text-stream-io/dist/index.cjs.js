/**
  * textStreamIo v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var node_fs = require('node:fs');

/**
  * streamIo v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
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

/* eslint-disable prefer-const,class-methods-use-this */
/**
 * @sample
 * ```
 * textstream.file.name="CHANGELO.md"
 * //or
 * textstream.init("CHANGELO.md")
 * await textstream.read()
 * textstream.option.writemode='overide'
 * await textstream.write('')
 * ```
 */

class TextStream {
  constructor(name = 'CHANGELO.md') {
    this.init(name);
  }
  /**
   * read file async (stream mode)
   * @param {string|undefined} def
   * @returns {Prmosie<string>}
   */


  async read(def = '') {
    const {
      file
    } = this;
    let reader;
    let res;

    try {
      reader = node_fs.createReadStream(file.name);
      res = await readStream(reader);
    } catch (error) {
      res = def;
    }

    file.data = res;
    return res;
  }
  /**
   * write file async (stream mode)
   * @param {string} data
   * @returns {Prmosie<void>}
   */


  async write(data) {
    // prefer-const writer,old
    // no-param-reassign data
    // no-fallthrough
    const {
      file,
      option
    } = this;
    let writer;
    let old;
    writer = node_fs.createWriteStream(file.name);
    old = file.data; // insert-head?append?override?
    // let writemode = "override";

    let text;

    switch (option.writemode) {
      case 'override':
        text = `${data}`;
        break;
      // case "head":
      //   text = `${data}\n${old}`;
      //   break;

      case 'append':
        text = `${old}\n${data}`;
        break;
      // case "override":
      //   text = `${data}`;

      case 'head':
        text = `${data}\n${old}`;
        break;

      default:
        text = `${data}`;
        break;
    }

    file.data = text;
    await writeStream({
      stream: writer,
      data: text
    });
  }
  /**
   *
   * @param {string} name
   * @param {string} data
   * @returns {this}
   */


  init(name = 'CHANGELO.md', data = '') {
    this.file = {
      name,
      data
    };
    this.option = {};
    return this;
  }
  /**
   * ceate a new instance
   * @param  {...any} option
   * @returns
   */


  new(...option) {
    return new TextStream(...option);
  }

}

const textstream = new TextStream();

exports.TextStream = TextStream;
exports.textstream = textstream;
