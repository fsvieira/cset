const { CSetArray, CSet } = require('../../src');
const fc = require('fast-check');

test('Set Idempotence Property -> A union A', () => {
    fc.assert(
        fc.property(fc.array(fc.nat()), a => {

            const A = new CSetArray(a).as("A");
            const AA = A.union(A);

            expect(AA.isEqual(A)).toBeTruthy();
        })
    )
})

test('Set Idempotence Property -> A intersect A', () => {
    fc.assert(
        fc.property(fc.array(fc.nat()), a => {

            const A = new CSetArray(a).as("A");
            const AA = A.intersect(A);

            expect(AA.isEqual(A)).toBeTruthy();
        })
    )
})

