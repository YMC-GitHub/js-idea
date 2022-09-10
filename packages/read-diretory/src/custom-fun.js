//api-base:isFileMode,isFileTextMode,output
function isFileMode(s) {
  return s == 'file'
}
function isFileTextMode(s) {
  return s == 'file_text'
}
function output(s) {
  //feat: output dst to console
  // too.log(too.blue(`found in:${s}`))
  console.log(`found in:${s}`)
}
export { isFileMode, isFileTextMode, output }
