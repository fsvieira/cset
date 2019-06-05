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

        if (alias.length > 1) {
            alias = this.b.header;
        }

        return this.a.select(
            alias,
            {
                name: "intersect",
                predicate: (...x) => {
                    if (x.length === 1) {
                        return this.b.has(x[0]);
                    }

                    return this.b.has(x);
                }
            }
        ).cn(f);
    }

    get header () {
        return this.a.header;
    }

}

CSet.prototype.intersect = function intersect (s) {
    return new Intersect(this, s);
};


module.exports = Intersect;

