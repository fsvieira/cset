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

test('Set Algebra of inclusion : Existence of a least element and a greatest element.', () => {
    fc.assert(
        fc.property(fc.array(fc.nat()), fc.array(fc.nat()), (a, b) => {
            const E = new CSetArray([]).as("E");
            const X = new CSetArray(a.concat(b)).as("X");
            const A = new CSetArray(a).as("A");

            expect(E.isSubset(A) && A.isSubset(X)).toBeTruthy();
        })
    )
})


test('Set Algebra of inclusion : Existence of joins (1).', () => {
    fc.assert(
        fc.property(fc.array(fc.nat()), fc.array(fc.nat()), (a, b) => {
            const A = new CSetArray(a).as("A");
            const B = new CSetArray(b).as("B");

            expect(A.isSubset(A.union(B))).toBeTruthy();
        })
    )
})

test('Set Algebra of inclusion : Existence of joins (2).', () => {
    fc.assert(
        fc.property(fc.array(fc.nat()), fc.array(fc.nat()), fc.array(fc.nat()), (a, b, c) => {
            const A = new CSetArray(a).as("A");
            const B = new CSetArray(b).as("B");
            const C = new CSetArray(c).as("C");

            if (A.isSubset(C) && B.isSubset(C)) {
                expect(A.union(B).isSubset(C)).toBeTruthy();
            }
        })
    )
})

test('Set Algebra of inclusion : Existence of meets (1).', () => {
    fc.assert(
        fc.property(fc.array(fc.nat()), fc.array(fc.nat()), (a, b) => {
            const A = new CSetArray(a).as("A");
            const B = new CSetArray(a).as("B");

            expect(A.intersect(B).isSubset(A)).toBeTruthy();
        })
    )
})

test('Set Algebra of inclusion : Existence of meets (2).', () => {
    fc.assert(
        fc.property(fc.array(fc.nat()), fc.array(fc.nat()), fc.array(fc.nat()), (a, b, c) => {
            const A = new CSetArray(a).as("A");
            const B = new CSetArray(b).as("B");
            const C = new CSetArray(c).as("C");

            if (C.isSubset(A) && C.isSubset(B)) {
                expect(C.isSubset(A.intersect(B))).toBeTruthy();
            }
        })
    )
})

test('Set Algebra of inclusion : Existence of meets (3).', () => {
    fc.assert(
        fc.property(fc.array(fc.nat()), fc.array(fc.nat()), fc.array(fc.nat()), fc.array(fc.nat()), (a, b, x, y) => {
            const A = new CSetArray(a).as("A");
            const B = new CSetArray(b).as("B");
            const X = new CSetArray(x).as("X");
            const Y = new CSetArray(y).as("Y");

            if (A.isSubset(X) && B.isSubset(Y)) {
                expect(A.crossProduct(B).isSubset(X.crossProduct(Y))).toBeTruthy();
            }
        })
    )
})

