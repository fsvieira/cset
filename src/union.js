const CSet = require("./cset");
const {reorder} = require("./utils");

class Union extends CSet {

    constructor (a, b) {
        super();

        const ah = a.header;
        const bh = b.header;
        
        this.a = a;
        this.b = b;

        if (ah.length === bh.length) {
            if (ah.length === 1) {
                return;
            }

            const h = new Set([...ah, ...bh]);

            if (h.size === bh.length) {
                return;
            }
        }

        throw `Invalid union, headers don't match ${ah.join(", ")} <> ${bh.join(", ")}`;
    }

    has (x) {
        return this.a.has(x) || this.b.has(
            reorder(this.b.header, this.a.header, x)
        );
    }

    count () {
        return this.a.count() + this.b.count() - this.a.intersect(this.b).count();
    }

    *values () {
        let f;
        if (this.header.length === 1) {
            f = function *(x) {
                yield x[0]
            };
        }
        else {
            f = function *(x) {
                yield x;
            };
        }

        yield *this.cn(f)([]);
    }


    reorder (f, a, b) {
        return function *(x) {
            const y = x.slice(-b.length);
            x = x.slice(0, x.length - b.length);
            x = x.concat(reorder(a, b, y));

            yield *f(x);
        }
    }

    cn (f) {
        let alias = this.b.header;

        if (alias.length > 1) {
            alias = this.a.header;
        }

        const ff = this.reorder(f, this.a.header, this.b.header);

        const af = this.a.cn(f);
        const bf = this.b.select(
            alias, 
            {
                name: "union",
                predicate: (...x) => {
                    if (x.length === 1) {
                        return !this.a.has(x[0]);
                    }

                    return !this.a.has(x);
                }
            }
        ).cn(ff);

        return function *(x) {
            yield *af(x);
            yield *bf(x);    
        };
    }

    get header () {
        return this.a.header;
    }
}

CSet.prototype.union = function (s) {
    return new Union(this, s);
}

module.exports = Union;

