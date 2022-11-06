/**
  * devopvCmdPresetStore v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
'use strict';

/** @typedef {{[string]:{name:string,version:string,tpl:string}}} data */
class DevOpvCmdPresetStore {
  constructor() {
    this.ini();
  }

  ini() {
    /** @type data */
    this.data = {};
    return this;
  }

  add(name, tpl, version = '1.0.0') {
    const {
      data
    } = this;
    data[name] = {
      name,
      version,
      tpl
    };
    return this;
  }

  get(name) {
    const {
      data
    } = this;
    return data[name];
  }

}

module.exports = DevOpvCmdPresetStore;
