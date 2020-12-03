const { CSetArray, CSet } = require('../../src');

test('Set Commutative Property -> Empty ', () => {

    const A = new CSetArray([]).as("A");
    const B = new CSetArray([]).as("B");

    expect(A.isEqual(B)).toBeTruthy();
})

test('Set Commutative Property -> union : Empty ', () => {

    const A = new CSetArray([]).as("A");
    const B = new CSetArray([]).as("B");

    const AB = A.union(B);
    const BA = B.union(A);

    expect(AB.isEqual(BA)).toBeTruthy();
})

test('Set Commutative Property -> intersect : Empty ', () => {
    const A = new CSetArray([]).as("A");
    const B = new CSetArray([]).as("B");

    const AB = A.intersect(B);
    const BA = B.intersect(A);

    expect(AB.isEqual(BA)).toBeTruthy();

})
