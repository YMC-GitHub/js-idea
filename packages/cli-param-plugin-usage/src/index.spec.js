import main from './index'
import { formatText, beautyText } from './helps'

test(`param-to-usage`, () => {
  let param = [{ name: 'help', type: 'boolean', value: false, desc: 'info help' }]
  let output = main(param)
  expect(output).toStrictEqual(formatText(`option:\nhelp      info help (default:false)`, ' ', 2))
})
