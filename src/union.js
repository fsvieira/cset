const CSet = require("./cset");
const {reorder} = require("./utils");

class Union extends CSet {

    constructor (a, b) {
        super();

        const ah = a.header;
        const bh = b.header;
        
        this.a = a;
        this.b = b;

        if (ah.length === bh.length) {
            if (ah.length === 1) {
                return;
            }

            const h = new Set([...ah, ...bh]);

            if (h.size === bh.length) {
                return;
            }
        }

        throw `Invalid union, headers don't match ${ah.join(", ")} <> ${bh.join(", ")}`;
    }

    calcGrid () {
        if (!this.grid) {
            const aHeader = this.a.header;
            const bHeader = this.b.header;

            const aGrid = this.a.getGrid();
            const bGrid = this.b.getGrid();

            const dups = {};
            const allPositions = bGrid.positions.map(p => reorder(aHeader, bHeader, p)).concat(aGrid.positions);
            const positions = [];

            for (let i=0; i<allPositions.length; i++) {
                const p = allPositions[i];

                if (!dups[p]) {
                    dups[p] = true;
                    positions.push(p);
                }
            }

            positions.sort((a, b) => this.compare(a, b));

            const grid = this.grid = {
                cells: {},
                positions
            };
    
            for (let i=0; i<grid.positions.length; i++) {
                const position = grid.positions[i];
                const bPosition = reorder(bHeader, aHeader, position);

                const aCell = aGrid.cells[position];
                const bCell = bGrid.cells[bPosition];

                let cell;
                if (aCell && bCell) {
                    cell = {
                        count: aCell.count + bCell.count,
                        min: this.min(aCell.min, reorder(aHeader, bHeader, bCell.min)),
                        max: this.max(aCell.max, reorder(aHeader, bHeader, bCell.max)),
                        sets: "ab"
                    };
                }
                else if (aCell) {
                    cell = {...aCell, sets: "a"};
                }
                else {
                    cell = {...bCell, sets: "b"}
                }

                const elCount = (cell.max - cell.min) + 1; 

                if (elCount < cell.count) {
                    cell.count = elCount;
                    cell.intersect = cell.count - elCount;
                }
    
                this.grid.cells[position] = cell;
            }
        }

        return this.grid;
    }

    has (x) {
        return this.a.has(x) || this.b.has(
            reorder(this.b.header, this.a.header, x)
        );
    }

    count () {
        return this.a.count() + this.b.count() - this.a.intersect(this.b).count();
    }

    // No order,
    *values (min, max, selector) {
        const aHeader = this.a.header;
        const bHeader = this.b.header;
        
        yield *this.a.values(min, max, selector);
        
        for (let e of this.b.values(min, max, selector)) {
            const r = reorder(aHeader, bHeader, e);

            if (!this.a.has(r)) {
                yield r;
            }
        }
        
        /*
        for (let e of this.b.values(min, max, (header, values) => {
            if (!selector || selector(header, values)) {
                if (header.length === aHeader.length) {
                    const ae = reorder(aHeader, bHeader, values);
                    return !this.a.has(ae);
                }
                else {
                    return true;
                }
            }

            return false;
        })) {
            const r = reorder(aHeader, bHeader, e);

            if (!this.a.has(r)) {
                yield r;
            }
        }*/
    }

    get header () {
        return this.a.header;
    }
}

CSet.prototype.union = function (s) {
    return new Union(this, s);
}

module.exports = Union;

