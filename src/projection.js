const CSet = require("./cset");
const {
    reorder, 
    errorHeaderNotFound
} = require("./utils");


class Projection extends CSet {
    constructor (a, h) {
        super();
        this.a = a;

        this._header = h.length === 1?h[0]:h;

        if (new Set(h) === h.length) {
            throw "Repeated headers are not allowed, " + h.join(", ");
        }

        const ah = a.header;

        for (let i=0; i<h.length; i++) {
            const p = h[i];
            if (!ah.includes(p)) {
                throw "Missing header on projected set: " + p + ", source header " + ah.join(", "); 
            }
        }
    }

    // TODO: Projection counting.

    has (x) {
        x = x instanceof Array?x:[x];

        const s = this.select(this._header, {
            name: "prj",
            predicate: (...args) => {
                for (let i=0; i<args.length; i++) {
                    if (args[i] !== x[i]) {
                        return false;
                    }
                }

                return true;
            }
        });

        return !s.isEmpty();
    }

    get header () {
        return this._header;
    }

    *values () {
        const ah = this.a.header;
        const aHeader = ah instanceof Array?ah:[ah];

        const ar = aHeader.filter(v => this._header.includes(v));
        const dups = new Set();

        for (let e of this.a.values()) {
            // remove values from result,
            const v = [];
            for (let i=0; i<aHeader.length; i++) {
                const h = aHeader[i];
                if (this._header.includes(h)) {
                    v.push(e[i]);
                }
            }
            
            // reorder,
            const r = reorder(ar, this._header, v);
            const d = JSON.stringify(r);

            if (!dups.has(d)) {
                dups.add(d);
                yield r;
            }
        }
    }

    couunt () {
        return [...this.values()].length;
    }

    projection (...h) {
        const header = this.header;
        let hs = header instanceof Array?header:[header];

        for (let i=0; i<h.length; i++) {
            const a = h[i];
            if (!hs.includes(a)) {
                errorHeaderNotFound(a, hs);
            }
        }

        return this.a.projection(...h);
    }
}

CSet.prototype.projection =  function projection (...h) {
    const header = this.header;

    if (header === h[0]) {
        return this;
    }
    
    return new Projection(this, h);
}

module.exports = Projection;

