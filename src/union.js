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
            const aGrid = this.a.getGrid();
            const bGrid = this.b.getGrid();
    
            const grid = this.grid = {
                cells: {},
                positions: new Set(aGrid.positions.concat(bGrid.positions))
            };
    
            for (let i=0; i<grid.positions.length; i++) {
                const position = grid.positions[i];

                const aCell = aGrid.cells[position];
                const bCell = bGrid.cells[position];

                const abCell = {
                    count: aCell.count + bCell.count,
                    min: aCell.min > bCell.min?bCell.min:aCell.min,
                    max: aCell.max > bCell.max?aCell.max:bCell.max
                };

                const elCount = (abCell.max - abCell.min) + 1; 

                if (elCount < abCell.count) {
                    abCell.count = elCount;
                    abCell.intersect = abCell.count - elCount;
                }
    
                this.grid.cells[aPosition] = abCell;
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

    *values (min, max) {
        yield *this.a.values(min, max);

        for (let e of this.b.values(min, max)) {
            if (!this.a.has(e)) {
                yield e;
            }
        }
    }


    reorder (f, a, b) {
        return function *(x) {
            const y = x.slice(-b.length);
            x = x.slice(0, x.length - b.length);
            x = x.concat(reorder(a, b, y));

            yield *f(x);
        }
    }

    get header () {
        return this.a.header;
    }
}

CSet.prototype.union = function (s) {
    return new Union(this, s);
}

module.exports = Union;

