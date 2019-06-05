const CSet = require("./cset");
const Intersect = require("./intersect");
const Union = require("./union");
const Difference = require("./difference");

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

    intersect (s) {
        const a = this.header;
        const b = s.header;

        if (a.length === b.length) {
            const h = new Set([...a, ...b]);

            if (h.size === b.length) {
                return new Intersect(this, s);
            }
        }

        throw `Invalid intersect, headers don't match ${a.join(", ")} <> ${b.join(", ")}`;

    }

    difference (s) {
        const a = this.header;
        const b = s.header;

        if (a.length === b.length) {
            const h = new Set([...a, ...b]);

            if (h.size === b.length) {
                return new Difference(this, s);
            }
        }

        throw `Invalid difference, headers don't match ${a.join(", ")} <> ${b.join(", ")}`;
    }

    union (s) {
        const a = this.header;
        const b = s.header;

        if (a.length === b.length) {
            const h = new Set([...a, ...b]);

            if (h.size === b.length) {
                return new Union(this, s);
            }
        }

        throw `Invalid union, headers don't match ${a.join(", ")} <> ${b.join(", ")}`;
    }

    count () {
        return this.a.count() * this.b.count();
    }

    get header () {
        const ah = this.a.header;
        const bh = this.b.header; 

        return ah.concat(bh);
    }

    *values () {
        yield *this.cn(
            function *(x) {
                yield x;
            }
        )([]);
    }

    cn (f) {
        return this.a.cn(
            this.b.cn(f)
        );
    }
}

CSet.prototype.crossProduct =  function crossProduct (s) {
    return new CrossProduct(this, s);
};

module.exports = CrossProduct;

