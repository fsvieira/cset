function reorder (aHeader, bHeader, values) {
    if (values instanceof Array) {
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

function errorHeaderNotFound (header, headers) {
    throw `Header ${header} is not found on set headers ${headers.join(", ")}`;
}

module.exports = {
    reorder,
    errorHeaderNotFound
};
