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

        // this.test = test;

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

            if (!parcial || parcial(hs, vs)) {
                if (hs.length === alias.length) {
                    const r = test(...vs);

                    return r;
                }

                return true;
            }

            return false;
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
        // return this.test(this.a.header, x) && this.a.has(x);
        return this.selector(this.a.header, x instanceof Array?x:[x]) && this.a.has(x);
    }

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

CSet.prototype.select = function (alias, {name, predicate, parcial}) {
    return new Select (
        this,
        name,
        alias,
        predicate || ((...values) => parcial(this.header, values)),
        parcial
    );
};

module.exports = Select;
