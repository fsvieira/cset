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
    
    get _length () {
        return this.a._length + this.b._length;
    }

    has (x) {
        if (x instanceof Array) {
            const aLength = this.a._length;
            const bLength = this.b._length;
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

        if (a instanceof Array && b instanceof Array && a.length === b.length) {
            const h = new Set([...a, ...b]);

            if (h.size === b.length) {
                return new Intersect(this, s);
            }
        }

        throw `Invalid intersect, headers don't match ${
            a instanceof Array?a.join(", "):a
        } <> ${
            b instanceof Array?b.join(", "):b
        }`;

    }

    difference (s) {
        const a = this.header;
        const b = s.header;

        if (a instanceof Array && b instanceof Array && a.length === b.length) {
            const h = new Set([...a, ...b]);

            if (h.size === b.length) {
                return new Difference(this, s);
            }
        }

        throw `Invalid difference, headers don't match ${
            a instanceof Array?a.join(", "):a
        } <> ${
            b instanceof Array?b.join(", "):b
        }`;
    }

    union (s) {
        const a = this.header;
        const b = s.header;

        if (a instanceof Array && b instanceof Array && a.length === b.length) {
            const h = new Set([...a, ...b]);

            if (h.size === b.length) {
                return new Union(this, s);
            }
        }

        throw `Invalid union, headers don't match ${
            a instanceof Array?a.join(", "):a
        } <> ${
            b instanceof Array?b.join(", "):b
        }`;
    }

    count () {
        return this.a.count() * this.b.count();
    }

    get header () {
        const ah = this.a.header;
        const bh = this.b.header; 

        return (ah instanceof Array?ah:[ah]).concat(
            bh instanceof Array?bh:[bh]
        );
    }

    *values (p) {

        let f, pa, pb, header;
        if (p) {
            f = p.filter(this);
            pa = p.filter(this.a);
            pb = p.filter(this.b);

            header = this.header;
        }

        for (let x of this.a.values(pa)) {
            const a = (x instanceof Array)?x:[x];

            for (let y of this.b.values(pb)) {
                const r = a.concat(
                    y instanceof Array?y:[y]
                );

                if (!f || f.test(header, r)) {
                    yield r;
                }
            }
        }
    }
}

CSet.prototype.crossProduct =  function crossProduct (s) {
    return new CrossProduct(this, s);
};

module.exports = CrossProduct;

