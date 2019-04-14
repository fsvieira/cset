let aliasCounter = 1;

// TODO: should normalize header to always be an array??
class CSet {
    constructor () {
        this.name = `set_${aliasCounter++}`;
        this.cache = {};
    }

    symmetricDifference (s) {
        return this._union(s).difference(this.intersect(s));
    }

    // test methods,
    isEmpty () {
        return this.values().next().done;
    }

    isSubset (x) {
        return !this._intersect(x).isEmpty() && this.difference(x).isEmpty();
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
        return this === x || (this.isSubset(x) && x.isSubset(this));
    }

    count () {
        return this.a.count();
    }

    get header () {
        throw `'get header ()' method not implemented at '${this.constructor.name}' class`; 
    }
    /*
    TODO: 
    get header () {
        if (this.a) {
            return this.a.header;
        }
        
        return [this.name];
    }*/

    get _length () {
        return this.header.length;
    }

    toJSON () {
        return {
            name: this.constructor.name,
            a: this.a?this.a.toJSON():undefined,
            b: this.b?this.b.toJSON():undefined,
            header: this.header
        };
    }

    *values () {
        /*
        const {values, it} = this.cache.values;
        yield* values;

        while (!this.cache.values.done) {
            const e = it.next();
            if (e.done) {
                this.cache.values.done = e.done;
            }
            else {
                const value = e.value;
                values.add(value);
                yield value;
            }
        }*/

        if (this.cache.values && this.cache.values.isInvalid) {
            yield* this._values();
            return;
        }

        if (this.cache.values) {
            yield* this.cache.values.s;
        }
        else {
            const it = this._values();
    
            this.cache.values = {
                s: new Set(),
                it,
                done: false
            };
        }

        while (!this.cache.values.done) {
            const e = this.cache.values.it.next();

            if (e.done) {
                this.cache.values.done = true;
                return;
            }

            const value = e.value;

            if (this.cache.values.s.size < 1000) {
                this.cache.values.s.add(value);
            }
            else {
                this.cache.values.isInvalid = true;
            }

            yield value;
        }
    }
}

module.exports = CSet;

