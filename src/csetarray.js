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
        yield *this.compile()();
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

