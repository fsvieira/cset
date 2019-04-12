const CSet = require("./cset");

class Alias extends CSet {
    constructor(a, name) {
        super();
        this.a = a;
        this.name = name || `set_${aliasCounter++}`;
    }

    get header () {
        const header = this.a.header;

        if (header instanceof Array) {
            return header.map(h => `${this.name}.${h}`);
        }

        return this.name;
    }

    has (x) {
        return this.a.has(x);
    }

    *values () {
        yield *this.a.values();
    }

    toJSON () {
        return {
            name: "Alias",
            header: this.header,
            alias: this.name,
            a: this.a.toJSON()
        };
    }

    projection (...h) {
        const header = this.header;
        const hs = header instanceof Array?header:[header];
        const ah = this.a.header;
        const aHeader = ah instanceof Array?ah:[ah];
        const aProjection = [];

        for (let i=0; i<h.length; i++) {
            const a = h[i];
            const index = hs.indexOf(a);
            if (index === -1) {
                errorHeaderNotFound(a, hs);
            }
            else {
                aProjection.push(aHeader[index]);
            }
        }

        if (h.length === header.length) {
            return this;
        }

        return this.a.projection(...aProjection).as(this.name);
    }
}

CSet.prototype.as = function (name) {
    return new Alias(this, name);
};

module.exports = Alias;

