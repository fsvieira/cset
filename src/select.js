const CSet = require("./cset");

class Select extends CSet {
    constructor (
        a, name, alias, 
        test, 
        parcial
    ) {
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

        this.predicate = test;

        this.selector = (headers, values) => {
            const vs = [];
            const hs = [];

            for (let i=0; i<alias.length; i++) {
                const h = alias[i];
                const index = headers.indexOf(h);
                if (index !== -1) {
                    hs.push(h);
                    vs.push(values[index]);
                }
            }

            if (hs.length === alias.length) {
                const r = test(...vs);

                return r;
            }

            return parcial?parcial(hs, vs):true;
        };
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

    /*
    *values (min, max) {
        for (let e of this.a.values(min, max)) {
            if (this.has(e)) {
                yield e;
            }
        }
    }*/

    *values (min, max, selector) {
        yield *this.a.values(
            min, 
            max, 
            (...args) => 
                this.selector(...args) && (!selector || selector(...args))
        );
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
