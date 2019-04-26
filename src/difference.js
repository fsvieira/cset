const CSet = require("./cset");
const CSetArray = require("./csetarray");
const {reorder} = require("./utils");

class Difference extends CSet {
    constructor (a, b) {
        super();
        this.a = a;
        this.b = b;
    }

    has (x) {
        return this.a.has(x) && !this.b.has(
            reorder(this.b.header, this.a.header, x)
        );
    }

    count () {
        return this.a.count() - this.a.intersect(this.b).count();
    }

    *values () {
        const a = this.a.header;
        const b = this.b.header;

        for (let x of this.a.values()) {
            const bx = reorder(b, a, x);

            if (!this.b.has(bx)) {
                yield x;
            }
        }
    }

    get header () {
        return this.a.header.concat(this.b.header);
    }

    /** Query */
    eCount () {
        return Math.abs(this.a.eCount() - this.b.eCount());
    }
}

CSet.prototype.difference = function (s) {
    return new Difference(this, s); 
};

module.exports = Difference;
