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

    /*
    projection (...h) {
        const header = this.header;

        if (h.length < header.length) {
            const aHeader = this.a.header;

            const nh = [];
            for (let i=0; i<h.length; i++) {
                const v = h[i];
                const index = aHeader.indexOf(v);
                nh.push(aHeader[index]);
            }
            
            let s = this.a.projection(nh);

            for (let i=0; i<h.length; i++) {
                s = s.as(h[i], nh[i]);
            }

            return s;
        }
        else if (h.length === header.length) {
            for (let i=0; i<h.length; i++) {
                if (h[i] !== header[i]) {
                    return new Projection(this, h);
                }
            }

            // projection is equal,
            return this;
        }

        throw `Projection headers ${h.join(", ")} don't match set header ${hs.join(", ")}`;
    }*/

    as (rename, name) {
        return new Alias(this.a, rename, name, this.header);
    }

    /** Query */
    eCount () {
        return this.a.eCount();
    }
}

CSet.prototype.as = function (rename, name) {
    return new Alias(this, rename, name);
};

module.exports = Alias;

