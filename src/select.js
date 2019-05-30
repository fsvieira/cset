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
        /*
        for (let e of this.a.values()) {
            if (this.test(this.a.header, e)) {
                yield e;
            }
        }*/
        yield *this.compile()();
    }

    get header () {
        return this.a.header;
    }

    stateName () {
        return `${this.constructor.name}_${this.id}__${this.alias.join("_")}`;
    }

    compile (p={}) {
        const a = this.alias.slice().sort();
        const key = JSON.stringify(a);

        const po = p[key];
        if (po) {
            const pf = po.f;
            po.f = (header, x) => pf(header, x) && this.test(header, x); 
        }
        else {
            p[key] = {
                alias: a,
                f: (header, x) => this.test(header, x)
            };
        }

        const aIt = this.a.compile(p); 

        return function *() {
            yield *aIt();
        }
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
