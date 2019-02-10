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

    get header () {
        if (this.a && this.b) {
            return this.a.header.concat(this.b.header);
        }
        else {
            return this.a.header;
        }
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
        if (
            s instanceof CartesianSet &&
            this.length === s.length
        ) {
            // (A x B) /\ (C x D) = (A x C) /\ (B x D)
            return this.a.intersect(s.a).cartesianProduct(
                this.b.intersect(s.b)
            );
        }
        
        return emptySet;
    }

    difference (s) {
        if (
            s instanceof CartesianSet &&
            this._length === s._length
        ) {
            // (A x C) \ (B x D) = [A x (C \ D)] \/ [(A \ B) x C]
            return new Union(
                this.a.cartesianProduct(
                this.b.difference(s.b)
                ), 
                this.a.difference(s.a).cartesianProduct(this.b)
            );
        }

        return this;
    }

    union (s) {
        if (
            s instanceof CartesianSet &&
            this._length === s._length
        ) {
            // (A x C) \/ (B x D) = [(A \ B) x C] \/ [(A /\ B) x (C \/ D)] \/ [(B \ A) x D]

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
        
        return new Union(
            this,
            s
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


class Difference extends Op {
    constructor (a, b) {
        super();
        this.a = a;
        this.b = b;
    }

    has (x) {
        return this.a.has(x) && !this.b.has(x);
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
        return [this.name];
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
            if (!header.includes(a)) {
                throw `Alias ${a} in constrain ${name} is not found on headers ${header.join(", ")}`;
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

    get header () {
        return [this.name];
    }

    values () {
        return new Set([...this._values]);
    }
}

const emptySet = new ArraySet([]);


module.exports = ArraySet;
