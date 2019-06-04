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
        /*
        for (let x of this.a.values()) {
            const a = (x instanceof Array)?x:[x];

            for (let y of this.b.values()) {
                const r = a.concat(
                    y instanceof Array?y:[y]
                );

                yield r;
            }
        }*/
        // yield *this.compile()();
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

    filter (header, p) {
        const r = {};
        
        for (let a in p) {
            const c = p[a];

            const t = c.alias.filter(v => header.indexOf(v) === -1);
            if (t.length === 0) {
                r[a] = p[a];
                delete p[a];
            }
        }

        return r;
    }

    compile (p) {
        const ah = this.a.header;
        const bh = this.b.header;

        const pa = this.filter(ah, p);
        const pb = this.filter(bh, p);

        const ca = this.a.compile(pa);
        const cb = this.b.compile(pb);

        const pc = this.toFunc(p);
        const header = this.header;

        return function *() {
            for (let x of ca()) {
                const a = (x instanceof Array)?x:[x];

                for (let y of cb()) {
                    const r = a.concat(
                        y instanceof Array?y:[y]
                    );

                    if (!pc || pc(header, r)) {
                        yield r;                
                    }
                }
            }
        }
    }
}

CSet.prototype.crossProduct =  function crossProduct (s) {
    return new CrossProduct(this, s);
};

module.exports = CrossProduct;

