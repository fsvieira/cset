function reorder (aHeader, bHeader, values) {
    if (aHeader instanceof Array && bHeader instanceof Array) {
        const r = [];
        for (let i=0; i<bHeader.length; i++) {
            const label = bHeader[i];
            r[aHeader.indexOf(label)] = values[i];
        }

        return r;
    }
    else {
        return values;
    }
}


module.exports = {
    reorder
};
