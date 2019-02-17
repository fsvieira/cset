let aliasCounter = 1;

class Op {
    constructor () {
        this.name = `set_${aliasCounter++}`;
    }

    union (s) {
        return new Union(this, s);
    }

    intersect (s) {
        return new Intersect(this, s);
    }

    difference (s) {
        return new Difference(this, s); 
    }

    cartesianProduct (s) {
        return new CartesianSet(this, s);
    }

    symetricDifference (s) {
        return this.union(s).difference(this.intersect(s));
    }

    as (name) {
        return new Alias(this, name);
    }

    constrain (alias, {name, predicate}) {
        return new Constrain (
            this,
            name,
            alias,
            predicate
        );
    }

    distinctCartesianProduct (x) {
        return new DistinctCartesianSet(this, x);
    }

    // test methods,
    isEmpty () {
        return this.values().next().done;
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

    permutation (x) {
        return new Permutation(this, x);
    }

    get header () {
        return this.a.header;
    }

    get _length () {
        return 1;
    }
}

class CartesianSet extends Op {
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

    // https://en.wikipedia.org/wiki/Cartesian_product
    intersect (s) {
        const a = this.header;
        const b = s.header;

        if (a instanceof Array && b instanceof Array && a.length === b.length) {
            const h = new Set([...a, ...b]);

            if (h.size === b.length) {
                // (A x B) /\ (C x D) = (A x C) /\ (B x D)
                return this.a.intersect(s.a).cartesianProduct(
                    this.b.intersect(s.b)
                );
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
                // (A x C) \ (B x D) = [A x (C \ D)] \/ [(A \ B) x C]
                return new Union(
                    this.a.cartesianProduct(
                    this.b.difference(s.b)
                    ), 
                    this.a.difference(s.a).cartesianProduct(this.b)
                );
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
                return new Union(
                    this.a.difference(s.a).cartesianProduct(this.b),
                    new Union(
                        this.a.intersect(s.a)
                        .cartesianProduct(this.b.union(s.b)),
                        s.a.difference(this.a)
                        .cartesianProduct(s.b)
                    )
                );
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

    *values () {
        for (let x of this.a.values()) {
            const a = (x instanceof Array)?x:[x];

            for (let y of this.b.values()) {
                const r = a.concat(
                    y instanceof Array?y:[y]
                );

                yield r;
            }
        }
    }
}

class DistinctCartesianSet extends CartesianSet {

    has (x) {
        const al = this.a._length;

        const as = x.slice(0, al);

        for (let i=al; i<x.length; i++) {
            const e = x[i];

            if (as.includes(e)) {
                return false;
            }
        }

        return super.has(x);
    }

    count () {
        let total = 0;
        for (let e of this.values()) {
            total++;
        }

        return total;
    }

    *values () {
        for (let x of this.a.values()) {
            const a = x instanceof Array?x:[x];

            for (let y of this.b.values()) {
                const b = y instanceof Array?y:[y];
                const s = a.filter(x => b.includes(x));

                if (s.length === 0) {
                    yield a.concat(b);
                }
            }
        }
    }
}

class Difference extends Op {
    constructor (a, b) {
        super();
        this.a = a;
        this.b = b;
    }

    has (x) {
        return this.a.has(x) && !this.b.has(x);
    }

    count () {
        return this.a.count() - this.a.intersect(this.b).count();
    }

    *values () {
        for (let x of this.a.values()) {
            if (!this.b.has(x)) {
                yield x; 
            }
        }
    }
}

class Intersect extends Op {
    constructor (a, b) {
        super();
        this.a = a;
        this.b = b;
    }

    has (x) {
        return this.a.has(x) && this.b.has(x);
    }

    count () {
        let counter = 0;
        for (let e of this.values()) {
            counter++;
        }

        return counter;
    }

    *values () {
        for (let x of this.a.values()) {
            if (this.b.has(x)) {
                yield x;
            }
        }
    }
}

class Union extends Op {

    constructor (a, b) {
        super();
        this.a = a;
        this.b = b;
    }

    has (x) {
        return this.a.has(x) || this.b.has(x);
    }

    count () {
        return this.a.count() + this.b.count() - this.a.intersect(this.b).count();
    }

    *values () {
        for (let x of this.a.values()) {
            yield x;
        }

        for (let x of this.b.values()) {
            if (!this.a.has(x)) {
                yield x;
            }
        }
    }

}

class Alias extends Op {
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
        for (let e of this.a.values()) {
            yield e;
        }
    }
}

class Constrain extends Op {
    constructor (a, name, alias, predicate) {
        super();

        const header = a.header;

        for (let i=0; i<alias.length; i++) {
            const a = alias[i];
            const counter = header.filter(x => x === a).length;
            if (counter === 0) {
                throw new Error(`Alias ${a} in constrain ${name} is not found on headers ${header.join(", ")}`);
            }
        }

        this.a = a;
        this.name = name;
        this.alias = alias;
        this.predicate = predicate;
        this._header = header;
    }

    test (x) {
        const arg = {};
        for (let i=0; i<this.alias.length; i++) {
            const alias = this.alias[i];
            const index = this._header.indexOf(alias);

            arg[alias] = x[index];
        }

        return this.predicate(arg);
    }

    count () {
        let counter = 0;
        for (let e of this.values()) {
            counter++;
        }

        return counter;
    }

    has (x) {
        return this.test(x) && this.a.has(x);
    }

    *values () {
        for (let e of this.a.values()) {
            if (this.test(e)) {
                yield e;
            }
        }
    }
}

class ArraySet extends Op {
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

    values () {
        return new Set([...this._values]).values();
    }

}

const emptySet = new ArraySet([]);

module.exports = ArraySet;
