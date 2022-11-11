import compare from '@ymc/compare-version'

function satisfiesVersion(ve1, ve2) {
  // let cps = `=,>,<,`
  const cpsReg = /=|>|</
  const matched = ve2.match(cpsReg)
  let cp
  let v2
  if (matched) {
    ;[cp] = matched
    ;[, v2] = ve2.split(cpsReg)
  } else {
    v2 = ve2
    // return compare(ve1, ve2) >= 0
  }
  if (cp === '<') {
    return compare(ve1, v2) === -1
  }
  if (cp === '=') {
    return compare(ve1, v2) === 0
  }
  if (cp === '>') {
    return compare(ve1, v2) === 1
  }
  return compare(ve1, v2) >= 0
}

export default satisfiesVersion
