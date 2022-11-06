import getCustomProp from './index'

const { log } = console
function statSync() {}
function main() {
  const option = { hi: 'hi', statSync }
  const customstatSync = getCustomProp(option, 'statSync', statSync)
  log(option)
  log(customstatSync)
}
main()

// node --no-warnings --loader ./scr/lib/esm-loader.js packages/get-custom-prop/src/demo.js
