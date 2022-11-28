/* eslint-disable max-len */
/* eslint-disable prefer-const */

// feat: person class in some where
// ...

// feat: person method in some where
// ...
const Person = {
    fullName() {
        // feat: say full name
        return `${this.firstName} ${this.lastName}`
    },
    hello(greet) {
        // feat: say hello
        let fullname
        const fn = this.fullName
        fullname = fn ? fn() : `${this.firstName} ${this.lastName}`
        return `${greet} ${fullname}`
    }
}

// feat: person instance ymc
const ymc = {
    firstName: 'Ye',
    lastName: 'Mincong'
}

const lby = {
    firstName: 'Li',
    lastName: 'Boli'
}

const { log } = console
// call fullName method with another ctx ymc
log('[task] CHANGE function context this')
log('[info] CHANGE CTX WITH Function.prototye.apply')
log(Person.fullName.apply(ymc))
log(Person.hello.apply(ymc, ['hello']))
// log(Person.hello.apply(ymc, ['hi']))

log('[info] CHANGE CTX WITH Function.prototye.call')
log(Person.fullName.call(lby))
log(Person.hello.call(lby, 'hello'))

log('[info] CHANGE CTX WITH Function.prototye.bind')
log(Person.fullName.bind(lby)())
log(Person.hello.bind(lby, 'hello')())
// node --no-warnings --loader ./scr/lib/esm-loader.js packages/extend-function/src/demo/change-this.js
