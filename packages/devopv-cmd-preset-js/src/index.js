/* eslint-disable max-len */
import ns from './ns-preset-node-loader'

/**
 *
 * @description
 * ```
 * ## current workflow ?
 * add npm pkg v2
 * cnf-pkg-rol-js
 * cnf-pkg-terser
 * cnf-pkg-doc-js
 * cnf-pkg.readme-tpl
 * cnf-pkg-eslint-js
 * del-pkg-unused-script
 * clean-build
 * ```
 */
export const PKG_SAM_JS = `
// ${ns} scr/2.add-pkg-npm.js {packages}/{name}
${ns} scr/2.add-pkg-npm2.js {packages}/{name}
${ns} scr/2.cnf-pkg-rol-js.js {packages}/{name}
//${ns} scr/2.cnf-pkg-uglifyjs.js {packages}/{name}
${ns} scr/2.cnf-pkg-terser.js {packages}/{name}
${ns} scr/2.cnf-pkg-doc-js.js {packages}/{name}
${ns} scr/2.cnf-pkg.readme-tpl.js {packages}/{name}
${ns} scr/2.cnf-pkg-eslint-js {packages}/{name}
${ns} scr/2.cnf-pkg-to-gen-dts-for-js-lib.js {packages}/{name}
// ${ns} scr/2.set-pkg-the-first-version.js {packages}/{name}
// ${ns} scr/8.set-pkg-changeset.js {packages}/{name}
${ns} scr/6.del-pkg-unused-script.js {packages}/{name}
${ns} scr/6.clean-build.js {packages}/{name}
`

/**
 *
 * @description
 * ```
 * ## why use?
 * - [x] add pkg dep for mono repo
 * - [x] out-lib dep
 * - [x] pri-lib dep
 * ## current workflow ?
 * get-file-dep -> add-file-dep
 * ```
 */
export const DEP_SAM_JS = `
${ns} scr/3.get-file-dep.js {packages}/{name}
// ${ns} scr/3.add-file-dep.js {packages}/{name}
`
/**
 *
 * @description
 * ```
 * ## why use?
 * - [x] build src to lib(dist) from esm to esx(umd,esm)
 * - [x] automation
 * - [x] custom cmd
 * ## current workflow ?
 * compile -> min -> banner -> lib-size -> readme -> del-tmp -> fmt
 * ```
 */
export const PRO_SAM_JS = `
// pnpm --filter {packages}/{name} pac:js
${ns} scr/6.gen-out.js {packages}/{name}
// pnpm --filter {packages}/{name} min:js
// pnpm --filter {packages}/{name} del:comment:js
${ns} scr/6.gen-lib-baner.js {packages}/{name}
${ns} scr/6.add-bin-head.js {packages}/{name}
// ${ns} scr/6.gen-pkg-doc-js.js {packages}/{name}
${ns} scr/6.gen-lib-size.js {packages}/{name}
// ${ns} scr/6.gen-pkg-readme.js {packages}/{name}
${ns} packages/gen-pkg-readme/src/demo.js {packages}/{name}
${ns} scr/6.del-tmp-dirs.js {packages}/{name}
// pnpm --filter {packages}/{name} lin:js
// ${ns} scr/8.lin-pkg-file.js {packages}/{name}
// ${ns} packages/lin-pkg-file/src/demo.js {packages}/{name}
// pnpm --filter {packages}/{name} fmt:js
${ns} scr/2.fmt-pkg-js.js {packages}/{name}
// pnpm --filter {packages}/{name} gen:dts:js
`

/**
 *
 * @description
 * ```
 * ## why use?
 * - [x] lin js with --fix (eslint)
 * - [x] fmt js (prettier)
 * - [x] to custom cmd
 * ## current workflow ?
 * lin -> fmt
 * ```
 */
export const LIN_SAM_JS = `
// pnpm --filter {packages}/{name} lin:js
//  ${ns} scr/8.lin-pkg-file.js {packages}/{name}
${ns} packages/lin-pkg-file/src/demo.js {packages}/{name}
//  pnpm --filter {packages}/{name} fmt:js
 ${ns} scr/2.fmt-pkg-js.js {packages}/{name}
 `

export const LOG_SAM_JS = `
${ns} scr/6.gen-pkg-changlog.js {packages}/{name}
`

export const TES_SAM_JS = `
// ${ns} scr/0.run-jest-unit.js --pkg-loc={packages}/{name} --run-cmd
${ns} packages/tes-pkg-file/src/ycs-style.js --pkg-loc={packages}/{name} --run-cmd
`
/**
 * bump
 * @description
 * ```
 * ## why use?
 * - [x] cnf and gen pkg changelog
 * - [x] update pkg version
 * - [x] banner in
 * ## current workflow ?
 * - [] cnf-pkg-changelog -> gen-pkg-changelog -> put-pkg-version
 * - [x] banner -> lib-size -> readme -> del-tmp -> fmt
 * ```
 */
export const CMT_SAM_JS = `
// ${ns} scr/8.set-pkg-changeset.js {packages}/{name}
// pnpm changeset version
//  pnpm --filter {packages}/{name} del:comment:js
// ${ns} scr/6.gen-lib-baner.js {packages}/{name}
// ${ns} scr/6.add-bin-head.js {packages}/{name}
// // ${ns} scr/6.gen-pkg-doc-js.js {packages}/{name}
// ${ns} scr/6.gen-lib-size.js {packages}/{name}
// ${ns} scr/6.gen-pkg-readme.js {packages}/{name}
// ${ns} scr/6.del-tmp-dirs.js {packages}/{name}
// pnpm install
${ns} scr/8.cmt-pkg.js {packages}/{name}
// pnpm publish -r
// pnpm changeset publish --tag beta
`

/**
 *
 * @description
 * ```
 * ## why use?
 * - [x] cnf-pkg-changelog
 * - [x] before commit updating
 * - [x] before bum version
 * ```
 */
export const CHA_SAM_JS = `
${ns} scr/8.set-pkg-changeset.js {packages}/{name}
`

/**
 * put pkg
 * @description
 * ```
 * ## why use?
 * - [x] cnf-pkg-changelog
 *
 * ## workflow?
 * - [x] after cha
 *  banner -> lib-size -> readme -> del-tmp -> fmt
 * ```
 */
export const PUT_SAM_JS = `
${ns} scr/6.gen-lib-baner.js {packages}/{name}
// ${ns} scr/6.gen-pkg-doc-js.js {packages}/{name}
${ns} scr/6.add-bin-head.js {packages}/{name}
${ns} scr/6.gen-lib-size.js {packages}/{name}
// ${ns} scr/6.gen-pkg-readme.js {packages}/{name}
${ns} packages/gen-pkg-readme/src/demo.js {packages}/{name}
${ns} scr/6.del-tmp-dirs.js {packages}/{name}
`

/**
 * bump
 * @description
 * ```
 * ## why use?
 * - [x] cnf and gen pkg changelog
 * - [x] update pkg version
 * - [x] banner in
 * ## current workflow ?
 * cnf-pkg-changelog -> gen-pkg-changelog -> put-pkg-version
 * banner -> lib-size -> readme -> del-tmp -> fmt
 * ```
 */
export const BUM_SAM_JS = `
// ${ns} scr/8.set-pkg-changeset.js {packages}/{name}
// pnpm changeset version
${ns} scr/6.put-pkg-version.js {packages}/{name}
${ns} scr/6.gen-pkg-changlog.js {packages}/{name}
//${ns} scr/8.cmt-pkg-changlog.js {packages}/{name}
${ns} scr/6.gen-lib-baner.js {packages}/{name}
// ${ns} scr/6.gen-pkg-doc-js.js {packages}/{name}
${ns} scr/6.gen-lib-size.js {packages}/{name}
// ${ns} scr/6.gen-pkg-readme.js {packages}/{name}
${ns} packages/gen-pkg-readme/src/demo.js {packages}/{name}
${ns} scr/6.del-tmp-dirs.js {packages}/{name}
${ns} scr/8.bum-pkg.js {packages}/{name}
// pnpm publish -r
// pnpm changeset publish --tag beta
`

// workflow:bump:a cnf-changelog -> put-verson -> gen-changelog -> cmt-bump
// workflow:bump:b cnf-changelog -> put-verson -> cmt-bump -> gen-changelog(with git-cmt-info) -> cmt-bump

/**
 * bin
 * @description
 * ```
 * ## why use?
 * - [x] cnf and gen pkg changelog
 * - [x] update pkg version
 * - [x] banner in
 * ## current workflow ?
 * cnf-pkg-changelog -> gen-pkg-changelog -> put-pkg-version
 * banner -> lib-size -> readme -> del-tmp -> fmt
 * ```
 */
export const BIN_SAM_JS = `
${ns} scr/6.gen-lib-baner.js {packages}/{name}
// ${ns} scr/6.gen-pkg-doc-js.js {packages}/{name}
${ns} scr/6.add-bin-head.js {packages}/{name}
${ns} scr/6.gen-lib-size.js {packages}/{name}
// ${ns} scr/6.gen-pkg-readme.js {packages}/{name}
${ns} packages/gen-pkg-readme/src/demo.js {packages}/{name}
${ns} scr/6.del-tmp-dirs.js {packages}/{name}
`

/**
 * UNU
 * @description
 * ```
 * del-tmp
 * ```
 */
export const UNU_SAM_JS = `
// ${ns} scr/6.del-tmp-dirs.js {packages}/{name}
${ns} scr/6.clean-build.js {packages}/{name}
`
