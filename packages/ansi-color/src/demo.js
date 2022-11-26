import c from './index'

const { log } = console

// c.enabled = false

// text fore color
log(c.red('This is a red string!'))
log(c.green('This is a red string!'))
log(c.cyan('This is a cyan string!'))
log(c.yellow('This is a yellow string!'))

// decoration - chained
log(c.bold.red('this is a bold red message'))
log(c.bold.yellow.italic('this is a bold yellow italicized message'))
log(c.green.bold.underline('this is a bold green underlined message'))

// mix - nested

log(c.yellow(`foo ${c.red.bold('red')} bar ${c.cyan('cyan')} baz`))

// alias
c.alias('primary', c.yellow)
c.alias('secondary', c.bold)

log(c.primary.secondary('Foo'))

// theme
c.theme({
    danger: c.red,
    dark: c.dim.gray,
    disabled: c.gray,
    em: c.italic,
    heading: c.bold.underline,
    info: c.cyan,
    muted: c.dim,
    primary: c.blue,
    strong: c.bold,
    success: c.green,
    underline: c.underline,
    warning: c.yellow
})

// Now, we can use our custom styles alongside the built-in styles!
log(c.danger.strong.em('Error!'))
log(c.warning('Heads up!'))
log(c.info('Did you know...'))
log(c.success.bold('It worked!'))

// symbols
const { bold, red } = c
log(bold(`foo ${red.dim('bar')} baz`))
// unstyle
log(c.unstyle(c.blue.bold('foo bar baz')))

// node --no-warnings --loader ./scr/lib/esm-loader.js packages/ansi-color/src/demo.js
