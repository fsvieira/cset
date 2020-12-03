const { CSetArray, CSet } = require('../../src');
const fc = require('fast-check');

test('Set Absorption law Property -> A union (A intersect B)', () => {
    fc.assert(
        fc.property(fc.array(fc.nat()), fc.array(fc.nat()), (a, b) => {
            const A = new CSetArray(a).as("A");
            const B = new CSetArray(b).as("B");

            const A_AB = A.union(A.intersect(B));

            expect(A_AB.isEqual(A)).toBeTruthy();
        })
    )
})

test('Set Absorption law Property -> A intersect (A union B)', () => {
    fc.assert(
        fc.property(fc.array(fc.nat()), fc.array(fc.nat()), (a, b) => {
            const A = new CSetArray(a).as("A");
            const B = new CSetArray(b).as("B");

            const A_AB = A.intersect(A.union(B));

            expect(A_AB.isEqual(A)).toBeTruthy();
        })
    )
})
