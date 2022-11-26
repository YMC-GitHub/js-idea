/**
  * ansiColor v0.0.1
  * (c) 2018-2022 ymc
  * @license MIT
  */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// /** @typedef {[number,number]} codes */
// /** @typedef {string} name */
// /** @typedef {[name,codes]} color */
// /** @typedef {color[]} colors */
// /** @typed colors */
// const colors = [
//   ['blue', [34, 39]],
//   ['bold', [1, 2]]
// ]
// export { colors }
const colors = [['reset', [0, 0], 'modifier'], ['bold', [1, 22], 'modifier'], ['dim', [2, 22], 'modifier'], ['italic', [3, 23], 'modifier'], ['underline', [4, 24], 'modifier'], ['inverse', [7, 27], 'modifier'], ['hidden', [8, 28], 'modifier'], ['strikethrough', [9, 29], 'modifier'], ['black', [30, 39], 'color'], ['red', [31, 39], 'color'], ['green', [32, 39], 'color'], ['yellow', [33, 39], 'color'], ['blue', [34, 39], 'color'], ['magenta', [35, 39], 'color'], ['cyan', [36, 39], 'color'], ['white', [37, 39], 'color'], ['gray', [90, 39], 'color'], ['grey', [90, 39], 'color'], ['bgBlack', [40, 49], 'bg'], ['bgRed', [41, 49], 'bg'], ['bgGreen', [42, 49], 'bg'], ['bgYellow', [43, 49], 'bg'], ['bgBlue', [44, 49], 'bg'], ['bgMagenta', [45, 49], 'bg'], ['bgCyan', [46, 49], 'bg'], ['bgWhite', [47, 49], 'bg'], ['blackBright', [90, 39], 'bright'], ['redBright', [91, 39], 'bright'], ['greenBright', [92, 39], 'bright'], ['yellowBright', [93, 39], 'bright'], ['blueBright', [94, 39], 'bright'], ['magentaBright', [95, 39], 'bright'], ['cyanBright', [96, 39], 'bright'], ['whiteBright', [97, 39], 'bright'], ['bgBlackBright', [100, 49], 'bgBright'], ['bgRedBright', [101, 49], 'bgBright'], ['bgGreenBright', [102, 49], 'bgBright'], ['bgYellowBright', [103, 49], 'bgBright'], ['bgBlueBright', [104, 49], 'bgBright'], ['bgMagentaBright', [105, 49], 'bgBright'], ['bgCyanBright', [106, 49], 'bgBright'], ['bgWhiteBright', [107, 49], 'bgBright']];

const isDefined = s => typeof s !== 'undefined';

const mergeObject = (...objs) => Object.assign({}, ...objs);

const isHyper = isDefined(process) && process.env.TERM_PROGRAM === 'Hyper';
const isWindows = isDefined(process) && process.platform === 'win32';
const isLinux = isDefined(process) && process.platform === 'linux';
const common = {
  ballotDisabled: '☒',
  ballotOff: '☐',
  ballotOn: '☑',
  bullet: '•',
  bulletWhite: '◦',
  fullBlock: '█',
  heart: '❤',
  identicalTo: '≡',
  line: '─',
  mark: '※',
  middot: '·',
  minus: '－',
  multiplication: '×',
  obelus: '÷',
  pencilDownRight: '✎',
  pencilRight: '✏',
  pencilUpRight: '✐',
  percent: '%',
  pilcrow2: '❡',
  pilcrow: '¶',
  plusMinus: '±',
  question: '?',
  section: '§',
  starsOff: '☆',
  starsOn: '★',
  upDownArrow: '↕'
};
const windows = mergeObject(common, {
  check: '√',
  cross: '×',
  ellipsisLarge: '...',
  ellipsis: '...',
  info: 'i',
  questionSmall: '?',
  pointer: '>',
  pointerSmall: '»',
  radioOff: '( )',
  radioOn: '(*)',
  warning: '‼'
});
const other = mergeObject(common, {
  ballotCross: '✘',
  check: '✔',
  cross: '✖',
  ellipsisLarge: '⋯',
  ellipsis: '…',
  info: 'ℹ',
  questionFull: '？',
  questionSmall: '﹖',
  pointer: isLinux ? '▸' : '❯',
  pointerSmall: isLinux ? '‣' : '›',
  radioOff: '◯',
  radioOn: '◉',
  warning: '⚠'
});
const main = isWindows && !isHyper ? windows : other;
Reflect.defineProperty(main, 'common', {
  enumerable: false,
  value: common
});
Reflect.defineProperty(main, 'windows', {
  enumerable: false,
  value: windows
});
Reflect.defineProperty(main, 'other', {
  enumerable: false,
  value: other
});

/* eslint-disable no-param-reassign */

const isObject = val => val !== null && typeof val === 'object' && !Array.isArray(val);

const isFunction = val => typeof val === 'function';

const isNotEmptyString = str => typeof str === 'string' && str !== '';

const iString = str => typeof str === 'string';
/* eslint-disable no-control-regex */
// this is a modified version of https://github.com/chalk/ansi-regex (MIT License)


const ANSI_REGEX = /[\u001b\u009b][[\]#;?()]*(?:(?:(?:[^\W_]*;?[^\W_]*)\u0007)|(?:(?:[0-9]{1,4}(;[0-9]{0,4})*)?[~0-9=<>cf-nqrtyA-PRZ]))/g;
/**
 * check if color enable
 * @returns
 */

const hasColor = () => {
  if (typeof process !== 'undefined') {
    return process.env.FORCE_COLOR !== '0';
  }

  return false;
};
/**
 * init colors store
 * @returns
 */


const iniColors = () => ({
  enabled: hasColor(),
  visible: true,
  styles: {},
  keys: {}
}); // define ansi color - wrap text to terminal color
// define ansi style - to wrap text to terminal color
// ansi-color-codes -> ansi-color-style

/**
 * color codes to  ansi text - to wrap text to terminal color
 * @param {*} style
 * @returns
 */


const colorAnsify = style => {
  // feat: cache color open , close text
  // feat: cache color close regexp
  const open = style.open = `\u001b[${style.codes[0]}m`;
  const close = style.close = `\u001b[${style.codes[1]}m`;
  const closeRegex = style.regex = new RegExp(`\\u001b\\[${style.codes[1]}m`, 'g'); // feat: return wrap handle to call any where

  style.wrap = (input, newline) => {
    // feat: wrap text to terminal color
    if (input.includes(close)) input = input.replace(closeRegex, close + open);
    const output = open + input + close; // feat: auto newline when symbol in text

    return newline ? output.replace(/\r?\n/g, `${close}$&${open}`) : output;
  };

  return style;
}; // ansi-color-style -> ansi-color-text


const wrapStyleToText = (style, input, newline) => isFunction(style) ? style(input) : style.wrap(input, newline); // /**
//  *
//  * @param {string} input
//  * @param {string[]} stack
//  * @param {{}} store
//  * @returns {string}
//  */

/**
 *
 * @param {store} store
 * @returns {(input:string,stack:string[])=>string}
 */


const style2text = store => (input, stack) => {
  if (input === '' || input == null) return ''; // feat: color enabled is optional

  if (store.enabled === false) return input; // feat: color visible is optional

  if (store.visible === false) return '';
  let str = `${input}`; // feat: auto newline when symbol in text

  const nl = str.includes('\n'); // feat: enable many style in styles stack

  let n = stack.length;

  if (n > 0 && stack.includes('unstyle')) {
    stack = [...new Set(['unstyle', ...stack])].reverse();
  }

  while (n-- > 0) str = wrapStyleToText(store.styles[stack[n]], str, nl);

  return str;
}; // ansi-color-name -> ansi-color-style
// /**
//  *
//  * @param {string} name
//  * @param {number[]} codes
//  * @param {string} type
//  * @param {{}} store
//  */

/**
 *
 * @param {store} store
 * @returns {(name:string,codes:number[],type:string)=>undefined}
 */


const defineColor = store => (name, codes, type) => {
  // feat: enable color name
  store.styles[name] = colorAnsify({
    name,
    codes
  }); // feat: enable style type

  const keys = store.keys[type] || (store.keys[type] = []);
  keys.push(name); // feat: reflect color name

  Reflect.defineProperty(store, name, {
    configurable: true,
    enumerable: true,

    set(value) {
      store.alias(name, value);
    },

    get() {
      // feat: get style when get color name
      const color = input => style2text(store)(input, color.stack);

      Reflect.setPrototypeOf(color, store); // desc: set color stack with color name

      color.stack = this.stack ? this.stack.concat(name) : [name];
      return color;
    }

  });
}; // desc: check if has ansi
// desc: check if has color

/**
 * check if has ansi
 * @param {{}} store
 * @returns {(str:string)=>boolean}
 */


const hasAnsi = store => str => {
  store.ansiRegex.lastIndex = 0;
  return isNotEmptyString(str) && store.ansiRegex.test(str);
}; // color alias -> color name

/**
 *
 * @param {{}} store
 * @returns {(name:string,color:string|()=>{})=>undefined}
 */


const defineAlias = store => (name, color) => {
  // feat: enable color alias
  // feat: enable function as color alias
  const fn = iString(color) ? store[color] : color;

  if (!isFunction(fn)) {
    throw new TypeError('Expected alias to be the name of an existing color (string) or a function');
  } // desc: set color stack in alias


  if (!fn.stack) {
    Reflect.defineProperty(fn, 'name', {
      value: name
    });
    store.styles[name] = fn;
    fn.stack = [name];
  } // feat: reflect color name


  Reflect.defineProperty(store, name, {
    configurable: true,
    enumerable: true,

    set(value) {
      store.alias(name, value);
    },

    get() {
      // feat: get style when get color name
      const color = input => style2text(store)(input, color.stack);

      Reflect.setPrototypeOf(color, store); // desc: set color stack with color name for  name or alias

      color.stack = this.stack ? this.stack.concat(fn.stack) : fn.stack;
      return color;
    }

  });
}; // color theme -> color alias

/**
 *
 * @param {store} store
 * @returns {(custom:{})=>store}
 */


const defineTheme = store => custom => {
  if (!isObject(custom)) throw new TypeError('Expected theme to be an object');

  for (const name of Object.keys(custom)) {
    store.alias(name, custom[name]);
  }

  return store;
}; // ansi-text -> plian-text

/**
 * ansi-text to plian-text
 * @param {store} store
 * @returns {(str:string)=>string}
 */


const unstyle = store => str => {
  if (isNotEmptyString(str)) {
    store.ansiRegex.lastIndex = 0;
    return str.replace(store.ansiRegex, '');
  }

  return '';
};

const create = () => {
  const colors$1 = iniColors(); // const ansi = colorAnsify
  // const wrap = wrapStyleToText
  // const style = style2text

  const define = defineColor(colors$1); // feat: built in color

  const colorset = [...colors];
  colorset.forEach(cs => {
    define(...cs);
  }); // desc: add method
  // desc: check if has ansi
  // desc: check if has color

  colors$1.ansiRegex = ANSI_REGEX;
  colors$1.hasColor = colors$1.hasAnsi = hasAnsi(colors$1); // desc: define color or alias

  colors$1.alias = defineAlias(colors$1); // desc: define color theme

  colors$1.theme = defineTheme(colors$1); // feat: built in alias

  colors$1.alias('unstyle', unstyle(colors$1));
  colors$1.alias('noop', str => str);
  colors$1.none = colors$1.clear = colors$1.noop;
  colors$1.stripColor = colors$1.unstyle;
  colors$1.symbols = main;
  colors$1.define = define;
  return colors$1;
};

const instance = create();

exports.create = create;
exports["default"] = instance;
