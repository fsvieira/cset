const CSet = require("./cset");

/*
class ConstrainsGroup {

    constructor (cs) {
        this.constrains = cs || [];
    }

    add (c) {
        this.constrains.push(c);
        return this;
    }
    
    filter (a) {
        const header = a.header;

        const cs = this.constrains.filter(v => v.canApply(header));

        if (cs.length === this.constrains.length) {
            return this;
        }
        else if (cs.length > 0) {
            return new ConstrainsGroup(cs);
        }
    }

    rename (a, renameTable) {
        return new ConstrainsGroup(
            this.constrains.map(v => v.rename(a, renameTable))
        );
    }

    test (header, x) {
        for (let i=0; i<this.constrains.length; i++) {
            const c = this.constrains[i];
            if (!c.test(header, x)) {
                return false;
            }
        }

        return true;
    }
}
*/

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

