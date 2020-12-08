const CSet = require("./cset");
const CSetArray = require("./csetarray");
const perfTracker = require("./perf");

require("./select");
require("./projection");
require("./alias");
require("./union");
require("./intersect");
require("./crossproduct");
require("./difference");

module.exports = {
    CSetArray: perfTracker(CSetArray),
    CSet: perfTracker(CSet)
};

