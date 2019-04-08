const CSet = require("./cset");
const {errorHeaderNotFound} = require("./utils");

class CSetArray extends CSet {
    constructor (values) {
        super();
        this._values = new Set(values);
    }

    has (x) {
        return this._values.has(x);
    }

    count () {
        return this._values.size;
    }

    get header () {
        return this.name;
    }

    *values (p) {
        if (p) {
            const header = [this.header];

            for (let e of this._values) {
                if (p.test(header, [e])) {
                    yield e;
                }
            } 
        }
        else {
            for (let e of this._values) {
                yield e;
            }
        }
    }

    projection (h, ...rest) {
        const header = this.header;
        if (!rest.length && h === header) {
            return this;
        }

        errorHeaderNotFound(header, [h].concat(rest));
    }
}

module.exports = CSetArray;

