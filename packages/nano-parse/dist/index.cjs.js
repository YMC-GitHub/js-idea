/**
  * nanoParse v0.0.1
  * (c) 2018-2022 ymc
  * @license MIT
  */
'use strict';

/* eslint-disable no-use-before-define,no-restricted-syntax */
// docs(core): add docs comment

/**
 * parse cli cmd string
 * @param {string|string[]} input
 * @returns {{flags:string[],extras:string[],_:string[]}}
 * @sample
 * ```
 * nanoargs(`ns cmd -a -b -c -- -a -b -c`)
 * nanoargs(`ns subns cmd -a -b -c -- -a -b -c`)
 * nanoargs(`ns subns subcmd -a -b -c -- -a -b -c`)
 * ```
 */
function nanoargs(input) {
  const handledInput = Array.isArray(input) ? input : input.split(/ +/);
  let extras = [];
  let args = handledInput;
  const _ = []; // feat(nano-parse): support extras when '--' bind to ouput.extras

  if (handledInput.includes('--')) {
    extras = handledInput.slice(handledInput.indexOf('--') + 1);
    args = handledInput.slice(0, handledInput.indexOf('--'));
  }

  const newArgs = [];
  /* eslint-disable no-plusplus */

  for (let i = 0; i < args.length; i++) {
    const previous = args[i - 1];
    const curr = args[i];
    const next = args[i + 1]; // eg:ymc.rc.json

    const nextIsValue = next && !/^--.+/.test(next) && !/^-.+/.test(next);

    const pushWithNext = x => {
      newArgs.push([x, nextIsValue ? next : true]);
    }; // eg:--conf=ymc.rc.json -f=ymc.rc.json


    if (/^--.+=/.test(curr) || /^-.=/.test(curr)) {
      newArgs.push(curr.split('='));
    } else if (/^-[^-].*/.test(curr)) {
      let current = curr;

      if (current.includes('=')) {
        const index = current.indexOf('=');
        newArgs.push([current.slice(index - 1, index), current.slice(index + 1, index + 2)]);
        current = current.slice(0, index - 1) + current.slice(index + 2);
      } // Push all the flags but the last (ie x and y of -xyz) with true


      const xyz = current.slice(1).split('').slice(0, -1); // eslint-disable no-restricted-syntax

      for (const char of xyz) {
        newArgs.push([char, true]);
      } // If the next string is a value, push it with the last flag


      const final = current[current.length - 1];
      pushWithNext(final);
    } else if (/^--.+/.test(curr) || /^-.+/.test(curr)) {
      pushWithNext(curr);
    } else {
      let valueTaken = newArgs.find(arg => arg[0] === previous);

      if (!valueTaken && /^-./.test(previous)) {
        const previousChar = previous[previous.length - 1];
        valueTaken = newArgs.find(arg => arg[0] === previousChar);
      }

      if (!valueTaken) {
        _.push(curr);
      }
    }
  }

  const flags = {};

  for (const arg of newArgs) {
    let key = arg[0].replace(/^-{1,2}/g, '');
    let value = arg[1];

    if (key.startsWith('no-') && [undefined, true].includes(value)) {
      key = key.slice(3);
      value = false;
    }

    flags[key] = parseValue(value);
  }

  return {
    flags,
    _: _.map(value => parseValue(value)),
    extras: extras.map(value => parseValue(value))
  };
}
/**
 * cli value to node.js boolean , string or number
 * @param {string} thing
 * @returns {string|boolean|number}
 */

function parseValue(thing) {
  if (['true', true].includes(thing)) {
    return true;
  }

  if (['false', false].includes(thing)) {
    return false;
  }

  if (Number(thing)) {
    return Number(thing);
  }

  return thing;
}

module.exports = nanoargs;
