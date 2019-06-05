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

    has (x) {
        return this.test(this.a.header, x) && this.a.has(x);
    }

    *values () {
        yield *this.cn(function *(x) {
            yield x;
        })([]);
    }

    get header () {
        return this.a.header;
    }

    stateName () {
        return `${this.constructor.name}_${this.id}__${this.alias.join("_")}`;
    }

    cn (f) {
        const header = this.a.header;
        const t = x => this.test(header, x);

        return this.a.cn(
            function *(x) {
                if (t(x)) {
                    yield *f(x);
                }
            }
        );
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
