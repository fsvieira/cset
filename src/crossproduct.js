const CSet = require("./cset");
const {reorder} = require("./utils");

class CrossProduct extends CSet {
    constructor (a, b) {
        super();
        this.a = a;
        this.b = b;

        const h = this.header;
        const s = new Set(h);

        if (h.length !== s.size) {
            throw `Repeated headers are not allowed ${h.join(", ")}`;
        }
    }

    has (x) {
        if (x instanceof Array) {
            const aLength = this.a.header.length;
            const bLength = this.b.header.length;
            const total = aLength + bLength;
            
            if (x.length === total) {
                const a = x.slice(0, aLength);
                const b = x.slice(aLength, total);

                return this.a.has(a.length===1?a[0]:a) && 
                    this.b.has(b.length===1?b[0]:b);
            }
        }

        return false;
    }

    count () {
        return this.a.count() * this.b.count();
    }

    get header () {
        const ah = this.a.header;
        const bh = this.b.header; 

        return ah.concat(bh);
    }

    *values (min, max, selector) {
        const aHeader = this.a.header;

        for (let a of this.a.values(min, max, selector)) {
            a = a instanceof Array?a:[a];

            for (let b of this.b.values(
                    min,
                    max,
                    selector?(headers, values, min, max) =>
                        selector(aHeader.concat(headers), a.concat(values)):
                    undefined
                )
            ) {
                b = b instanceof Array?b:[b];

                yield a.concat(b);
            }
        }
    }
}

CSet.prototype.crossProduct =  function crossProduct (s) {
    return new CrossProduct(this, s);
};

module.exports = CrossProduct;

