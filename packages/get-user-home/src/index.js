/**
 * get user home through process.env and process.platform
 * @returns
 */
function getUserHome() {
    return process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME']
}
export default getUserHome
