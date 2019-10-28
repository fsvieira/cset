const CSet = require("./cset");
const {reorder} = require("./utils");

class Difference extends CSet {
    constructor (a, b) {
        super();
        
        this.a = a;
        this.b = b;

        const ah = a.header;
        const bh = b.header;

        if (ah.length === bh.length) {
            if (ah.length === 1) {
                return;
            }

            const h = new Set([...ah, ...bh]);

            if (h.size === ah.length) {
                return;
            }
        }

        throw `Invalid difference, headers don't match ${ah.join(", ")} <> ${bh.join(", ")}`;
    }

    has (x) {
        return this.a.has(x) && !this.b.has(
            reorder(this.b.header, this.a.header, x)
        );
    }

    calcGrid () {
        if (!this.grid) {
            // There is no way to know if intersect cells has different elements, so 
            // we need to make a union grid.
            this.grid = this.a.union(b).getGrid();
        }
        
        return this.grid;
    }

    count () {
        return this.a.count() - this.a.intersect(this.b).count();
    }

    *values (min, max) {
        const aHeader = this.a.header;
        const bHeader = this.b.header;

        for (let e of this.a.values(min, max)) {
            const be = reorder(aHeader, bHeader, e);
            if (!this.b.has(be)) {
                yield e;
            }
        }
    }

    get header () {
        return this.a.header;
    }
}

CSet.prototype.difference = function (s) {
    return new Difference(this, s); 
};

module.exports = Difference;
