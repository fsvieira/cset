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

    *values (min, max, selector) {
        const aHeader = this.a.header;

        if (aHeader.length === 1) {
            yield *this.a.values(min, max, selector);
        }
        else {
            const dup = {};
            const indexes = this._header.map(h => aHeader.indexOf(h));

            for (let e of this.a.values(min, max, selector)) {
                const r = indexes.map(i => e[i]);

                if (!dup[r]) {
                    dup[r] = true;

                    if (r.length === 1) {
                        yield r[0];
                    }
                    else {
                        yield r;
                    }
                }
            }
        }
    }

    count () {
        return [...this.values()].length;
    }
}

CSet.prototype.projection =  function projection (...h) {
    return new Projection(this, h);
}

module.exports = Projection;

