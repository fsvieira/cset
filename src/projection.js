const CSet = require("./cset");
const {
    reorder, 
    // errorHeaderNotFound
} = require("./utils");


class Projection extends CSet {
    constructor (a, h) {
        super();
        this.a = a;

        this._header = h; // h.length === 1?h[0]:h;

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
        const aHeader = this.a.header;

        const ar = aHeader.filter(v => this._header.includes(v));
        const dups = new Set();

        for (let e of this.a.values()) {
            // remove values from result,
            const v = [];
            for (let i=0; i<aHeader.length; i++) {
                const h = aHeader[i];
                if (this._header.includes(h)) {
                    if (e instanceof Array) {
                        v.push(e[i]);
                    }
                    else {
                        v.push(e);
                    }
                }
            }
            
            // reorder,
            const r = reorder(ar, this._header, v);
            const d = JSON.stringify(r);

            if (!dups.has(d)) {
                dups.add(d);
                if (r.length === 1) {
                    yield r[0];
                }
                else {
                    yield r;
                }
            }
        }
    }

    count () {
        return [...this.values()].length;
    }

    /*
    projection (...h) {
        const header = this.header;

        for (let i=0; i<h.length; i++) {
            const a = h[i];
            if (!header.includes(a)) {
                errorHeaderNotFound(a, header);
            }
        }

        return this.a.projection(...h);
    }*/
}

CSet.prototype.projection =  function projection (...h) {
    return new Projection(this, h);
    /*
    const header = this.header;

    if (h.length < header.length) {
        return new Projection(this, h);
    }
    else if (h.length === header.length) {
        for (let i=0; i<h.length; i++) {
            if (h[i] !== header[i]) {
                return new Projection(this, h);
            }
        }

        // projection is equal,
        return this;
    }

    throw `Projection headers ${h.join(", ")} don't match set header ${hs.join(", ")}`;
    */
}

module.exports = Projection;

