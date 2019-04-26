const CSet = require("./cset");
const {reorder} = require("./utils");

class Select extends CSet {
    constructor (a, name, alias, predicate) {
        super();

        const header = a.header;

        for (let i=0; i<alias.length; i++) {
            const a = alias[i];
            if (!header.includes(a)) {
                throw new Error(`Alias ${a} in constrain ${name} is not found on headers ${header.join(", ")}`);
            }
        }

        this.a = a;
        this.name = name;
        this.alias = alias;
        this.predicate = predicate;
    }

    test (header, x) {
        if (this.canApply(header)) {
            const arg = [];
            for (let i=0; i<this.alias.length; i++) {
                const alias = this.alias[i];

                if (x instanceof Array) {
                    const index = header.indexOf(alias);
                    arg.push(x[index]);    
                }
                else {
                    arg.push(x);    
                }
            }

            return !!this.predicate(...arg);
        }
        else {
            return true;
        }
    }

    count () {
        let counter = 0;
        for (let e of this.values()) {
            counter++;
        }

        return counter;
    }

    has (x) {
        return this.test(this.a.header, x) && this.a.has(x);
    }

    *_values () {
        for (let e of this.a.values()) {
            if (this.test(this.a.header, e)) {
                yield e;
            }
        }
    }

    canApply (header) {
        for (let i=0; i<this.alias.length; i++) {
            const a = this.alias[i];

            if (!header.includes(a)) {
                return false;
            }
        }

        return true;
    }

    /*
    select (alias, {name, predicate}) {
        if (alias.length > this.alias.length) {
            return super.select(alias, {name, predicate});
        }
        else if (alias.length < this.alias.length) {
            return new Select(
                this.a.select(alias, {name, predicate}),
                this.name,
                this.alias,
                this.predicate
            );
        }

        // else alias are same size
        // check if they are equal,
        for (let i=0; i<alias.length; i++) {
            const a = alias[i];

            if (!this.alias.includes(a)) {
                // they are different, send new select down assuming that 
                // current select is already on right position. 
                return new Select(
                    this.a.select(alias, {name, predicate}),
                    this.name,
                    this.alias,
                    this.predicate
                );
            }
        }

        // alias are equal, select can be merged.
        return new Select(
            this.a,
            `${this.name}(${name})`,
            this.alias,
            (...args) => tp(args) && predicate(reorder(talias, alias, args))
        );
    }

    projection (...h) {
        const header = this.header;

        for (let i=0; i<h.length; i++) {
            const a = h[i];
            if (!header.includes(a)) {
                errorHeaderNotFound(a, hs);
            }
        }

        if (header.length === h.length) {
            // its the same,
            return this;
        }

        const ah = this.alias.filter(v => header.includes(v));

        if (ah.length === this.alias.length) {
            // select alias is a subset of projection alias,
            // send projection down.
            return new Select(
                this.a.projection(...h),
                this.name,
                this.alias,
                this.predicate
            );
        }
        
        // select alias is not a subset of projection alias,
        // keep projection up.
        return new Projection(this, h);
    }*/

    get header () {
        return this.a.header;
    }

    /** Query */
    eCount () {
        const perc = 1 - (this.alias.length / this.header.length);
        const t = Math.ceil(this.a.eCount() * perc) || 1; 
        return t;
    }
}

CSet.prototype.select = function (alias, {name, predicate}) {
    return new Select (
        this,
        name,
        alias,
        predicate
    );
};

module.exports = Select;
