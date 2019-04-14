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

    *_values () {
        yield *this.a.values();

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

    get header () {
        return this.a.header;
    }
}

CSet.prototype.union = function (s) {
    if (this.isEqual(s)) {
        return this;
    }
    else if (this.isEmpty()) {
        return s;
    }
    else if (s.isEmpty()) {
        return this;
    }

    // return new Union(this.intersect(s), this.symmetricDifference(s));
    return new Union(this, s);
}

CSet.prototype._union = function (s) {
    return new Union(this, s);
}

module.exports = Union;

