const { CSetArray, CSet } = require('../../src');
const fc = require('fast-check');

test('Set Associative Property -> union', () => {
    fc.assert(
        fc.property(fc.array(fc.nat()), fc.array(fc.nat()), fc.array(fc.nat()), (a, b, c) => {
            const A = new CSetArray(a).as("A");
            const B = new CSetArray(b).as("B");
            const C = new CSetArray(c).as("C");

            const AB_C = (A.union(B)).union(C);
            const A_BC = A.union(B.union(C));

            expect(AB_C.isEqual(A_BC)).toBeTruthy();
        })
    )
})

test('Set Associative Property -> intersect', () => {
    fc.assert(
        fc.property(fc.array(fc.nat()), fc.array(fc.nat()), fc.array(fc.nat()), (a, b, c) => {
            const A = new CSetArray(a).as("A");
            const B = new CSetArray(b).as("B");
            const C = new CSetArray(c).as("C");

            const AB_C = (A.intersect(B)).intersect(C);
            const A_BC = A.intersect(B.intersect(C));

            expect(AB_C.isEqual(A_BC)).toBeTruthy();
        })
    )
})

test('Set Associative Property -> symmetricDifference', () => {
    fc.assert(
        fc.property(fc.array(fc.nat()), fc.array(fc.nat()), fc.array(fc.nat()), (a, b, c) => {
            const A = new CSetArray(a).as("A");
            const B = new CSetArray(b).as("B");
            const C = new CSetArray(c).as("C");

            const AB_C = (A.symmetricDifference(B)).symmetricDifference(C);
            const A_BC = A.symmetricDifference(B.symmetricDifference(C));

            expect(AB_C.isEqual(A_BC)).toBeTruthy();
        })
    )
})

