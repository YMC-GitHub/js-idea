import { createReadStream, createWriteStream } from 'fs'
// import { readStream, writeStream } from './stream-io.js'
import { readStream, writeStream } from '@ymc/stream-io'
/**
 * @sample
 * ```
 * jsonstream.file.name="package.json"
 * //or
 * jsonstream.init("package.json")
 * await jsonstream.read()
 * await jsonstream.write({})
 * ```
 */
class JsonStream {
  constructor(name, data) {
    this.init(name, data)
  }

  /**
   * read file async (stream mode)
   * @param {{}|[]} def
   * @returns {Prmosie<json>}
   */
  async read(def = {}) {
    const { file } = this
    let reader
    let res
    try {
      reader = createReadStream(file.name)
      res = await readStream(reader)
      res = JSON.parse(res)
    } catch (error) {
      // console.log(error);
      res = def
    }
    file.data = res
    return res
  }

  /**
   * write file async (stream mode)
   * @param {{}|[]|undefined} data
   * @returns {Prmosie<void>}
   */
  async write(data) {
    // no-param-reassign data
    // no-unused-vars option
    /* eslint-disable no-unused-vars */
    const { file, option } = this // eslint-disable-line
    let writer
    let content = data
    try {
      writer = createWriteStream(file.name)
      if (data) {
        file.data = data
      } else {
        content = file.data
      }
      await writeStream({
        stream: writer,
        data: JSON.stringify(content, null, 2)
      })
    } catch (error) {
      // do nothing
      /* eslint-disable no-unused-vars */
      ;(v => {})(error)
    }
  }

  init(name = 'package.json', data = {}) {
    this.file = {
      name,
      data
    }
    this.option = {}
  }

  /* eslint-disable class-methods-use-this */
  new(...option) {
    return new JsonStream(...option)
  }
}
const jsonstream = new JsonStream()
export { JsonStream, jsonstream }
