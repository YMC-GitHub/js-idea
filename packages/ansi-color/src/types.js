/** @typedef {[number,number]} stypeCodes */
/** @typedef {{open:string,close:string,regex:regex,codes:stypeCodes,wrap:function}} stype */
/** @typedef {{codes:stypeCodes}} stypeOption */
/** @typedef {(input: string,newline:boolean) => string} colorfunction */

// /**@typedef {{alias:function,theme:(custom:{})=>store}} store */
/**
 * @typedef {object} store
 * @property {(str:string)=>boolean} hasAnsi
 * @property {(str:string)=>boolean} hasColor
 * @property {(name:string,color:string|()=>{})=>undefined} alias
 * @property {(custom:{})=>store} theme
 * @property {(str:string)=>string} unstyle
 * @property {(str:string)=>string} noop
 * @property {(str:string)=>string} clear
 * @property {(str:string)=>string} stripColor
 * @property {{}} symbols
 * @property {(name:string,codes:number[],type:string)=>undefined} define
 */
