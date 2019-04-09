const CSet = require("./cset");
const {reorder} = require("./utils");

class Select extends CSet {
    constructor (a, name, alias, predicate) {
        super();

        const header = a.header;

        if (header instanceof Array) {
            for (let i=0; i<alias.length; i++) {
                const a = alias[i];
                if (!header.includes(a)) {
                    throw new Error(`Alias ${a} in constrain ${name} is not found on headers ${header.join(", ")}`);
                }
            }
        }
        else if (alias.length !== 1 || header !== alias[0]) {
            throw new Error(`Alias ${alias.join(", ")} in constrain ${name} is not found on headers ${header}`);
        }

        this.a = a;
        this.name = name;
        this.alias = alias;
        this.predicate = predicate;
    }

    rename (a, renameTable) {
        return new Select(
            a,
            this.name,
            this.alias.map(v => renameTable.get(v)),
            this.predicate
        );
    }

    test (header, x) {
        if (this.canApply(header)) {
            const arg = [];
            for (let i=0; i<this.alias.length; i++) {
                const alias = this.alias[i];

                if (header instanceof Array) {
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

    *values () {
        for (let e of this.a.values()) {
            if (this.test(this.a.header, e)) {
                yield e;
            }
        }
    }

    canApply (header) {
        for (let i=0; i<this.alias.length; i++) {
            const a = this.alias[i];
            if (header instanceof Array) {
                if (!header.includes(a)) {
                    return false;
                }
            }
            else if (header !== a) {
                return false;
            }
        }

        return true;
    }

    select (alias, {name, predicate}) {
        // if select has same header we can merge both selects into one.
        const header = this.header;

        for (let i=0; i<alias.length; i++) {
            const a = alias[i];
            if (!header.includes(a)) {
                return super.select(alias, {name, predicate});
            }
        }

        if (alias.length === header.length) {
            // we can join both selections, headers are the same.
            const tp = this.predicate;
            const talias = this.alias;

            return new Select(
                this.a,
                `${this.name}(${name})`,
                this.alias,
                (...args) => tp(args) && predicate(reorder(talias, alias, args))
            );
        }
        else {
            return new Select(
                this.a.select(alias, {name, predicate}),
                this.name,
                this.alias,
                this.predicate
            );
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

