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
            const dups = {};
            const positions = [];

            for (let i=0; i<aGrid.positions.length; i++) {
                const p = aGrid.positions[i];

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

                const aCell = aGrid.cells[position];
                const bCell = bGrid.cells[position];

                let cell;
                if (aCell && bCell) {
                    cell = {
                        count: aCell.count + bCell.count,
                        min: aCell.min > bCell.min?bCell.min:aCell.min,
                        max: aCell.max > bCell.max?aCell.max:bCell.max,
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

    /*
    *values (min, max) {
        yield *this.a.values(min, max);

        const aHeader = this.a.header;
        const bHeader = this.b.header;

        for (let e of this.b.values(min, max)) {
            const ea = reorder(aHeader, bHeader, e);

            if (!this.a.has(ea)) {
                yield ea;
            }
        }
    }*/
    
    /*
        TODO: generate grid with cell information if 
        has elments of a or/and b, so that we can easly defer generator 
        to one set or two sets using selector.

        TODO: order of union:
            - on case of a and b has cell grid intersect, we can:
                - get both a and b values,
                - if a < b, then:
                    * yield a,
                    * defer all a values from range ]a, b[;
                    * yield b
                - if a = b then yield a,
                - if a > b then same step of a < b inversed.
    */
   *values (min, max, selector) {
        const aHeader = this.a.header;
        const bHeader = this.b.header;

        const grid = this.calcGrid();

        for (let i=0; i<grid.positions.length; i++) {
            const position = grid.positions[i];
            const cell = this.grid.cells[position];

            if (
                (min === undefined || this.compare(min, cell.max) <= 0) && 
                (max === undefined || this.compare(max, cell.min) >= 0)
            ) {
                if (cell.sets === 'ab') {
                    let ai = this.a.values(cell.min, cell.max, selector);
                    let bi = this.b.values(cell.min, cell.max, selector);

                    let an = ai.next();
                    let bn = bi.next();

                    for (;;) {
                        if (!an.done && !bn.done) {
                            const a = an.value;
                            const b = bn.value;

                            const cmp = this.compare(a, b);
                            if (cmp < 0) {
                                const ab = reorder(aHeader, bHeader, b);

                                yield *this.a.values(a, ab, selector);

                                ai = this.a.values(ab, cell.max);

                                if (!this.a.has(ab)) {
                                    yield ab;
                                }
                                else {
                                    // descard one value,
                                    ai.next();
                                }
                            }
                            else if (cmp > 0) {
                                const ba = reorder(bHeader, aHeader, b);
                                
                                for (let e of this.b.values(b, ba, selector)) {
                                    yield reorder(aHeader, bHeader, e);
                                }

                                bi = this.a.values(ab, cell.max);

                                if (!this.b.has(ba)) {
                                    yield ba;
                                }
                                else {
                                    // discard one value,
                                    bi.next();
                                }
                            }
                            else {
                                yield a;
                            }
                        }
                        else {

                            if (!an.done) {
                                yield an.value;
                                yield *ai;
                            }
                            else if (!bn.done) {
                                yield bn.value;
                                for (let e of bi) {
                                    yield reorder(aHeader, bHeader, e);
                                }
                            }

                            break;
                        }

                        an = ai.next();
                        bn = bi.next();
                    }
                }
                else if (cell.sets === 'a') {
                    yield *this.a.values(cell.min, cell.max, selector);
                }
                else if (cell.sets === 'b') {
                    for (let e of this.b.values(cell.min, cell.max, selector)) {
                        yield reorder(aHeader, bHeader, e);
                    }
                }
            }
        }
    }

    /*
    *values (min, max, selector) {
        const aHeader = this.a.header;
        const bHeader = this.b.header;

        yield *this.b.values(min, max, selector);
        yield *this.a.values(min, max, (header, values) => {
            if (!selector || selector(header, values)) {
            
                if (header.length === aHeader.length) {
                    const be = reorder(header, bHeader, values);
                    return !this.b.has(be);
                }
                else {
                    return true;
                }
            }

            return false;
        });
    }*/

    get header () {
        return this.a.header;
    }
}

CSet.prototype.union = function (s) {
    return new Union(this, s);
}

module.exports = Union;

