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
        /*
        const a = this.a.header;
        const b = this.b.header;

        for (let x of this.a.values()) {
            const bx = reorder(b, a, x);

            if (this.b.has(bx)) {
                yield x;
            }
        }
        */
       // yield *this.compile()();

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

    compile (p) {
        const a = this.a.header;
        const b = this.b.header;

        const aIt = this.a.compile(p);
        const has = x => this.b.has(reorder(b, a, x));

        return function *() {
            for (let x of aIt()) {
                if (has(x)) {
                    yield x;
                }
            }
        }
    }
}

CSet.prototype.intersect = function intersect (s) {
    return new Intersect(this, s);
};


module.exports = Intersect;

