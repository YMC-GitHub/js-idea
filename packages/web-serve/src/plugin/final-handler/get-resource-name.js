import { original } from 'parseurl'

/**
 * Get resource name for the request.
 *
 * This is typically just the original pathname of the request
 * but will fallback to "resource" is that cannot be determined.
 *
 * @param {IncomingMessage} req
 * @return {string}
 */

function getResourceName(req) {
    try {
        return original(req).pathname
    } catch (e) {
        return 'resource'
    }
}
export default getResourceName
