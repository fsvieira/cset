const { CSetArray, CSet } = require('../../src');
const fc = require('fast-check');

test('Set Domination Property -> A union X (A is subset of X)', () => {
    fc.assert(
        fc.property(fc.array(fc.nat()), fc.array(fc.nat()), (a, b) => {
            const X = new CSetArray(a.concat(b));
            const A = new CSetArray(a).as("A");

            const AX = A.union(X);

            expect(AX.isEqual(X)).toBeTruthy();
        })
    )
})

test('Set Domination Property -> A intersect Empty', () => {
    fc.assert(
        fc.property(fc.array(fc.nat()), a => {
            const E = new CSetArray([]);
            const A = new CSetArray(a).as("A");

            const AE = A.intersect(E);

            expect(AE.isEqual(E)).toBeTruthy();
        })
    )
})

test('Set Domination Property -> A crossProduct Empty', () => {
    fc.assert(
        fc.property(fc.array(fc.nat()), a => {
            const E = new CSetArray([]);
            const A = new CSetArray(a).as("A");

            const AE = A.crossProduct(E);

            expect(AE.isEqual(E)).toBeTruthy();
        })
    )
})
