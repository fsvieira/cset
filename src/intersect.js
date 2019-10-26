const CSet = require("./cset");
const {reorder} = require("./utils");

class Intersect extends CSet {
    constructor (a, b) {
        super();
        this.a = a;
        this.b = b;

        const ah = a.header;
        const bh = b.header;

        if (ah.length === bh.length) {
            if (ah.length === 1) {
                return;
            }

            const h = new Set([...ah, ...bh]);

            if (h.size === ah.length) {
                return;
            }
        }

        throw `Invalid intersect, headers don't match ${ah.join(", ")} <> ${bh.join(", ")}`;
    }

    calcGrid () {
        if (!this.grid) {
            const aGrid = this.a.getGrid();
            const bGrid = this.b.getGrid();
    
            this.grid = {
                cells: {},
                positions: []
            };
    
            for (let i=0; i<aGrid.positions.length; i++) {
                const aPosition = aGrid.positions[i];
                const bCell = bGrid.cells[aPosition];
    
                if (bCell) {
                    const aCell = aGrid.cells[aPosition];
                    const abCell = {
                        count: aCell.count < bCell.count?aCell.count:bCell.count,
                        min: aCell.min < bCell.min?bCell.min:aCell.min,
                        max: aCell.max < bCell.max?aCell.max:bCell.max
                    };
    
                    const elCount = (abCell.max - abCell.min) + 1; 
    
                    if (elCount > 0) {
                        if (elCount < abCell.count) {
                            abCell.count = elCount;
                        }
        
                        this.grid.cells[aPosition] = abCell;
                        this.grid.positions.push(aPosition);
                    }
                }
            }    
        }

        return this.grid;
    }

    has (x) {
        return this.a.has(x) && this.b.has(
            reorder(this.b.header, this.a.header, x)
        );
    }

    count () {
        let counter = 0;
        for (let e of this.values()) {
            counter++;
        }

        return counter;
    }

    *values (min, max) {
        const grid = this.calcGrid();

        for (let i=0; i<grid.positions.length; i++) {
            const position = grid.positions[i];
            const cell = this.grid.cells[position];

            if (
                (min === undefined || this.compare(min, cell.max) <= 0) && 
                (max === undefined || this.compare(max, cell.min) >= 0)
            ) {
                for (let e of this.a.values(min, max)) {
                    if (this.b.has(e)) {
                        yield e;
                    }
                }
            }
        }
    }

    get header () {
        return this.a.header;
    }
}

CSet.prototype.intersect = function intersect (s) {
    return new Intersect(this, s);
};


module.exports = Intersect;

