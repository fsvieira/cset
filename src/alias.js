const CSet = require("./cset");

class Alias extends CSet {
    constructor(a, rename, name, header) {
        super();
        this.a = a;
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
        yield *this.cn(
            function *(x) {
                yield x[0];
            }
        )([]);
    }

    as (rename, name) {
        return new Alias(this.a, rename, name, this.header);
    }

    cn (f) {
        return this.a.cn(f);
    }

}

CSet.prototype.as = function (rename, name) {
    return new Alias(this, rename, name);
};

module.exports = Alias;

