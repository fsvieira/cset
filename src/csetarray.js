const CSet = require("./cset");
// const {errorHeaderNotFound} = require("./utils");

class CSetArray extends CSet {
    constructor (values) {
        super();
        this.sValues = values.slice().sort();
    }

    calcGrid () {
        if (!this.grid) {
            const values = this.sValues;

            this.grid = {
                cells: {},
                positions: []
            };

            const dups = [];

            for (let i=0; i<values.length; i++) {
                const value = values[i];
                const p = Math.floor(value/this.cellSize);
                const position = [p];
                
                const cell = this.grid.cells[position] = this.grid.cells[position] || {count: 0, min: Infinity, max: 0};

                cell.min = value < cell.min?value:cell.min;
                cell.max = value > cell.max?value:cell.max;
                cell.count++;

                if (!dups.includes(p)) {
                    dups.push(p);
                    this.grid.positions.push(position);
                }
            }

            this.grid.positions.sort((a, b) => this.compare(a, b));
        }

        return this.grid;
    }

    has (x) {
        x = x instanceof Array && x.length===1?x[0]:x;

        return this.sValues.includes(x);
    }

    count () {
        return this.sValues.length;
    }

    get header () {
        return [this.name];
    }

    /*
    *values (min=0, max=Infinity) {
        for (let e of this.sValues) {
            if (e >= min && e <=max) {
                yield e;
            }
        }
    }*/
    *values (min=0, max=Infinity, selector) {
        if (!selector) {
            yield *this.sValues.filter(e => e >= min && e <=max);
        }
        else {
            for (let e of this.sValues) {
                if (e >= min && e <=max && selector(this.header, [e])) {
                    yield e;
                }
            }
        }
    }
}

module.exports = CSetArray;

