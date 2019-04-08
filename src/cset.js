let aliasCounter = 1;

// TODO: should normalize header to always be an array??

const {reorder} = require("./utils");

class CSet {
    constructor () {
        this.name = `set_${aliasCounter++}`;
    }

    symmetricDifference (s) {
        return this.union(s).difference(this.intersect(s));
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
}

module.exports = CSet;

