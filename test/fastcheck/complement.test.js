const { CSetArray, CSet } = require('../../src');
const fc = require('fast-check');

test('Set Complement Property -> A union AComplement) ', () => {
    fc.assert(
        fc.property(fc.set(fc.nat()), fc.nat(), (x, l) => {

            const i = l % x.length;
            const a = x.slice(0, i);
            const ac = x.slice(i, x.length);

            const A = new CSetArray(a).as("A");
            const C = new CSetArray(ac).as("C");
            const X = new CSetArray(x).as("X");

            const AC = A.union(C);

            expect(AC.isEqual(X)).toBeTruthy();
        })
    )
})

test('Set Complement Property -> A intersect AComplement', () => {
    fc.assert(
        fc.property(fc.set(fc.nat()), fc.nat(), (x, l) => {

            const i = l % x.length;
            const a = x.slice(0, i);
            const ac = x.slice(i, x.length);

            const A = new CSetArray(a).as("A");
            const C = new CSetArray(ac).as("C");
            const E = new CSetArray([]).as("E");

            const AC = A.intersect(C);

            expect(AC.isEqual(E)).toBeTruthy();
        })
    )
})

test('Set Complement Property -> A symmetricDifference AComplement', () => {
    fc.assert(
        fc.property(fc.set(fc.nat()), fc.nat(), (x, l) => {

            const i = l % x.length;
            const a = x.slice(0, i);
            const ac = x.slice(i, x.length);

            const A = new CSetArray(a).as("A");
            const C = new CSetArray(ac).as("C");
            const X = new CSetArray(x).as("X");

            const AC = A.symmetricDifference(C);

            expect(AC.isEqual(X)).toBeTruthy();
        })
    )
})
