const CSet = require("./csetarray");
const CSetArray = require("./csetarray");
require("./select");
require("./projection");
require("./alias");
require("./union");
require("./intersect");
require("./crossproduct");

module.exports = {
    CSetArray,
    CSet
};
