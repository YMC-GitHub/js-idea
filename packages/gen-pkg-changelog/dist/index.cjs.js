/**
  * genPkgChangelog v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
'use strict';

require('node:child_process');
var node_fs = require('node:fs');

/**
  * renderTpl v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */

/** @typedef {{[string]:string|boolean|number|undefined}} data */

/**
 * @param {string} tpl
 * @param {data} data
 * @returns {Stringimport("typescript").LiteralLike}
 */
function renderTpl(tpl, data) {
  let res = tpl;
  Object.keys(data).forEach(key => {
    const value = data[key];
    res = res.replace(new RegExp(`{${key}}`, 'ig'), value);
  });
  return res;
}
/**
 *
 * @param {string} tpl
 * @param {data} data
 * @returns {string|(data:data)=>string}
 * @sample
 * ```
 * writeTpl('{method} repo/owner',{method:'POST'}) //POST repo/owner
 * ```
 */


function writeTpl(tpl, data) {
  if (data) {
    return renderTpl(tpl, data);
  }

  return v => renderTpl(tpl, v);
}

/**
  * changlogStyle v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
/* eslint-disable  no-unused-vars */

function pluginList(pluginOpt = {}) {
  return ctx => {
    const {
      data,
      option
    } = ctx;
    const body = data.map((item, index) => ctx.writeTpl('- {commit} {subject}', item)).join('\n');
    let res = '';
    const meniefest = data;

    if (meniefest.length > 0) {
      res = ctx.writeTpl('<a name="{version}"></a>\n# {version}({date})\n### {libname}\n{changes}', {
        date: meniefest[0].date,
        changes: body
      });
      ctx.result = res;
    }

    return res;
  };
}
/* eslint-disable  no-unused-vars,no-param-reassign */

/**
 * get md table head with keys with align
 * @param {string} keys
 * @param {string} align
 * @returns {string}
 * @sample
 * ```
 * getHeadByKeys('commit|type|desciption', 'l')
 * ```
 */


function getHeadByKeys(keys, align = 'l') {
  let res = '';
  const head = keys;
  const hs = head.split('|').map(() => {
    let exp = '';

    switch (align) {
      case 'm':
      case 'center':
        exp = ':----:';
        break;

      case 'r':
      case 'right':
        exp = '----:';
        break;

      case 'l':
      case 'left':
      default:
        exp = ':----';
        break;
    }

    return exp;
  }).join('|');
  res = `${head}\n${hs}`;
  return res;
} // [{commit}]({repo}/commit/{hash})|{type}|{subject}({issue})


function pluginMarkdowntable(pluginOpt = {}) {
  return ctx => {
    const {
      data,
      option
    } = ctx;
    let meniefest;
    meniefest = data.map(item => {
      const obj = { ...item
      };
      let {
        issue
      } = obj;

      if (issue && issue.length > 0) {
        issue = issue.filter(v => v);
        obj.issue = issue.map(ic => ctx.writeTpl('[#{issue}]({repo}/pull/{issue})', {
          issue: ic.trim().replace(/^#/, '')
        })).join(',');
      } else {
        obj.issue = '';
      }

      return obj;
    }); // ctx.data = data;
    // render subject

    meniefest = meniefest.map((item, index) => {
      const obj = { ...item
      };
      const {
        issue
      } = obj;

      if (issue.length > 0) {
        obj.subject = ctx.writeTpl('{subject}({issue})', obj);
      } else {
        obj.subject = ctx.writeTpl('{subject}', obj);
      }

      return obj;
    });
    meniefest = meniefest.map((item, index) => {
      const obj = { ...item
      };
      obj.commit = ctx.writeTpl('[{commit}]({repo}/commit/{hash})', { ...obj // ...github,

      });
      return obj;
    }); // option.tpl = `{hash}|{type}|{subject}`;
    // let body = ctx.renderLine().join("\n");

    const body = meniefest.map(line => ctx.writeTpl('{commit}|{type}|{subject}', line) // ...line, ...github }
    ).join('\n');
    const head = getHeadByKeys('commit|type|desciption', 'l');
    const table = `${head}\n${body}\n\n`;
    let res = '';
    const whtpl = '<a name="{version}"></a>\n# {version}({date})\n### {libname}\n{changes}';

    if (meniefest.length > 0) {
      res = ctx.writeTpl(whtpl, {
        date: meniefest[0].date,
        changes: table
      });
      ctx.result = res;
    }

    return res;
  };
}
/* eslint-disable class-methods-use-this */
// cls-plugin-mdlist
// cls-plugin-mdtable
// def-plugin
// run-plugin

/** @typedef {{style:string}} option */

/**
 * @sample
 * ```
 * //
 * chaneglog.data=[]
 * changelog.option={}
 * changelog.render()
 * ```
 */


class ChangelogStyle {
  constructor() {
    this.init();
  }

  init() {
    /** @type {option} */
    this.option = {};
    this.data = [];
    this.result = '';
    this.plugin = [];
    return this;
  }
  /**
   * bind write tpl to ctx
   * @param {string} tpl
   * @param {{}} data
   * @returns
   */


  writeTpl(tpl, data) {
    return writeTpl(tpl, data);
  }
  /**
   * redner with option.style or ctx.plugin
   * @returns {string}
   */


  render() {
    const ctx = this; // render with style and built in plugin

    const {
      option
    } = this;

    switch (option.style.toLowerCase()) {
      case 'list':
        return pluginList({})(ctx);

      case 'table':
        return pluginMarkdowntable({})(ctx);
    } // render with plugin list


    const {
      plugin
    } = this;

    for (let index = 0; index < plugin.length; index += 1) {
      const fn = plugin[index];
      fn(ctx);
    }

    return this.result;
  }

}

const changelogstyle = new ChangelogStyle();
changelogstyle.plugin = [pluginMarkdowntable()];

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

/**
  * textStreamIo v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
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

new TextStream();

/**
  * changlogFileIo v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */

class ChanelogFile extends TextStream {
  constructor(name = 'CHANGELO.md') {
    super();
    this.init(name);
  }

  getLastCommitLabel(fReg = /\[[0-9a-z]{9}\]/gi, rReg = /^\[|\]$/gi) {
    const {
      file
    } = this;
    const match = file.data.match(fReg);
    let res = '';

    if (match) {
      [res] = match;
    }

    res = res.replace(rReg, ''); // log(match,res)

    return res;
  }

  init(name = 'CHANGELO.md') {
    this.file = {
      name,
      data: ''
    };
    this.option = {};
  }

}

const changelogfile = new ChanelogFile();

/**
  * extendString v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
/**
 *
 * @param {*} s
 * @returns {string}
 * @sample
 * ```
 * humanize('per_page')// Per page
 * humanize('per-page')// Per page
 * ```
 * @description
 * ```
 * ## idea
 * - [x] replace multi - or _ to one space
 * - [x] add space to the char that is uppercase and is not the first index
 * - [x] the first char to upper ,other lowercase
 * ```
 */


function humanize(s) {
  return s.replace(/(?:^\w|[A-Z_-]|\b\w)/g, (word, index) => {
    let res = ''; // log(word, index); //desc: for debug
    // feat: replace multi - or _ to one space

    res = word.replace(/[-_]+/g, ' '); // feat: add space to the char that is uppercase and is not the first index

    res = index !== 0 ? res.replace(/[A-Z]/, ' $&') : res; // feat: the first char to upper ,other lowercase

    return index === 0 ? res.toUpperCase() : res.toLowerCase();
  }).replace(/\s+/g, ' ');
}

function camelize(s) {
  return humanize(s).replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => index === 0 ? word.toLowerCase() : word.toUpperCase()).replace(/\s+/g, '');
}

/**
  * jsonStreamIo v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
/**
 * @sample
 * ```
 * jsonstream.file.name="package.json"
 * //or
 * jsonstream.init("package.json")
 * await jsonstream.read()
 * await jsonstream.write({})
 * ```
 */

class JsonStream {
  constructor(name, data) {
    this.init(name, data);
  }
  /**
   * read file async (stream mode)
   * @param {{}|[]} def
   * @returns {Prmosie<json>}
   */


  async read(def = {}) {
    const {
      file
    } = this;
    let reader;
    let res;

    try {
      reader = node_fs.createReadStream(file.name);
      res = await readStream(reader);
      res = JSON.parse(res);
    } catch (error) {
      // console.log(error);
      res = def;
    }

    file.data = res;
    return res;
  }
  /**
   * write file async (stream mode)
   * @param {{}|[]|undefined} data
   * @returns {Prmosie<void>}
   */


  async write(data) {
    // no-param-reassign data
    // no-unused-vars option

    /* eslint-disable no-unused-vars */
    const {
      file,
      option
    } = this; // eslint-disable-line

    let writer;
    let content = data;

    try {
      writer = node_fs.createWriteStream(file.name);

      if (data) {
        file.data = data;
      } else {
        content = file.data;
      }

      await writeStream({
        stream: writer,
        data: JSON.stringify(content, null, 2)
      });
    } catch (error) {}
  }

  init(name = 'package.json', data = {}) {
    this.file = {
      name,
      data
    };
    this.option = {};
  }
  /* eslint-disable class-methods-use-this */


  new(...option) {
    return new JsonStream(...option);
  }

}

const jsonstream = new JsonStream();

/**
  * mockPath v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */

/* eslint-disable prefer-const */
// https://nodejs.org/api/path.html
// const path = {}
// path.sep = '/'
// let defSep = '/'

/**
 * mock node.js path.dirname
 * @param {string} wkd
 * @returns {string}
 */
function dirname(wkd) {
  const sep = dirname.sep ? dirname.sep : '/';
  const list = wkd.split(/\/?\\|\//); // if ((list.length = 1)) return list.join(sep)

  return list.slice(0, list.length - 1).join(sep);
}
/**
 * mock node.js path.basename
 * @param {string} wkd
 * @param {string} [suffix] an optional suffix to remove
 * @returns {string}
 */


function basename(wkd, suffix) {
  const list = wkd.split(/\/?\\|\//);
  const res = list[list.length - 1];
  if (!suffix) return res;
  return res.replace(new RegExp(`${suffix}$`), '');
}

const {
  log: log$1
} = console;
/**
 * get lib name with working dir
 * @param {string} wkd
 * @param {{trim?:boolean,camelize?:boolean}} option
 * @returns
 */

function getLibNameFromPath(wkd, option = {}) {
  let res = basename(wkd);
  const opt = {
    trim: true,
    ...option
  };

  if (opt.trim) {
    res = res.trim();
  }

  if (opt.camelize) {
    res = camelize(res);
  }

  return res;
}
/**
 * get lib dir with working dir
 * @param {string} wkd
 * @returns
 */


function getPackagesLocFromPath(wkd) {
  return dirname(wkd);
}
/**
 *
 * @param {string} loc
 * @param {{}} def
 * @returns data
 * @description
 * ```
 * warn: need to fix when json with bom
 * ```
 */


function readJsonSync(loc, def = {}) {
  let data;

  try {
    data = node_fs.readFileSync(loc);
    data = JSON.parse(data);
  } catch (error) {
    data = def;
  }

  return data;
}

/**
 * get loginfo function
 * @param {boolean} enable
 * @returns {()=>void} a function to log info
 */


function getLogInfo$1(enable) {
  return function (...msg) {
    if (enable) {
      log$1(...msg);
    }
  };
}

//@ymc/git-commit-msg-template
//get-git-commit-msg-template

/**
 * get angular style commit-msg template
 * @param {{}} data
 * @returns {string}
 */
function getAngularStyleTpl(data) {
  let tpl = ''; // tpl = `{type}`

  if (data.type) {
    tpl = '{type}';
  }

  if (data.scope) {
    tpl = `${tpl}({scope})`;
  }

  if (data.type || data.scope) {
    tpl = `${tpl}: {subject}`;
  }

  if (data.body) {
    tpl = `${tpl}\n\n{body}`;
  }

  if (data.foot || data.issue) {
    tpl = `${tpl}\n\n`;
  }

  if (data.issue) {
    tpl = `${tpl}{issue}\n`;
  }

  if (data.foot) {
    tpl = `${tpl}{foot}`;
  }

  return tpl;
}

function pluginRootList(pluginOpt = {}) {
  return ctx => {
    const {
      data,
      option
    } = ctx;
    let meniefest;
    meniefest = data.map(item => {
      const obj = { ...item
      };
      let {
        issue
      } = obj;
      let link;
      const mdlink = '[#{issue}]({repo}/pull/{issue})';
      link = mdlink;

      if (issue && issue.length > 0) {
        issue = issue.filter(v => v);
        obj.issue = issue.map(ic => ctx.writeTpl(link, {
          issue: ic.trim().replace(/^#/, '')
        })).join(',');
      } else {
        obj.issue = '';
      }

      return obj;
    }); // ctx.data = data;
    // render subject

    meniefest = meniefest.map((item, index) => {
      const obj = { ...item
      };
      const {
        issue
      } = obj;

      if (issue.length > 0) {
        obj.subject = ctx.writeTpl('{subject}({issue})', obj);
      } else {
        obj.subject = ctx.writeTpl('{subject}', obj);
      }

      return obj;
    }); // format subject length
    // let max = Math.max(...meniefest.map(line => line.subject.length))
    // //  ''.padEnd(max < 120 ? 120 : max, ' ')
    // let limitedmax = 130
    // max = max < limitedmax ? limitedmax : max
    // meniefest = meniefest.map((item, index) => {
    //     // item.subject = item.subject.padEnd(max, ' ') //&nbsp;
    //     if (item.subject.length < max) {
    //         let count = max - item.subject.length
    //         item.subject = item.subject.replace(/$/, Array(count).fill('&nbsp;').join('')) //'&nbsp;|' '
    //     }
    //     return item
    // })

    meniefest = meniefest.map((item, index) => {
      const obj = { ...item
      }; // feat: add link tips to commit id
      // desc: escape html new line with Entity Name or Entity Code
      // https://mateam.net/html-escape-characters/

      let inlinebody;
      inlinebody = getAngularStyleTpl(obj); // feat: fix body when body is empty when commiting
      // which leads body includes subject in gitlog-parses

      if (obj.body.indexOf(obj.subject) >= 0) obj.body = '';
      inlinebody = ctx.writeTpl(inlinebody, { ...obj
      });
      inlinebody = inlinebody.replace(/\r?\n/gi, '&#10;'); // obj.inlinebody = obj.body.replace(/\r?\n/gi, '&#10;') //&NewLine;|&#10;

      obj.inlinebody = inlinebody; // markdown link expression

      let link;
      const mdlink = '[{commit}]({repo}/commit/{hash} "{inlinebody}")';
      link = mdlink;
      obj.commit = ctx.writeTpl(link, { ...obj // ...github,

      });
      return obj;
    }); // tpl,dat

    let itemtpl;
    itemtpl = '- {commit} {subject}';
    itemtpl = '- [{commit}]({repo}/commit/{hash}) {subject}';
    itemtpl = '- [{commit}]({repo}/commit/{hash}) - {type} - {subject}';
    itemtpl = '- [{commit}]({repo}/commit/{hash}) - {type} - {subject}';
    itemtpl = '- {commit} - {type} - {subject}';
    itemtpl = '- {subject} - {type} - {commit}';
    itemtpl = '- {type} - {subject} - {commit}';
    itemtpl = '- {type}: {subject} - {commit}';
    const body = meniefest.map((item, index) => ctx.writeTpl(itemtpl, item)).join('\n');
    let titletpl = '<a name="{version}"></a>\n\n## {libname} {version}({date}) \n{changes}';
    titletpl = '<a name="{version}">\n\n## {libname} {version}({date})</a> \n{changes}';
    let res = '';

    if (meniefest.length > 0) {
      res = ctx.writeTpl(titletpl, {
        date: meniefest[0].date,
        changes: body
      });
      ctx.result = res;
    }

    return res;
  };
}
/**
 * get md table head with keys with align
 * @param {string} keys
 * @param {string} align
 * @returns {string}
 * @sample
 * ```
 * getHeadByKeys('commit|type|desciption', 'l')
 * ```
 */


function getMarkdownTableHeadByKeys(keys, align = 'l') {
  let res = '';
  const head = keys;
  const hs = head.split('|').map(() => {
    let exp = '';

    switch (align) {
      case 'm':
      case 'center':
        exp = ':----:';
        break;

      case 'r':
      case 'right':
        exp = '----:';
        break;

      case 'l':
      case 'left':
      default:
        exp = ':----';
        break;
    }

    return exp;
  }).join('|');
  res = `${head}\n${hs}`;
  return res;
}

function pluginRoottable(pluginOpt = {}) {
  return ctx => {
    const {
      data,
      option
    } = ctx;
    let meniefest;
    meniefest = data.map(item => {
      const obj = { ...item
      };
      let {
        issue
      } = obj;
      let link;
      const mdlink = '[#{issue}]({repo}/pull/{issue})';
      link = mdlink;

      if (issue && issue.length > 0) {
        issue = issue.filter(v => v);
        obj.issue = issue.map(ic => ctx.writeTpl(link, {
          issue: ic.trim().replace(/^#/, '')
        })).join(',');
      } else {
        obj.issue = '';
      }

      return obj;
    }); // ctx.data = data;
    // render subject

    meniefest = meniefest.map((item, index) => {
      const obj = { ...item
      };
      const {
        issue
      } = obj;

      if (issue.length > 0) {
        obj.subject = ctx.writeTpl('{subject}({issue})', obj);
      } else {
        obj.subject = ctx.writeTpl('{subject}', obj);
      }

      return obj;
    }); // format subject length
    // let max = Math.max(...meniefest.map(line => line.subject.length))
    // //  ''.padEnd(max < 120 ? 120 : max, ' ')
    // let limitedmax = 130
    // max = max < limitedmax ? limitedmax : max
    // meniefest = meniefest.map((item, index) => {
    //     // item.subject = item.subject.padEnd(max, ' ') //&nbsp;
    //     if (item.subject.length < max) {
    //         let count = max - item.subject.length
    //         item.subject = item.subject.replace(/$/, Array(count).fill('&nbsp;').join('')) //'&nbsp;|' '
    //     }
    //     return item
    // })

    meniefest = meniefest.map((item, index) => {
      const obj = { ...item
      }; // '[{commit}]({repo}/commit/{hash})'
      // feat: add link tips to commit id
      // desc: escape html new line with Entity Name or Entity Code
      // https://mateam.net/html-escape-characters/

      let inlinebody; // inlinebody = `{type}({scope}): {subject}\n\n{body}\n\n{issue}\n{foot}`

      inlinebody = getAngularStyleTpl(obj); // feat: fix body when body is empty when commiting
      // which leads body includes subject in gitlog-parses

      if (obj.body.indexOf(obj.subject) >= 0) obj.body = '';
      inlinebody = ctx.writeTpl(inlinebody, { ...obj
      });
      inlinebody = inlinebody.replace(/\r?\n/gi, '&#10;'); // obj.inlinebody = obj.body.replace(/\r?\n/gi, '&#10;') //&NewLine;|&#10;

      obj.inlinebody = inlinebody; // markdown link expression

      let link;
      const mdlink = '[{commit}]({repo}/commit/{hash} "{inlinebody}")';
      link = mdlink;
      obj.commit = ctx.writeTpl(link, { ...obj // ...github,

      });
      return obj;
    }); // option.tpl = `{hash}|{type}|{subject}`;
    // let body = ctx.renderLine().join("\n");

    let body;
    let head;
    let table;

    {
      body = meniefest.map(line => ctx.writeTpl('{commit}|{type}|{subject}', line) // ...line, ...github }
      ).join('\n');
      head = getMarkdownTableHeadByKeys('commit|type|desciption', 'l');
      table = `${head}\n${body}\n\n`;
    }

    let res = '';
    let whtpl = '<a name="{version}"></a>\n# {version}({date})\n### {libname}';
    const changestpl = '{changes}';
    whtpl = `${whtpl}\n${changestpl}`; // whtpl = `${whtpl}\n\n${tbcentertpl}`

    if (meniefest.length > 0) {
      res = ctx.writeTpl(whtpl, {
        date: meniefest[0].date,
        changes: table
      });
      ctx.result = res;
    }

    return res;
  };
}

/* eslint-disable no-unused-vars */
/**
 *
 * @param {string|string[]} s
 * @param {{}} options
 * @returns {string[]}
 */

function clihooks2array(s, options = {}) {
  let option = {
    splitReg: /[,_;| ]/,
    ...options
  };
  let res = Array.isArray(s) ? s : s.split(option.splitReg);

  if (!option.useEmpty) {
    res = res.filter(v => v);
  }

  return res;
} //@ymc/render-cmted-msgs-to-pkg-changelog

/**
 * rendet data to changelog.md text
 * @param {[]} data
 * @param {{}} options
 * @returns {string}
 */


function render(data, options = {}) {
  let text;
  const option = {
    logInfo: false,
    // ignoreTypes: 'docs,chore,tool,style,',
    // latestCount: 8,
    ...options
  };
  const {
    wkd
  } = option;
  const libname = getLibNameFromPath(wkd, {
    camelize: false
  });
  const libdir = getPackagesLocFromPath(wkd);
  const loginfo = getLogInfo$1(option.logInfo);
  loginfo('[info] read pkgs pkgjson ');
  const pkgjson = readJsonSync(`${libdir}/${libname}/package.json`, {});
  const {
    version,
    name
  } = {
    version: '0.0.1',
    ...pkgjson
  };
  loginfo('[info] grep pkgs commits');
  let cache;
  const reg = new RegExp(`${libdir}/${libname}/`, 'i');
  cache = data.filter(v => v.file.some(f => reg.test(f))); // cache = gitlog.filterInfoByFile(new RegExp(`${libdir}/${libname}/`, 'i'))
  // log('[info] filter since last commit id')
  // cache = gitlog.filterSinceLastChanglog(cache, lastId)
  // filter:ignore docs
  // cache = gitlog.filterIgnoreScope(cache, docsReg);

  if (option.sinceDate) {
    loginfo('[info] only since date');
  }

  if (option.ignoreTypes) {
    loginfo('[info] filter types with ignore type'); // cache = cache.filter(v => v.type !== 'docs')

    let ignoretypes = clihooks2array(option.ignoreTypes, {
      useEmpty: true
    }); // ignore empty type
    // ignoretypes.push('')

    cache = cache.filter(v => !ignoretypes.some(vn => v.type === vn));
  }

  if (option.latestCount >= 1 && cache.length > 0) {
    loginfo('[info] only the latet count');
    cache = cache.slice(0, option.latestCount);
  } // only the latest
  // if (cache.length > 0) cache = cache[0];


  loginfo('[info] render new changlog'); // let cmds = definecmds(libname);
  // await runcmds(cmds);
  // get tpl and render

  const changelogstyle = new ChangelogStyle();
  changelogstyle.data = cache;
  changelogstyle.option = {
    style: 'custom'
  }; // table|list|custom

  changelogstyle.plugin = [pluginRoottable()];
  changelogstyle.plugin = [pluginRootList()];
  text = changelogstyle.render(); // log(text);

  text = changelogstyle.writeTpl(text, {
    version,
    libname: name,
    // libname,
    repo: 'https://github.com/ymc-github/js-idea'
  });
  return text.trim();
}

/* eslint-disable no-unused-vars */
const {
  log
} = console;
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
  };
}

async function main(options = {}) {
  const option = {
    out: `pkgs-cmted.tmp.json`,
    cmtedMsgsLoc: `gitlog-info.shim.tmp.json`,
    cmtedPkgsLoc: `pkgs-cmted.tmp.json`,
    changlogLoc: `CHANGELOG.md`,
    outPkgs: true,
    logInfo: false,
    logTask: false,
    ...options
  };
  const loginfo = getLogInfo(option.logInfo);
  const logtask = getLogInfo(option.logTask);
  let loc = option.out;
  logtask('[task] filter msg for pkg');
  logtask('[task] make changelog with tpl');
  loginfo('[info] read cmted msgs');
  let cmtedmsgs;
  loc = option.cmtedMsgsLoc;
  jsonstream.init(loc);
  cmtedmsgs = await jsonstream.read([]);
  loginfo(`[info] src: ${loc}`); // log(cmtedmsgs)

  let cmtedpkgs;
  loginfo('[info] read cmted pkgs');
  loc = option.cmtedPkgsLoc;
  jsonstream.init(loc);
  cmtedpkgs = await jsonstream.read([]);
  loginfo(`[info] src: ${loc}`);
  cmtedpkgs = cmtedpkgs.map(v => ({
    loc: v
  })); // log(cmtedpkgs)

  loginfo('[info] write changelog');
  let pkgslogs = [];
  pkgslogs = cmtedpkgs.map(v => {
    // log(v.name, v.loc)
    // res.push(render(data, { wkd: v.loc }))
    const txt = render(cmtedmsgs, {
      wkd: v.loc
    });
    pkgslogs.push(txt);
    return {
      loc: v.loc,
      data: txt
    };
  });

  if (option.outPkgs) {
    // loginfo('[info] write packages/xx/changelog.md')
    pkgslogs.forEach(v => {
      let txt = v.data; // txt = setTableStyle(txt)

      node_fs.writeFileSync(`${v.loc}/${option.changlogLoc}`, txt);
      log(`[info] out: ${v.loc}/${option.changlogLoc}`);
    });
  }

  pkgslogs = pkgslogs.filter(v => v); // pkgslogs = pkgslogs.join(`\n`)
  // log(pkgslogs)

  pkgslogs = pkgslogs.join('\n\n'); // pkgslogs = setTableStyle(pkgslogs)
  // loginfo('[info] write root changelog')

  loc = option.changlogLoc;
  changelogfile.init(loc);
  loginfo(`[info] out: ${loc}`);
  await changelogfile.write(pkgslogs);
}

module.exports = main;
