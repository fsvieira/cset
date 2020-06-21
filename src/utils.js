
// reoder values with aHeader to values with bHeader.
function reorder (aHeader, bHeader, values) {

    if (values instanceof Array) {
        if (values.length > 1) {
            const r = [];
            for (let i=0; i<bHeader.length; i++) {
                const label = bHeader[i];
                const index = aHeader.indexOf(label);
                r[i] = values[index];
            }

            return r;
        }
    }
    
    return values;
}

function errorHeaderNotFound (header, headers) {
    throw `Header ${header} is not found on set headers ${headers.join(", ")}`;
}

module.exports = {
    reorder,
    errorHeaderNotFound
};
