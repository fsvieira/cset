const CSet = require("./cset");
const {reorder} = require("./utils");

class Union extends CSet {

    constructor (a, b) {
        super();

        const ah = a.header;
        const bh = b.header;
        
        this.a = a;
        this.b = b;

        if (ah.length === bh.length) {
            if (ah.length === 1) {
                return;
            }

            const h = new Set([...ah, ...bh]);

            if (h.size === bh.length) {
                return;
            }
        }

        throw `Invalid union, headers don't match ${ah.join(", ")} <> ${bh.join(", ")}`;
    }

    has (x) {
        return this.a.has(x) || this.b.has(
            reorder(this.b.header, this.a.header, x)
        );
    }

    count () {
        return this.a.count() + this.b.count() - this.a.intersect(this.b).count();
    }

    // No order,
    *values (min, max, selector) {
        const aHeader = this.a.header;
        const bHeader = this.b.header;

        yield *this.a.values(min, max, selector);
        
        for (let e of this.b.values(min, max, (header, values) => {
            if (!selector || selector(header, values)) {
                if (header.length === aHeader.length) {
                    const ae = reorder(aHeader, bHeader, values);
                    return !this.a.has(ae);
                }
                else {
                    return true;
                }
            }

            return false;
        })) {
            yield reorder(aHeader, bHeader, e);
        }
    }

    get header () {
        return this.a.header;
    }
}

CSet.prototype.union = function (s) {
    return new Union(this, s);
}

module.exports = Union;

