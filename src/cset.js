let aliasCounter = 1;

// TODO: should normalize header to always be an array??

const {reorder} = require("./utils");

class CSet {
    constructor () {
        this.name = `set_${aliasCounter++}`;
    }

    union (s) {
        if (this.isEmpty()) {
            return s;
        }
        else if (s.isEmpty()) {
            return this;
        }

        return new Union(this, s);
    }

    intersect (s) {
        return new Intersect(this, s);
    }

    difference (s) {
        return new Difference(this, s); 
    }

    crossProduct (s) {
        return new CrossProduct(this, s);
    }

    symmetricDifference (s) {
        return this.union(s).difference(this.intersect(s));
    }

    as (name) {
        return new Alias(this, name);
    }

    select (alias, {name, predicate}) {
        return new Constrain (
            this,
            name,
            alias,
            predicate
        );
    }

    // test methods,
    isEmpty (p) {
        return this.values(p).next().done;
    }

    isSubset (x) {
        return this.difference(x).isEmpty() && 
            !this.intersect(x).isEmpty();
    }

    isProperSubset (x) {
        return this.isSubset(x) && !x.isSubset(this);
    }

    isSuperset (x) {
        return x.isSubset(this);
    }

    isProperSuperset (x) {
        return x.isProperSubset(this);
    }

    isEqual (x) {
        return this.isSubset(x) && x.isSubset(this);
    }

    count () {
        return this.a.count();
    }

    get header () {
        if (this.a) {
            return this.a.header || this.name;
        }
        
        return this.name;
    }

    get _length () {
        const h = this.header;
        if (h instanceof Array) {
            return h.length;
        }

        return 1;
    }

    projection (...h) {
        const header = this.header;
        if (header instanceof Array) {
            return new Projection(this, h);
        }
        else if (
            h.length === 1 && header === h[0] 
        ) {
            return this;
        }

        throw "Projection headers " + h.join(", ") + " dont match with set header " + header + ".";
    }
}

class Projection extends CSet {
    constructor (a, h) {
        super();
        this.a = a;
        this._header = h;

        if (new Set(h) === h.length) {
            throw "Repeated headers are not allowed, " + h.join(", ");
        }

        const ah = a.header;

        for (let i=0; i<h.length; i++) {
            const p = h[i];
            if (!ah.includes(p)) {
                throw "Missing header on projected set: " + p + ", source header " + ah.join(", "); 
            }
        }
    }

    // TODO: Projection counting.

    has (x) {
        const s = this.constrain(this._header, {
            name: "prj",
            predicate: (...args) => {
                for (let i=0; i<args.length; i++) {
                    if (args[i] !== x[i]) {
                        return false;
                    }
                }

                return true;
            }
        });

        return !s.isEmpty();
    }

    get header () {
        return this._header;
    }

    *values (p) {
        const ah = this.a.header;
        const ar = ah.filter(v => this._header.includes(v));
        const dups = new Set();

        for (let e of this.a.values(p)) {
            // remove values from result,
            const v = [];
            for (let i=0; i<ah.length; i++) {
                const h = ah[i];
                if (this._header.includes(h)) {
                    v.push(e[i]);
                }
            }
            
            // reorder,
            const r = reorder(ar, this._header, v);
            const d = JSON.stringify(r);

            if (!dups.has(d)) {
                dups.add(d);
                yield r;
            }
        }
    }

    couunt () {
        return [...this.values()].length;
    }
}

class CrossProduct extends CSet {
    constructor (a, b) {
        super();
        this.a = a;
        this.b = b;

        const h = this.header;
        const s = new Set(h);

        if (h.length !== s.size) {
            throw `Repeated headers are not allowed ${h.join(", ")}`;
        }
    }
    
    get _length () {
        return this.a._length + this.b._length;
    }

    has (x) {
        if (x instanceof Array) {
            const aLength = this.a._length;
            const bLength = this.b._length;
            const total = aLength + bLength;
            
            if (x.length === total) {
                const a = x.slice(0, aLength);
                const b = x.slice(aLength, total);

                return this.a.has(a.length===1?a[0]:a) && 
                    this.b.has(b.length===1?b[0]:b);
            }
        }

        return false;
    }

    intersect (s) {
        const a = this.header;
        const b = s.header;

        if (a instanceof Array && b instanceof Array && a.length === b.length) {
            const h = new Set([...a, ...b]);

            if (h.size === b.length) {
                return new Intersect(this, s);
            }
        }

        throw `Invalid intersect, headers don't match ${
            a instanceof Array?a.join(", "):a
        } <> ${
            b instanceof Array?b.join(", "):b
        }`;

    }

    difference (s) {
        const a = this.header;
        const b = s.header;

        if (a instanceof Array && b instanceof Array && a.length === b.length) {
            const h = new Set([...a, ...b]);

            if (h.size === b.length) {
                return new Difference(this, s);
            }
        }

        throw `Invalid difference, headers don't match ${
            a instanceof Array?a.join(", "):a
        } <> ${
            b instanceof Array?b.join(", "):b
        }`;
    }

    union (s) {
        const a = this.header;
        const b = s.header;

        if (a instanceof Array && b instanceof Array && a.length === b.length) {
            const h = new Set([...a, ...b]);

            if (h.size === b.length) {
                return new Union(this, s);
            }
        }

        throw `Invalid union, headers don't match ${
            a instanceof Array?a.join(", "):a
        } <> ${
            b instanceof Array?b.join(", "):b
        }`;
    }

    count () {
        return this.a.count() * this.b.count();
    }

    get header () {
        const ah = this.a.header;
        const bh = this.b.header; 

        return (ah instanceof Array?ah:[ah]).concat(
            bh instanceof Array?bh:[bh]
        );
    }

    *values (p) {

        let f, pa, pb, header;
        if (p) {
            f = p.filter(this);
            pa = p.filter(this.a);
            pb = p.filter(this.b);

            header = this.header;
        }

        for (let x of this.a.values(pa)) {
            const a = (x instanceof Array)?x:[x];

            for (let y of this.b.values(pb)) {
                const r = a.concat(
                    y instanceof Array?y:[y]
                );

                if (!f || f.test(header, r)) {
                    yield r;
                }
            }
        }
    }
}

class Difference extends CSet {
    constructor (a, b) {
        super();
        this.a = a;
        this.b = b;
    }

    has (x) {
        return this.a.has(x) && !this.b.has(
            reorder(this.b.header, this.a.header, x)
        );
    }

    count () {
        return this.a.count() - this.a.intersect(this.b).count();
    }

    *values (p) {
        const a = this.a.header;
        const b = this.b.header;

        for (let x of this.a.values(p)) {
            const bx = reorder(b, a, x);

            if ((!p || p.test(b, bx)) && !this.b.has(bx)) {
                yield x;
            }
        }
    }
}

class Intersect extends CSet {
    constructor (a, b) {
        super();
        this.a = a;
        this.b = b;
    }

    has (x) {
        return this.a.has(x) && this.b.has(
            reorder(this.b.header, this.a.header, x)
        );
    }

    count () {
        let counter = 0;
        for (let e of this.values()) {
            counter++;
        }

        return counter;
    }

    *values (p) {
        const a = this.a.header;
        const b = this.b.header;

        for (let x of this.a.values(p)) {
            const bx = reorder(b, a, x);

            if ((!p || p.test(b, bx)) && this.b.has(bx)) {
                yield x;
            }
        }
    }
}

class Union extends CSet {

    constructor (a, b) {
        super();
        this.a = a;
        this.b = b;
    }

    has (x) {
        return this.a.has(x) || this.b.has(
            reorder(this.b.header, this.a.header, x)
        );
    }

    count () {
        return this.a.count() + this.b.count() - this.a.intersect(this.b).count();
    }

    *values (p) {
        for (let x of this.a.values(p)) {
            yield x;
        }

        const a = this.a.header;
        const b = this.b.header;

        // map values to headers,
        for (let x of this.b.values(p)) {
            x = reorder(a, b, x);

            if ((!p || p.test(a, x)) && !this.a.has(x)) {
                yield x;
            }
        }
    }
}

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

    get renameTable () {
        if (this._renameTable) {
            return this._renameTable;
        }
        else {
            const header = this.header;
            const aHeader = this.a.header;

            const renameTable = new Map();

            if (header instanceof Array) {
                for (let i=0; i<header.length; i++) {
                    renameTable.set(header[i], aHeader[i]);
                }
            }
            else {
                renameTable.set(header, aHeader);
            }

            this._renameTable = renameTable;
            return renameTable;
        }
    }

    has (x) {
        return this.a.has(x);
    }

    *values (p) {
        // rewrite constrains,
        if (p) {
            p = p.rename(this.a, this.renameTable);
        }

        for (let e of this.a.values(p)) {
            yield e;
        }
    }
}


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

class Constrain extends CSet {
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
        return new Constrain(
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

    *values (p) {
        p = (p || new ConstrainsGroup()).add(this);

        for (let e of this.a.values(p)) {
            yield e;
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

class CSetArray extends CSet {
    constructor (values) {
        super();
        this._values = new Set(values);
    }

    has (x) {
        return this._values.has(x);
    }

    count () {
        return this._values.size;
    }

    get header () {
        return this.name;
    }

    *values (p) {
        if (p) {
            const header = [this.header];

            for (let e of this._values) {
                if (p.test(header, [e])) {
                    yield e;
                }
            } 
        }
        else {
            for (let e of this._values) {
                yield e;
            }
        }
    }
}

module.exports = {
    CSetArray,
    CSet
};


