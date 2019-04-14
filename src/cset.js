let aliasCounter = 1;

// TODO: should normalize header to always be an array??
class CSet {
    constructor () {
        this.name = `set_${aliasCounter++}`;
    }

    symmetricDifference (s) {
        return this._union(s).difference(this.intersect(s));
    }

    // test methods,
    isEmpty (p) {
        return this.values(p).next().done;
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
}

module.exports = CSet;

