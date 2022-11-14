/* eslint-disable  no-return-assign */
const { log } = console
const cache = {}
export default function main(name, options = {}) {
    const option = {
        log,
        ...options
    }
    return (
        cache[name] ||
        (cache[name] = function info(msg) {
            if (option.enable) {
                option.log(msg)
            }
        })
    )
}
