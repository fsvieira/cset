const CSet = require("./cset");
const {errorHeaderNotFound} = require("./utils");

class CSetArray extends CSet {
    constructor (values) {
        super();
        this.sValues = new Set(values);
    }

    has (x) {
        return this.sValues.has(x);
    }

    count () {
        return this.sValues.size;
    }

    get header () {
        return [this.name];
    }

    *values () {
        // yield* this.sValues;
        // yield *this.compile()();
        yield *this.cn(
            function *(x) {
                yield x[0];
            })([]);
        /*
        yield *this.cn(
            x => x[0]
        )([]);*/
    }
/*
    cn (f) {
        return function *(x) {
            for (let y of this.sValues) {
                yield *f(x.concat([y]));
            }
        }
    }
*/

    cn (f) {
        const values = this.sValues;
        return function *(x) {
            for (let y of values) {
                yield *f(x.concat(y));
            }
        }
    }

    compile (p) {
        const f = this.toFunc(p);
        const values = this.sValues;
        const header = this.header;

        if (f) {
            return function *() {
                for (let x of values) {
                    if (f(header, x)) {
                        yield x;
                    }
                }
            }
        }
        else {
            return function *() {
                yield *values;
            }
        }

        /*
        return function *() {
            for (let x of this.sValues) {
                if (!f || f(x)) {
                    yield x;
                }
            }
        }*/
    }
}

module.exports = CSetArray;

