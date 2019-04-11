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

    *values () {
        for (let e of this._values) {
            yield e;
        }
    }

    projection (h, ...rest) {
        const header = this.header;
        if (!rest.length && h === header) {
            return this;
        }

        errorHeaderNotFound(header, [h].concat(rest));
    }

    toJSON () {
        return {
            name: "CSetArray",
            header: this.header,
            values: [...this._values],
        };
    }
}

module.exports = CSetArray;

