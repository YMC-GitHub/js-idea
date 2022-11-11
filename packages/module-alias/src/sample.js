/* eslint-disable  no-unused-vars */
const babelAliasSettingTpl = `
"babel-plugin-module-resolver",
{
    "root": ["node_modules", "./"],
    "alias": {
        "^@ymc/(.+)$": "./packages/\\1",
        "^@private-pkgs/(.+)$": "./private-pkgs/\\1"
    },
    "transformFunctions": [
        "require",
        "require.resolve",
        "System.import",
        "jest.genMockFromModule",
        "jest.mock",
        "jest.unmock",
        "jest.doMock",
        "jest.dontMock"
    ]
}
`
// plugins.push(wrap)

const eslintAliasSettringTpl = `
"settings": {
    "import/resolver": {
        "alias": {
            "map": [
                ["@ymc", "./packages"],
                ["@private-pkgs", "./private-pkgs"],
                ["@scss", "./packages/styles"]
            ],
            "extensions": [".ts", ".tsx", ".js", ".jsx", ".json", ".vue"]
        }
    }
},
`
const jestAliasSettringTpl = `
"rootDir": "../../",
"moduleFileExtensions": ["js"],
"moduleNameMapper": {
    "^@ymc/(.*?.?(js|vue)?|)$": "<rootDir>/packages/$1",
    "^@private-pkgs/(.*?.?(js|vue)?|)$": "<rootDir>/private-pkgs/$1"
},
`

const jsconfigAliasSettingTpl = `
"compilerOptions": {
    "baseUrl": "./",
    "paths": {
        "@ymc/*": ["packages/*"],
        "@private-pkgs/*": ["private-pkgs/*"],
        "@script-pkgs/*": ["scr/lib*"]
    }
},
`

const vscodeAliasTpl = `
"path-intellisense.mappings": {
    "@ymc/": "\${workspaceFolder}/packages",
    "@privatepkgs/": "\${workspaceFolder}/scr/lib"
},
`
