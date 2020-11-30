const { CSetArray, CSet } = require('../../src');
const fc = require('fast-check');

test('Set Commutative Property', () => {
    fc.assert(
        fc.property(fc.array(fc.nat()), fc.array(fc.nat()), (a, b) => {
            const A = new CSetArray(a).as("A");
            const B = new CSetArray(b).as("B");

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
        })
    )
});

