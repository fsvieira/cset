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

            for (let i=0; i<values.length; i++) {
                const value = values[i];
                const position = Math.floor(value/this.cellSize);
                const cell = this.grid.cells[position] = this.grid.cells[position] || {count: 0, min: Infinity, max: 0};

                cell.min = value < cell.min?value:cell.min;
                cell.max = value > cell.max?value:cell.max;
                cell.count++;

                if (!this.grid.positions.includes(position)) {
                    this.grid.positions.push(position);
                }
            }

            this.grid.positions.sort();
        }

        return this.grid;
    }

    has (x) {
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
    *values (selector) {
        if (!selector) {
            yield *this.sValues;
        }
        else {
            for (let e of this.sValues) {
                const [isElement] = selector(this.header, [e]);
                if (isElement) {
                    yield e;
                }
            }
        }
    }
}

module.exports = CSetArray;

