const CSet = require("./cset");

const a = new CSet([1, 2]).as("a");
const b = new CSet([1, 2]).as("b");

const d = a.cartesianProduct(b).constrain(
    ["a"], {
        name: "!2",
        predicate: x => x !== 2
    }
); 

d.domain("a");
