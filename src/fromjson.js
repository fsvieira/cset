const CSetArray = require("./csetarray");

function fromJSON (json, fn) {
    const {sets, start} = json;
    const setsTable = {};

    const makeSet = id => {
        let s = setsTable[id];

        if (!s) {
            
            const ss = sets[id];

            switch (ss.className) {
                case "Intersect": {
                    const a = makeSet(ss.a);
                    const b = makeSet(ss.b);

                    s = setsTable[id] = a.intersect(b);
                    break;
                }

                case "Difference": {
                    const a = makeSet(ss.a);
                    const b = makeSet(ss.b);

                    s = setsTable[id] = a.difference(b);
                    break;
                }

                case "CrossProduct": {
                    const a = makeSet(ss.a);
                    const b = makeSet(ss.b);

                    s = setsTable[id] = a.crossProduct(b);
                    break;
                }
                    
                case "Union": {
                    const a = makeSet(ss.a);
                    const b = makeSet(ss.b);

                    s = setsTable[id] = a.union(b);
                    break;
                }

                case "Alias": {
                    const a = makeSet(ss.a);
                    s = setsTable[id] = a.as(ss.args.rename);
                    break;
                }

                case "CSetArray": {
                    s = setsTable[id] = new CSetArray(ss.values);
                    break;
                }

                case "Select": {
                    const a = makeSet(ss.a);

                    s = setsTable[id] = a.select(
                        ss.args.alias,
                        fn[ss.args.name]
                    );

                    s = a;
                    break;
                }

                case "Projection": {
                    const a = makeSet(ss.a);

                    s = setsTable[id] = a.projection(...ss.args.h);

                    break;
                }

                default:
                    console.log(ss.className);
            }
        }

        return s;
    }

    return makeSet(start);
}


module.exports = fromJSON;