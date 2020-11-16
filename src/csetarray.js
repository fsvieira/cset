const CSet = require("./cset");
// const {errorHeaderNotFound} = require("./utils");

class CSetArray extends CSet {
    constructor(values) {
        super();
        this.sValues = [...new Set(values)].sort();
    }

    has(x) {
        x = x instanceof Array && x.length === 1 ? x[0] : x;

        return this.sValues.includes(x);
    }

    count() {
        return this.sValues.length;
    }

    get header() {
        return [this.name];
    }

    *values(min = 0, max = Infinity, selector) {
        if (!selector) {
            yield* this.sValues.filter(e => e >= min && e <= max);
        }
        else {
            for (let e of this.sValues) {
                if (e >= min && e <= max && selector(this.header, [e])) {
                    yield e;
                }
            }
        }
    }

    _toJSON(json) {
        if (!json.sets[this.id]) {
            json.sets[this.id] = {
                name: this.constructor.name,
                header: this.header,
                values: this.sValues.slice()
            };
        }
    }
}

module.exports = CSetArray;

