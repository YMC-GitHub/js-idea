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
const colors = [
    ['reset', [0, 0], 'modifier'],
    ['bold', [1, 22], 'modifier'],
    ['dim', [2, 22], 'modifier'],
    ['italic', [3, 23], 'modifier'],
    ['underline', [4, 24], 'modifier'],
    ['inverse', [7, 27], 'modifier'],
    ['hidden', [8, 28], 'modifier'],
    ['strikethrough', [9, 29], 'modifier'],

    ['black', [30, 39], 'color'],
    ['red', [31, 39], 'color'],
    ['green', [32, 39], 'color'],
    ['yellow', [33, 39], 'color'],
    ['blue', [34, 39], 'color'],
    ['magenta', [35, 39], 'color'],
    ['cyan', [36, 39], 'color'],
    ['white', [37, 39], 'color'],
    ['gray', [90, 39], 'color'],
    ['grey', [90, 39], 'color'],

    ['bgBlack', [40, 49], 'bg'],
    ['bgRed', [41, 49], 'bg'],
    ['bgGreen', [42, 49], 'bg'],
    ['bgYellow', [43, 49], 'bg'],
    ['bgBlue', [44, 49], 'bg'],
    ['bgMagenta', [45, 49], 'bg'],
    ['bgCyan', [46, 49], 'bg'],
    ['bgWhite', [47, 49], 'bg'],

    ['blackBright', [90, 39], 'bright'],
    ['redBright', [91, 39], 'bright'],
    ['greenBright', [92, 39], 'bright'],
    ['yellowBright', [93, 39], 'bright'],
    ['blueBright', [94, 39], 'bright'],
    ['magentaBright', [95, 39], 'bright'],
    ['cyanBright', [96, 39], 'bright'],
    ['whiteBright', [97, 39], 'bright'],

    ['bgBlackBright', [100, 49], 'bgBright'],
    ['bgRedBright', [101, 49], 'bgBright'],
    ['bgGreenBright', [102, 49], 'bgBright'],
    ['bgYellowBright', [103, 49], 'bgBright'],
    ['bgBlueBright', [104, 49], 'bgBright'],
    ['bgMagentaBright', [105, 49], 'bgBright'],
    ['bgCyanBright', [106, 49], 'bgBright'],
    ['bgWhiteBright', [107, 49], 'bgBright']
]
export default colors
