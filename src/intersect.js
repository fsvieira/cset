const CSet = require("./cset");
const {reorder} = require("./utils");

class Intersect extends CSet {
    constructor (a, b) {
        super();
        this.a = a;
        this.b = b;
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

    *values () {
        const a = this.a.header;
        const b = this.b.header;

        for (let x of this.a.values()) {
            const bx = reorder(b, a, x);

            if (this.b.has(bx)) {
                yield x;
            }
        }
    }

    get header () {
        return this.a.header;
    }

    /** Query */
}

CSet.prototype.intersect = function intersect (s) {
    return new Intersect(this, s);
};


module.exports = Intersect;

