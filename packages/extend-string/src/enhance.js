// @ymc/extend-string
/* eslint-disable no-unused-vars,import/extensions */
// fix no-unused-vars test,expectString
import {
  extendStringPrototype,
  humanize,
  slugify,
  camelize,
  underscoped,
  classify,
  swapCase,
  capitialize,
  sentence,
  titleize,
  padStartString,
  padEndString
} from './base.js'

extendStringPrototype('humanize', humanize)

extendStringPrototype('slugify', slugify)
extendStringPrototype('dasherize', slugify)

extendStringPrototype('camelize', camelize)

extendStringPrototype('underscoped', underscoped)

extendStringPrototype('classify', classify)

extendStringPrototype('swapCase', swapCase)

extendStringPrototype('capitialize', capitialize)

extendStringPrototype('sentence', sentence)

extendStringPrototype('titleize', titleize)

extendStringPrototype('padStartString', padStartString)
extendStringPrototype('padStart', padStartString)

extendStringPrototype('padEndString', padEndString)
extendStringPrototype('padEnd', padEndString)

export {
  extendStringPrototype,
  humanize,
  slugify,
  slugify as dasherize,
  camelize,
  underscoped,
  classify,
  swapCase,
  capitialize,
  sentence,
  titleize,
  padStartString,
  padStartString as padStart,
  padEndString,
  padEndString as padEnd
}
