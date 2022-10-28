/**
  * kindOf v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
// @ymc/kind-of # @ymc/type-of
// @ymc/is-type # @ymc/is
const { toString } = Object.prototype;

/**
 * get kind of thing
 * @param {*} thing
 * @returns {string}
 * @description
 * ```
 * ## good ?
 * - [x] cache result
 * - [x] zero middle var with iifn
 * ```
 */
const kindOf = (cache => thing => {
  const str = toString.call(thing);
  return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase()) //eslint-disable-line
  // Return statement should not contain assignment        no-return-assign
  // Assignment to property of function parameter 'cache' no-param-reassign
})(Object.create(null));

/**
 *
 * @param {string} type
 * @description
 * ```
 * idea:to-lowercase -> kind-of -> eq-type
 * ```
 */
const kindOfTest = type => thing => kindOf(thing) === type.toLowerCase();

/**
 *
 * @param {*} type
 * @description
 * ```
 * idea:type-of -> eq-type
 * ```
 */
const typeOfTest = type => thing => typeof thing === type; //eslint-disable-line

export { kindOf, kindOfTest, toString, typeOfTest };