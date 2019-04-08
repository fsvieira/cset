const CSet = require("./cset");

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
}

module.exports = CSetArray;

