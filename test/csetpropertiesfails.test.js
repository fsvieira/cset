const { CSetArray, CSet } = require('../src');

test('Empty Use cases', () => {

    const A = new CSetArray([]).as("A");
    const B = new CSetArray([]).as("B");

    expect(A.isEqual(B)).toBeTruthy();
    {
        const AB = A.union(B);
        const BA = B.union(A);

        expect(AB.isEqual(BA)).toBeTruthy();
    }

    {
        const AB = A.intersect(B);
        const BA = B.intersect(A);

        expect(AB.isEqual(BA)).toBeTruthy();
    }
});
