const CSet = require("./cset");
const {reorder} = require("./utils");

class Intersect extends CSet {
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

        throw `Invalid intersect, headers don't match ${ah.join(", ")} <> ${bh.join(", ")}`;
    }

    has (x) {
        return this.a.has(x) && this.b.has(
            reorder(this.b.header, this.a.header, x)
        );
    }

    count () {
        let counter = 0;
        for (let e of this.values()) {
            counter++;
        }

        return counter;
    }

    *values (min, max, selector) {
        const aHeader = this.a.header;
        const bHeader = this.b.header;

        yield *this.a.values(
            min, max, (header, values) => {
                if (!selector || selector(header, values)) {
                    if (header.length === aHeader.length) {
                        const be = reorder(aHeader, bHeader, values);
                        return this.b.has(be);
                    }
                    else {
                        return true;
                    }
                }
                
                return false;
            }
        );
    }

    get header () {
        return this.a.header;
    }
}

CSet.prototype.intersect = function intersect (s) {
    return new Intersect(this, s);
};


module.exports = Intersect;

