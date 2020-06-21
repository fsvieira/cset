let aliasCounter = 1;

class CSet {
    constructor () {
        this.id = aliasCounter++;
        this.name = `set_${this.id}`;
        this.cellSize = 10;
    }

    compare (a, b) {
        const ar = a instanceof Array?a:[a];
        const br = b instanceof Array?b:[b];

        if (ar.length === br.length) {
            for (let i=0; i<ar.length; i++) {
                const ae = ar[i];
                const be = br[i];

                if (ae !== be) {
                    return ae - be;
                }
            }

            return 0;
        }

        return ar.length - br.length;
    }

    min (a, b) {
        const c = this.compare(a, b);
        if (c <= 0) {
            return a;
        }

        return b;
    }

    max (a, b) {
        const c = this.compare(a, b);
        if (c >= 0) {
            return a;
        }

        return b;
    }

    // -- Grid utils end.

    symmetricDifference (s) {
        return this.union(s).difference(this.intersect(s));
    }

    // test methods,
    isEmpty () {
        return this.values().next().done;
    }

    isSubset (x) {
        return !this.intersect(x).isEmpty() && this.difference(x).isEmpty();
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

    toJSON () {
        const json={sets: {}, start: this.id};
        this._toJSON(json);

        return json;
    }

    _toJSON (json) {
        if (!json.sets[this.id]) {
            const j = json.sets[this.id] = {
                name: this.constructor.name,
                header: this.header
            };

            if (this.a) {
                this.a._toJSON(json);
                j.a = this.a.id;
            }

            if (this.b) {
                this.b._toJSON(json);
                j.b = this.b.id;
            }
        }
    }

    toDot () {
        const dot = {states: [], transitions: ""};
        this._toDot(dot);
        const g = 'digraph SetGraph {' +
            'rankdir=LR;' +
            'size="8,5"' +
            'node [shape = circle];\n' +
                dot.transitions +
            '}';

        return g;
    }

    stateName () {
        return `${this.constructor.name}_${this.id}__${this.header.join("_")}`;
    }

    _toDot (dot) {
        const id = this.stateName();

        if (!dot.states.includes(id)) {
            dot.states.push(id);

            if (this.a) {
                const aid = this.a.stateName();
                dot.transitions += `\t${id} -> ${aid};\n`; 
                this.a._toDot(dot);
                
            }

            if (this.b) {
                const bid = this.b.stateName();
                dot.transitions += `\t${id} -> ${bid};\n`; 
                this.b._toDot(dot);
            }
        }
    }
}

module.exports = CSet;

