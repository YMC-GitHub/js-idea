const isDefined = s => typeof s !== 'undefined'
const mergeObject = (...objs) => Object.assign({}, ...objs)
const isHyper = isDefined(process) && process.env.TERM_PROGRAM === 'Hyper'
const isWindows = isDefined(process) && process.platform === 'win32'
const isLinux = isDefined(process) && process.platform === 'linux'

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
}

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
})

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
})
const main = isWindows && !isHyper ? windows : other
Reflect.defineProperty(main, 'common', { enumerable: false, value: common })
Reflect.defineProperty(main, 'windows', { enumerable: false, value: windows })
Reflect.defineProperty(main, 'other', { enumerable: false, value: other })
export default main
