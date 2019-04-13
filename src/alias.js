const CSet = require("./cset");

class Alias extends CSet {
    constructor(a, rename, name, header) {
        super();
        this.a = a;
        // this.name = name || `set_${aliasCounter++}`;
        this._header = (header || this.a.header).slice();

        let index = 0;
        if (!name && this._header.length === 1) {
            this._header[index] = rename;
        }
        else if (name) {
            name = name || this._header[0];
            index = this._header.indexOf(name);

            if (index === -1) {
                throw `Can't find ${name} on set header ${this._header.join(", ")}`;
            }

            this._header[index] = rename;
        }
        else {
            // throw `No replace name is given, replace name is mandatory for set header with size greater than 1.`;
            this._header = this._header.map(v => `${rename}.${v}`);
        }
    }

    get header () {
        return this._header;
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
            a: this.a.toJSON()
        };
    }

    /*
    projection (...h) {
        const header = this._header;
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
    }*/

    as (rename, name) {
        return new Alias(this.a, rename, name, this.header);
    }
}

CSet.prototype.as = function (rename, name) {
    return new Alias(this, rename, name);
};

module.exports = Alias;

