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
        yield *this.cn(
            function *(x) {
                yield x[0];
            })([]);
    }

    cn (f) {
        const values = this.sValues;
        return function *(x) {
            for (let y of values) {
                yield *f(x.concat(y));
            }
        }
    }
}

module.exports = CSetArray;

