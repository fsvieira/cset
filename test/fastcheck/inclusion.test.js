const { CSetArray, CSet } = require('../../src');
const fc = require('fast-check');

test('Set Algebra of inclusion : Reflexivity', () => {
    fc.assert(
        fc.property(fc.array(fc.nat()), a => {
            const A = new CSetArray(a).as("A");

            expect(A.isSubset(A)).toBeTruthy();
        })
    )
})

test('Set Algebra of inclusion : Antisymmetry', () => {
    fc.assert(
        fc.property(fc.array(fc.nat()), fc.array(fc.nat()), (a, b) => {
            const A = new CSetArray(a).as("A");
            const B = new CSetArray(b).as("B");

            expect(A.isSubset(B) && B.isSubset(A)).toEqual(A.isEqual(B));
        })
    )
})

test('Set Algebra of inclusion : Transitivity', () => {
    fc.assert(
        fc.property(fc.array(fc.nat()), fc.array(fc.nat()), fc.array(fc.nat()), (a, b, c) => {
            const A = new CSetArray(a).as("A");
            const B = new CSetArray(b).as("B");
            const C = new CSetArray(c).as("C");

            if (A.isSubset(B) && B.isSubset(C)) {
                expect(A.isSubset(C)).toBeTruthy();
            }
        })
    )
})