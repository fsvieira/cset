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
        yield* this.sValues;
    }

    /*
    projection (h, ...rest) {
        const header = this.header;
        if (!rest.length && header.includes(h)) {
            return this;
        }

        errorHeaderNotFound(header, [h].concat(rest));
    }*/

    /** Query */
    eCount () {
        return this.sValues.size;
    }
}

module.exports = CSetArray;

