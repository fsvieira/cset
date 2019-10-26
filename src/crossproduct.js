const CSet = require("./cset");

class CrossProduct extends CSet {
    constructor (a, b) {
        super();
        this.a = a;
        this.b = b;

        const h = this.header;
        const s = new Set(h);

        if (h.length !== s.size) {
            throw `Repeated headers are not allowed ${h.join(", ")}`;
        }
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
                const aCell = aGrid.cells[aPosition];
                const ap = aPosition instanceof Array?aPosition:[aPosition];

                for (let i=0; i<bGrid.positions.length; i++) {
                    const bPosition = bGrid.positions[i];
                    const bCell = bGrid.cells[bPosition];
                    const bp = bPosition instanceof Array?bPosition:[bPosition];

                    const abPosition = ap.concat(bp);

                    const abCell = this.grid.cells[abPosition] = this.grid.cells[abPosition] || {};

                    abCell.count = aCell.count * bCell.count;
                    abCell.min = this.min(aCell.min, bCell.min);
                    abCell.max = this.max(aCell.max, bCell.max);

                    this.grid.positions.push(abPosition);
                }
            }

            this.grid.positions.sort((a, b) => this.compare(a, b));
        }

        console.log(JSON.stringify(this.grid));

        return this.grid;
    }

    has (x) {
        if (x instanceof Array) {
            const aLength = this.a.header.length;
            const bLength = this.b.header.length;
            const total = aLength + bLength;
            
            if (x.length === total) {
                const a = x.slice(0, aLength);
                const b = x.slice(aLength, total);

                return this.a.has(a.length===1?a[0]:a) && 
                    this.b.has(b.length===1?b[0]:b);
            }
        }

        return false;
    }

    count () {
        return this.a.count() * this.b.count();
    }

    get header () {
        const ah = this.a.header;
        const bh = this.b.header; 

        return ah.concat(bh);
    }

    *values (min, max) {
        for (let a of this.a.values(min, max)) {
            a = a instanceof Array?a:[a];

            for (let b of this.b.values(min, max)) {
                b = b instanceof Array?b:[b];

                yield a.concat(b);
            }
        }
    }
}

CSet.prototype.crossProduct =  function crossProduct (s) {
    return new CrossProduct(this, s);
};

module.exports = CrossProduct;

