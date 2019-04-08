const CSet = require("./cset");
const {reorder} = require("./utils");

class Union extends CSet {

    constructor (a, b) {
        super();
        this.a = a;
        this.b = b;
    }

    has (x) {
        return this.a.has(x) || this.b.has(
            reorder(this.b.header, this.a.header, x)
        );
    }

    count () {
        return this.a.count() + this.b.count() - this.a.intersect(this.b).count();
    }

    *values () {
        for (let x of this.a.values()) {
            yield x;
        }

        const a = this.a.header;
        const b = this.b.header;

        // map values to headers,
        for (let x of this.b.values()) {
            x = reorder(a, b, x);

            if (!this.a.has(x)) {
                yield x;
            }
        }
    }
}

CSet.prototype.union = function (s) {
    if (this.isEmpty()) {
        return s;
    }
    else if (s.isEmpty()) {
        return this;
    }

    return new Union(this, s);
}


module.exports = Union;

