let aliasCounter = 1;

// TODO: should normalize header to always be an array??
class CSet {
    constructor () {
        this.id = aliasCounter++;
        this.name = `set_${this.id}`;
        this.cache = {};
    }

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
                j.b = this.a.id;
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

    _toDot (dot) {
        const id = `${this.constructor.name}_${this.id}`;

        if (!dot.states.includes(id)) {
            dot.states.push(id);

            if (this.a) {
                const aid = `${this.a.constructor.name}_${this.a.id}`;
                dot.transitions += `\t${id} -> ${aid};\n`; 
                this.a._toDot(dot);
                
            }

            if (this.b) {
                const bid = `${this.b.constructor.name}_${this.b.id}`;
                dot.transitions += `\t${id} -> ${bid};\n`; 
                this.b._toDot(dot);
            }
        }
    }

    *values () {
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
                s: [],
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

            if (this.cache.values.s.length < 10000) {
                this.cache.values.s.push(value);
            }
            else {
                this.cache.values.isInvalid = true;
            }

            yield value;
        }
    }

    /** Query */
    balance () {
        if (this.a) {
            this.a = this.a.balance();
        }

        if (this.b) {
            this.b = this.b.balance();
        }

        return this;
    }
}

module.exports = CSet;

/*
    Optimizations:
        1. Select:
            a. send select to leafs,
            b. aggregate selects (in one function)
        2. Projection:
            a. send projection to leafs,
            b. remove not needed atributes,
            c. keep only needed projections.
        3. CrossProduct:
            a. Check for equal nodes and share them,
            b. Balance nodes,
        4. Alias:
            a. rename names down,
            b. remove not nedded alias,
        5. **:
            a. Share equal sets,
            b. cache sets with more then one dependecy:
                a. after complete cache remove links down.
            c. order:
                a. move sets with less elements to left side,
                b. move sets with more cached elements to the left side,
                c. on loops start with the set with more elements.

    Optimizations 2:
        - convert union, intersect, difference to select and optimize.
            - intersect:
                a.select(header, (...header) => b.has(header))
                ** a.crossProduct(b).select([a, b], (a, b) => a === b)
        
*/