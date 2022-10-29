/**
  * commonType v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global["common-type"] = factory());
})(this, (function () { 'use strict';

	// Parameters:
	// Headers
	// Path parameters
	// Body  parameters
	// response status codes:

	/**
	 * @typedef {object} donwloadOption
	 * @property {string?} url - download from
	 * @property {string?} targetFile
	 * @property {boolean?} overideTargetFile
	 * @property {()=>{}} cutomRequest
	 */

	/**
	 * @typedef {object} showProgressOption
	 * @property {boolean?} showProgress
	 */

	/**
	 * @typedef {object} httpReqOption
	 * @property {object?} data
	 */

	/**
	 * @typedef {donwloadOption|showProgressOption|httpReqOption} donwloadFileOption
	 */

	/** @typedef {{url:string,file:string,name:string}} targetItem */

	/** @typedef {targetItem[]} targets */

	/** @typedef {string[]} urlmap */

	/** @typedef  {string} targetFile */
	// Maximum allowed is 100  max-len

	/** @typedef {{response:object,targetFile:string,stream?:object,resolve:Promise.resolve,data:string}} saveFileThroughStreamOption */

	/* eslint-disable-line  max-len */

	/** @typedef {{file:string,cur:number,len:number,total:number}} showProgressNextOption */

	/** @typedef {[string,string][]} proxyDomainMap */

	/** @typedef {{prefix:string}} urlToDesOption */

	/** @typedef {{linkKeyAndVal:string,span:string}} pathParamTransferOption */

	/** @typedef {{noAutoCamelize?:boolean,slim?:boolean,mode?:string,modeStyle:string}} getBuiltinFlagsOption */

	/* eslint-disable-line  max-len */

	/** @typedef {{noAutoCamelize?:boolean,slim?:boolean}} camelizeFlagsOption */

	/** @typedef {{noAutoCamelize?:boolean,slim?:boolean}} likeCamelizeFlagsOption */

	/** @typedef {{name:string,type:string,value:string|boolean,desc:string}} cliParam */

	/** @typedef {string} cliArgsStringExp */

	/** @typedef {string} httpQueryStringExp */

	/** @typedef {string} swithOptionStringExp */

	/** @typedef {object|cliArgsStringExp|httpQueryStringExp|swithOptionStringExp} getValFromParamResult */

	/* eslint-disable-line  max-len */
	// [jsdoc:import typedef from another file](https://github.com/jsdoc/jsdoc/issues/1537)
	// [jsdoc:how to extend a typedef parameter](https://github.com/jsdoc/jsdoc/issues/1199)
	function noop() {}

	return noop;

}));
