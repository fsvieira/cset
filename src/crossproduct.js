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

    *values () {
        for (let x of this.a.values()) {
            const a = (x instanceof Array)?x:[x];

            for (let y of this.b.values()) {
                const r = a.concat(
                    y instanceof Array?y:[y]
                );

                yield r;
            }
        }
    }

    select (alias, {name, predicate}) {
        const ah = this.a.header;

        let isInA = true;
        for (let i=0; i<alias.length; i++) {
            const a = alias[i];
            if (!ah.includes(a)) {
                isInA = false;
                break;
            }
        }

        if (isInA) {
            // a header contains select.
            return new CrossProduct(
                this.a.select(alias, {name, predicate}),
                this.b
            );
        }
        else {
            const bh = this.b.header;
            for (let i=0; i<alias.length; i++) {
                const a = alias[i];
                if (!bh.includes(a)) {
                    return super.select(alias, {name, predicate});
                }
            }

            // b header contains select.
            return new CrossProduct(
                this.a,
                this.b.select(alias, {name, predicate})
            );
        }
    }

    crossProduct (s) {
        const r = new CrossProduct(this, s);

        const header = r.header;

        const middle = Math.ceil(header.length/2);
        const a = header.slice(0, middle);
        const b = header.slice(middle, header.length);

        return new CrossProduct(
            r.projection(...a),
            r.projection(...b)
        );
    }

    projection (...h) {
        const ah = this.a.header;
        const bh = this.b.header;

        const aHeader = ah instanceof Array?ah:[ah];
        const bHeader = bh instanceof Array?bh:[bh];

        const ap = h.filter(v => aHeader.includes(v));
        const bp = h.filter(v => bHeader.includes(v));

        if (ap.length + bp.length !== h.length) {
            throw `Projection headers ${h.join(", ")} are missing from set headers ${aHeader.concat(bHeader).join(", ")}.`;
        }
        
        if (ap.length > 0 && bp.length > 0) {
            return new CrossProduct(
                this.a.projection(...ap),
                this.b.projection(...bp)
            );
        }
        else if (ap.length > 0) {
            return this.a.projection(...h);
        }

        return this.b.projection(...h);
    }
}

CSet.prototype.crossProduct =  function crossProduct (s) {
    return new CrossProduct(this, s);
};

module.exports = CrossProduct;

