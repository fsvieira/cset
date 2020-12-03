const { CSetArray, CSet } = require('../../src');
const fc = require('fast-check');

test('Set Distributive Property -> union.(intersect)', () => {
    fc.assert(
        fc.property(fc.array(fc.nat()), fc.array(fc.nat()), fc.array(fc.nat()), (a, b, c) => {
            const A = new CSetArray(a).as("A");
            const B = new CSetArray(b).as("B");
            const C = new CSetArray(c).as("C");

            const A_BC = A.union(B.intersect(C));
            const AB_AC = (A.union(B)).intersect(A.union(C));

            expect(A_BC.isEqual(AB_AC)).toBeTruthy();
        })
    )
})

test('Set Distributive Property -> intersect.(union)', () => {
    fc.assert(
        fc.property(fc.array(fc.nat()), fc.array(fc.nat()), fc.array(fc.nat()), (a, b, c) => {
            const A = new CSetArray(a).as("A");
            const B = new CSetArray(b).as("B");
            const C = new CSetArray(c).as("C");

            const A_BC = A.intersect(B.union(C));
            const AB_AC = (A.intersect(B)).union(A.intersect(C));

            expect(A_BC.isEqual(AB_AC)).toBeTruthy();
        })
    )
})

test('Set Distributive Property -> intersect.(symmetricDifference)', () => {
    fc.assert(
        fc.property(fc.array(fc.nat()), fc.array(fc.nat()), fc.array(fc.nat()), (a, b, c) => {
            const A = new CSetArray(a).as("A");
            const B = new CSetArray(b).as("B");
            const C = new CSetArray(c).as("C");

            const A_BC = A.intersect(B.symmetricDifference(C));
            const AB_AC = (A.intersect(B)).symmetricDifference(A.intersect(C));

            expect(A_BC.isEqual(AB_AC)).toBeTruthy();
        })
    )
})

test('Set Distributive Property -> crossProduct.(intersect)', () => {
    fc.assert(
        fc.property(fc.array(fc.nat()), fc.array(fc.nat()), fc.array(fc.nat()), (a, b, c) => {
            const A = new CSetArray(a).as("A");
            const B = new CSetArray(b).as("B");
            const C = new CSetArray(c).as("C");

            const A_BC = A.crossProduct(B.intersect(C));
            const AB_AC = (A.crossProduct(B)).intersect(A.crossProduct(C).as("B", "C"));

            expect(A_BC.isEqual(AB_AC)).toBeTruthy();
        })
    )
})

test('Set Distributive Property -> crossProduct.(union)', () => {
    fc.assert(
        fc.property(fc.array(fc.nat()), fc.array(fc.nat()), fc.array(fc.nat()), (a, b, c) => {
            const A = new CSetArray(a).as("A");
            const B = new CSetArray(b).as("B");
            const C = new CSetArray(c).as("C");

            const A_BC = A.crossProduct(B.union(C));
            const AB_AC = (A.crossProduct(B)).union(A.crossProduct(C).as("B", "C"));

            expect(A_BC.isEqual(AB_AC)).toBeTruthy();
        })
    )
})

test('Set Distributive Property -> crossProduct.(difference)', () => {
    fc.assert(
        fc.property(fc.array(fc.nat()), fc.array(fc.nat()), fc.array(fc.nat()), (a, b, c) => {
            const A = new CSetArray(a).as("A");
            const B = new CSetArray(b).as("B");
            const C = new CSetArray(c).as("C");

            const A_BC = A.crossProduct(B.difference(C));
            const AB_AC = (A.crossProduct(B)).difference(A.crossProduct(C).as("B", "C"));

            expect(A_BC.isEqual(AB_AC)).toBeTruthy();
        })
    )
})
