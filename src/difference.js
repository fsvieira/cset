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
        let f;

        if (this.header.length === 1) {
            f = function *(x) {
                yield x[0];
            };
        }
        else {
            f = function *(x) {
                yield x;
            };
        }

       yield *this.cn(f)([]);
    }

    cn (f) {
        let alias = this.a.header;
        let predicate = x => !this.b.has(x);

        if (alias.length > 1) {
            alias = this.b.header;
            predicate = (...x) => !this.b.has(x);
        }

        return this.a.select(
            alias,
            {
                name: "difference",
                predicate
            }
        ).cn(f);
    }

    get header () {
        return this.a.header.concat(this.b.header);
    }
}

CSet.prototype.difference = function (s) {
    return new Difference(this, s); 
};

module.exports = Difference;
