const { CSetArray, CSet } = require('../../src');

test('Set Distributive Property -> crossProduct.(intersect) : Empty', () => {

    const A = new CSetArray([]).as("A");
    const B = new CSetArray([]).as("B");
    const C = new CSetArray([]).as("C");

    const A_BC = A.crossProduct(B.intersect(C));
    const AB_AC = (A.crossProduct(B)).intersect(A.crossProduct(C).as("B", "C"));

    expect(A_BC.isEqual(AB_AC)).toBeTruthy();
})

test('Set Distributive Property -> crossProduct.(union) : Empty', () => {

    const A = new CSetArray([]).as("A");
    const B = new CSetArray([]).as("B");
    const C = new CSetArray([]).as("C");

    const A_BC = A.crossProduct(B.union(C));
    const AB_AC = (A.crossProduct(B)).union(A.crossProduct(C).as("B", "C"));

    expect(A_BC.isEqual(AB_AC)).toBeTruthy();
})

test('Set Distributive Property -> crossProduct.(difference) : Empty', () => {

    const A = new CSetArray([]).as("A");
    const B = new CSetArray([]).as("B");
    const C = new CSetArray([]).as("C");

    const A_BC = A.crossProduct(B.difference(C));
    const AB_AC = (A.crossProduct(B)).difference(A.crossProduct(C).as("B", "C"));

    expect(A_BC.isEqual(AB_AC)).toBeTruthy();

})
