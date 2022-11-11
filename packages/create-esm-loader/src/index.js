import { Loader } from './Loader'
/**
 * create loaders with config
 * @param  {...any} args
 * @returns
 */
async function createLoader(...args) {
  const loader = await new Loader(...args).ready()
  return loader.hooks()
}

export default createLoader
