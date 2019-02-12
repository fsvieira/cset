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

    get header () {
        const ah = this.a.header;

        if (this.b) {
            const bh = this.b.header;
            /*
            const t = ah.length + bh.length;

            if (this._length === t) {
                return ah.concat(bh);
            }
            else {
                return [this.name];
            }*/

            if (ah === bh) {
                return ah;
            }
            else if (ah instanceof Array && bh instanceof Array) {
                return ah.concat(bh);
            }
            else if (ah instanceof Array) {
                return ah.concat([bh]);
            }
            else if (ah instanceof Array) {
                return [ah].concat(bh);
            }

            return `${ah}_${bh}`;
        }

        return ah;
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
            else if (counter > 1) {
                throw new Error(`Alias ${a} is repeated in header, please use "as" to make different alias on header ${header.join(", ")}`);
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
        return this.name;
    }

    values () {
        return new Set([...this._values]).values();
    }
}

const emptySet = new ArraySet([]);


module.exports = ArraySet;
