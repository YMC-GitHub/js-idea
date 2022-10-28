/* eslint-disable no-unused-vars,import/extensions */
import {
  extendStringPrototype,
  humanize,
  slugify,
  dasherize,
  camelize,
  underscoped,
  classify,
  swapCase,
  capitialize,
  sentence,
  titleize,
  padStartString,
  padStart,
  padEndString,
  padEnd
} from './enhance.js'

const { log } = console
let test = log
function expectString(input, ouput) {
  // log(`actual:${input} expect:${ouput} : ${input===ouput}`)
  if (input !== ouput) {
    log(`actual:${input} expect:${ouput} : ${input === ouput}`)
  }
}
expectString(humanize('per_page'), 'Per page')
expectString(humanize('per-page'), 'Per page')
expectString(humanize('per page'), 'Per page')
expectString(humanize('per  paGe'), 'Per pa ge')
expectString('per  paGe'.humanize(), 'Per pa ge')

expectString(slugify('per_page'), 'per-page')
expectString(slugify('per-page'), 'per-page')
expectString(slugify('per page'), 'per-page')
expectString(slugify('per  paGe'), 'per-pa-ge')
expectString('per  paGe'.slugify(), 'per-pa-ge')

expectString(camelize('per_page'), 'perPage')
expectString(camelize('per-page'), 'perPage')
expectString(camelize('per page'), 'perPage')
expectString(camelize('per paGe'), 'perPaGe')
expectString('per  paGe'.camelize(), 'perPaGe')

expectString(underscoped('per_page'), 'per_page')
expectString(underscoped('per-page'), 'per_page')
expectString(underscoped('per page'), 'per_page')
expectString(underscoped('per paGe'), 'per_pa_ge')
expectString('per  paGe'.underscoped(), 'per_pa_ge') // per_pa_ge

test = log
test = expectString
test(classify('per_page'), 'PerPage')
test(classify('per-page'), 'PerPage')
test(classify('per page'), 'PerPage')
test(classify('per paGe'), 'PerPaGe')
test('per  paGe'.classify(), 'PerPaGe') // per_pa_ge

expectString(swapCase('per_page'), 'PER_PAGE')
expectString(swapCase('per-page'), 'PER-PAGE')
expectString(swapCase('per page'), 'PER PAGE')
expectString(swapCase('per paGe'), 'PER PAgE')
expectString('per  paGe'.swapCase(), 'PER  PAgE') // per_pa_ge

test = log
test = expectString
test(capitialize('per_page'), 'Per_page')
test(capitialize('per-page'), 'Per-page')
test(capitialize('per page'), 'Per page')
test(capitialize('per paGe'), 'Per paGe')
test('per  paGe'.capitialize(), 'Per  paGe') // per_pa_ge

test = log
test = expectString
test(sentence('per_page'), 'Per_page')
test(sentence('per-page'), 'Per-page')
test(sentence('per page'), 'Per page')
test(sentence('per paGe'), 'Per page')
test('per  paGe'.sentence(), 'Per  page') // per_pa_ge

test(titleize('per_page'), 'Per_page')
test(titleize('per-page'), 'Per-Page')
test(titleize('per page'), 'Per Page')
test(titleize('per paGe'), 'Per Page')
test('per  paGe'.titleize(), 'Per Page') // Per  Page

test = log
test = expectString
test(padEndString('per_page', 16, '-'), 'per_page--------')
test(padEndString('per-page', 16, '-'), 'per-page--------')
test(padEndString('per page', 16, '-'), 'per page--------')
test(padEndString('per paGe', 16, '-'), 'per paGe--------')
test('per  paGe'.padEndString(16, '-'), 'per  paGe-------') // Per  Page

// node packages/extend-string/src/test.js
