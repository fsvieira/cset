const { CSetArray, CSet } = require('../../src');
const fc = require('fast-check');

test('Set Identity Property -> A union (E)mpty ', () => {
    fc.assert(
        fc.property(fc.array(fc.nat()), a => {
            const A = new CSetArray(a).as("A");
            const E = new CSetArray([]).as("E");

            const AE = A.union(E);

            expect(AE.isEqual(A)).toBeTruthy();
        })
    )
})

test('Set Identity Property -> A intersect X (A is subset of X)', () => {
    fc.assert(
        fc.property(fc.array(fc.nat()), fc.array(fc.nat()), (a, b) => {
            const X = new CSetArray(a.concat(b));
            const A = new CSetArray(a).as("A");

            const AX = A.intersect(X);

            expect(AX.isEqual(A)).toBeTruthy();
        })
    )
})

test('Set Identity Property -> A symmetricDifference (E)mpty ', () => {
    fc.assert(
        fc.property(fc.array(fc.nat()), a => {
            const A = new CSetArray(a).as("A");
            const E = new CSetArray([]).as("E");

            const AE = A.symmetricDifference(E);

            expect(AE.isEqual(A)).toBeTruthy();
        })
    )
})
