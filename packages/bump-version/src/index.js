const versions = ['major', 'minor', 'patch'] // M.m.p

/**
 * get version type
 * @param {string} type
 * @returns {string}
 * @description
 * ```
 * Looks at first argument to determine type of upgrade: patch, minor, major
 * defaults to patch if undefined
 * ```
 */
const getVersionType = (type = 'patch') => {
    const store = {
        M: 'major',
        m: 'minor',
        p: 'patch',
        major: 'major',
        minor: 'minor',
        patch: 'patch'
    }

    return store[type]
}

/**
 * increment version
 * @param {string} version
 * @param {string} type
 * @returns {string}
 */
const incrementVersion = (version, type) => {
    const index = versions.indexOf(type)
    const versionArr = version.split('.')
    const currentValue = Number(versionArr[index])
    const updatedValue = currentValue + 1
    const updatedVersionArr = [].concat(versionArr)

    switch (type) {
        case 'major':
            return `${updatedValue}.0.0`

        case 'minor':
            updatedVersionArr[1] = updatedValue
            updatedVersionArr[2] = 0
            return updatedVersionArr.join('.')

        case 'patch':
            updatedVersionArr[2] = updatedValue
            return updatedVersionArr.join('.')

        default:
            throw new Error(`Provide one of: ${versions.join(', ')}`)
    }
}
/**
 * bum version
 * @param {string} currentVersion
 * @param {string} type
 * @returns {string}
 */
const bumpVersion = (currentVersion, type) => {
    const versionType = getVersionType(type)
    const updatedVersion = incrementVersion(currentVersion, versionType)
    return updatedVersion
}

export { getVersionType, incrementVersion, bumpVersion }
