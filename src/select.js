const CSet = require("./cset");

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
        const arg = [];

        if (x instanceof Array && x.length > header.length) {
            x = x.slice(-header.length);
        }

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

    count () {
        let counter = 0;
        for (let e of this.values()) {
            counter++;
        }

        return counter;
    }

    getGrid () {
        return this.a.getGrid();
    }
    
    has (x) {
        return this.test(this.a.header, x) && this.a.has(x);
    }

    *values (min, max) {
        /**
         * TODO:
         *  - Test function should test element, but also ranges so that we can eliminate further processing.
         */
        for (let e of this.a.values(min, max)) {
            if (this.has(e)) {
                yield e;
            }
        }
    }

    get header () {
        return this.a.header;
    }

    stateName () {
        return `${this.constructor.name}_${this.id}__${this.alias.join("_")}`;
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
