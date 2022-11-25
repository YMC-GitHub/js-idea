// plan:
// @ymc/ycs-plugin-param
// @ymc/ycs-preset-param
// @ymc/ycs-preset-base-param
// @ymc/ycs-preset-token-param
// @ymc/ycs-preset-page-param
// @ymc/ycs-preset-user-param
// @ymc/ycs-preset-github-param
/** @typedef {{name:string,type:string,value:string|boolean,desc:string}[]} param */
/**
 * ysc param preset - base - for help and version
 * @returns {param}
 */
function baseParam() {
    return [
        {
            name: '-h,--help',
            type: 'boolean',
            value: false,
            desc: 'info help'
        },
        {
            name: '-v,--version',
            type: 'string',
            value: '1.0.0',
            desc: 'info version'
        }
    ]
}
/**
 * ysc param preset - token - for github
 * @returns {param}
 */
function tokenParam() {
    return [
        {
            name: '--token',
            type: 'string',
            value: '',
            desc: 'the github token'
        },
        {
            name: '--token-file-loc',
            type: 'string',
            value: 'secrets/token-for-dev.txt',
            desc: 'the github token file loc'
        }
    ]
}
/**
 * ysc param preset - page - for github
 * @returns {param}
 */
function pageParam() {
    return [
        {
            name: '-p,--page',
            type: 'number',
            value: 1,
            desc: 'number of the results to fetch'
        },
        {
            name: '--per-page',
            type: 'number',
            value: 30,
            desc: 'number of results per page (max 100)'
        }
    ]
}
/**
 * ysc param preset - user - for github
 * @returns {param}
 */
function userParam() {
    return [
        {
            name: '--username',
            type: 'string',
            value: 'ymc-github',
            desc: 'the handle for the gitHub user account'
        }
    ]
}

function githubParam() {
    return [...baseParam(), ...tokenParam(), ...pageParam(), ...userParam()]
}

export { baseParam, tokenParam, pageParam, userParam, githubParam }
