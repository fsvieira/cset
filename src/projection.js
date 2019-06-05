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
        yield *this.cn(
            function *(x) {
                if (x.length === 1) {
                    yield x[0];
                }
                else {
                    yield x;
                }
            }
        )([]);
    }

    cn (f) {
        const header = this.a.header;
        const prj = this._header;
        const dups = new Set();

        return this.a.cn(
            function *(x) {
                const al = header.length;
                const a = x.slice(-al);
                const b = x.slice(0, x.length - al);

                const p = [];

                for (let i=0; i<prj.length; i++) {
                    const h = prj[i];
                    const index = header.indexOf(h);
                    p.push(a[index]);
                }

                const d = JSON.stringify(p);

                if (!dups.has(d)) {
                    dups.add(d);                    
                    const y = b.concat(p);

                    yield *f(y);
                }
            }
        );
    }

    count () {
        return [...this.values()].length;
    }
}

CSet.prototype.projection =  function projection (...h) {
    return new Projection(this, h);
}

module.exports = Projection;

