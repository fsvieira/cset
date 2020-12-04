const { CSetArray, CSet } = require('../../src');
const fc = require('fast-check');

// Intersection
test('Expressions of basic set operations : intersection (1)', () => {
    fc.assert(
        fc.property(fc.array(fc.nat()), fc.array(fc.nat()), (a, b) => {
            const A = new CSetArray(a).as("A");
            const B = new CSetArray(b).as("B");

            expect(A.intersect(B).isEqual(A.difference(A.difference(B)))).toBeTruthy();
        })
    )
})

test('Expressions of basic set operations : intersection (2)', () => {
    fc.assert(
        fc.property(fc.array(fc.nat()), fc.array(fc.nat()), (a, b) => {
            const A = new CSetArray(a).as("A");
            const B = new CSetArray(b).as("B");

            expect(A.intersect(B).isEqual(B.difference(B.difference(A)))).toBeTruthy();
        })
    )
})

test('Expressions of basic set operations : intersection (3)', () => {
    fc.assert(
        fc.property(fc.array(fc.nat()), fc.array(fc.nat()), (a, b) => {
            const A = new CSetArray(a).as("A");
            const B = new CSetArray(b).as("B");

            expect(A.intersect(B).isEqual(A.difference(A.symmetricDifference(B)))).toBeTruthy();
        })
    )
})

test('Expressions of basic set operations : intersection (4)', () => {
    fc.assert(
        fc.property(fc.array(fc.nat()), fc.array(fc.nat()), (a, b) => {
            const A = new CSetArray(a).as("A");
            const B = new CSetArray(b).as("B");

            expect(A.intersect(B).isEqual(A.symmetricDifference(A.difference(B)))).toBeTruthy();
        })
    )
})

// Union
test('Expressions of basic set operations : union (1)', () => {
    fc.assert(
        fc.property(fc.array(fc.nat()), fc.array(fc.nat()), (a, b) => {
            const A = new CSetArray(a).as("A");
            const B = new CSetArray(b).as("B");

            expect(A.union(B).isEqual(A.union(A.symmetricDifference(B)))).toBeTruthy();
        })
    )
})

test('Expressions of basic set operations : union (3)', () => {
    fc.assert(
        fc.property(fc.array(fc.nat()), fc.array(fc.nat()), (a, b) => {
            const A = new CSetArray(a).as("A");
            const B = new CSetArray(b).as("B");

            expect(A.union(B).isEqual(
                (A.symmetricDifference(B)).symmetricDifference(A.intersect(B)))
            ).toBeTruthy();
        })
    )
})

// Difference
test('Expressions of basic set operations : difference (1)', () => {
    fc.assert(
        fc.property(fc.array(fc.nat()), fc.array(fc.nat()), (a, b) => {
            const A = new CSetArray(a).as("A");
            const B = new CSetArray(b).as("B");

            expect(A.difference(B).isEqual(
                A.difference(A.intersect(B)))
            ).toBeTruthy();
        })
    )
})

test('Expressions of basic set operations : difference (2)', () => {
    fc.assert(
        fc.property(fc.array(fc.nat()), fc.array(fc.nat()), (a, b) => {
            const A = new CSetArray(a).as("A");
            const B = new CSetArray(b).as("B");

            expect(A.difference(B).isEqual(
                A.intersect(A.symmetricDifference(B)))
            ).toBeTruthy();
        })
    )
})

test('Expressions of basic set operations : difference (3)', () => {
    fc.assert(
        fc.property(fc.array(fc.nat()), fc.array(fc.nat()), (a, b) => {
            const A = new CSetArray(a).as("A");
            const B = new CSetArray(b).as("B");

            expect(A.difference(B).isEqual(
                A.symmetricDifference(A.intersect(B))
            )).toBeTruthy();
        })
    )
})

test('Expressions of basic set operations : difference (4)', () => {
    fc.assert(
        fc.property(fc.array(fc.nat()), fc.array(fc.nat()), (a, b) => {
            const A = new CSetArray(a).as("A");
            const B = new CSetArray(b).as("B");

            expect(A.difference(B).isEqual(
                B.symmetricDifference(A.union(B))
            )).toBeTruthy();
        })
    )
})

// SymmetricDifference

test('Expressions of basic set operations : Symmetric Difference (1)', () => {
    fc.assert(
        fc.property(fc.array(fc.nat()), fc.array(fc.nat()), (a, b) => {
            const A = new CSetArray(a).as("A");
            const B = new CSetArray(b).as("B");

            expect(A.symmetricDifference(B).isEqual(
                B.symmetricDifference(A)
            )).toBeTruthy();
        })
    )
})

test('Expressions of basic set operations : Symmetric Difference (2)', () => {
    fc.assert(
        fc.property(fc.array(fc.nat()), fc.array(fc.nat()), (a, b) => {
            const A = new CSetArray(a).as("A");
            const B = new CSetArray(b).as("B");

            expect(A.symmetricDifference(B).isEqual(
                A.union(B).difference(A.intersect(B))
            )).toBeTruthy();
        })
    )
})

