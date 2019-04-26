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

        /*
        if (a.isEqual(b)) {
            // rename a as b,
            let s = a;
            const bHeader = this.b.header;
            const aHeader = this.a.header;

            for (let i=0; i<bHeader.length; i++) {
                const ah = aHeader[i];
                const bh = bHeader[i];

                s = s.as(bh, ah);
            }

            this.b = s;
        }*/
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
        const rs = new Set();
        for (let x of this.a.values()) {
            const a = (x instanceof Array)?x:[x];

            for (let y of this.b.values()) {
                const r = a.concat(
                    y instanceof Array?y:[y]
                );

                rs.add(r);
                yield r;
            }
        }
    }

    /** Query */
    eCount () {
        return this.a.eCount() * this.b.eCount(); 
    }

    balance () {
        const s = [];
        const header = this.header;

        for (let i=0; i<header.length; i++) {
            const h = header[i];
            s.push(this.projection(h));
        }

        s.sort((a, b) => a.eCount() - b.eCount());

        while (s.length > 1) {
//            s.sort((a, b) => a.eCount() - b.eCount());

            const a = s.shift();
            const b = s.shift();

            s.push(a.crossProduct(b));
        }

        return s[0];
    }

    /*
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
    }*/

    /*
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
        const aHeader = this.a.header;
        const bHeader = this.b.header;

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
    }*/
}

CSet.prototype.crossProduct =  function crossProduct (s) {
    return new CrossProduct(this, s);
    /*
    const r = new CrossProduct(this, s);

    const header = r.header;

    const middle = Math.ceil(header.length/2);
    const a = header.slice(0, middle);
    const b = header.slice(middle, header.length);

    console.log(header, a, b);

    return new CrossProduct(
        r.projection(...a),
        r.projection(...b)
    );*/
};

module.exports = CrossProduct;

