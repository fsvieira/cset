const { CSetArray, CSet } = require('../../src');
const fc = require('fast-check');

test('Create a set of nat elements', () => {
  fc.assert(
    fc.property(fc.array(fc.nat()), a => {
      a = [...new Set(a)];
      const cs = new CSetArray(a);

      expect([...cs.values()]).toEqual(a.sort());
    })
  );
});

test('Set intersection', () => {
  fc.assert(
    fc.property(fc.array(fc.nat()), fc.array(fc.nat()), (aset, bset) => {

      const a = new CSetArray(aset);
      const b = new CSetArray(bset);
      const ab = a.intersect(b);

      const abTest = aset.filter(e => bset.includes(e));

      const abAll = aset.concat(bset);

      expect([...ab.values()]).toEqual(abTest);

      for (let i = 0; i < abAll.length; i++) {
        const e = abAll[i];

        expect(a.has(e) && b.has(e)).toEqual(ab.has(e));
      }
    })
  )
})

test('Set Union', () => {
  fc.assert(
    fc.property(fc.array(fc.nat()), fc.array(fc.nat()), (aset, bset) => {

      const a = new CSetArray(aset);
      const b = new CSetArray(bset);
      const ab = a.union(b);

      const abAll = aset.concat(bset);
      const abTest = [...new Set(abAll)];
      abTest.sort()

      expect([...ab.values()].sort()).toEqual(abTest);

      for (let i = 0; i < abAll.length; i++) {
        const e = abAll[i];

        expect(a.has(e) || b.has(e)).toEqual(ab.has(e));
      }
    })
  )
});

test('Set cartasian product', () => {
  fc.assert(
    fc.property(fc.array(fc.nat()), fc.array(fc.nat()), fc.array(fc.nat()), (aset, bset, cset) => {

      const a = new CSetArray(aset);
      const b = new CSetArray(bset);
      const ab = a.crossProduct(b);

      const r = [];

      aset = [...new Set(aset)].sort();
      bset = [...new Set(bset)].sort();

      for (let i = 0; i < aset.length; i++) {
        const av = aset[i];

        for (let j = 0; j < bset.length; j++) {
          const bv = bset[j];

          r.push([av, bv]);
        }
      }

      const rs = [...ab.values()];
      expect(rs).toEqual(r);

      if (ab.length) {
        const rsAB = rs[Math.ceil((rs.length - 1) * Math.random())];

        expect(ab.has(rsAB)).toBeTruthy();
        expect(ab.has(rsAB[0])).toBeFalsy();
        expect(ab.has(rsAB[1])).toBeFalsy();
        expect(ab.has(rsAB.concat([r[0]]))).toBeFalsy();
      }

      // with 3 elements,
      const c = new CSetArray(cset);

      cset = [...new Set(cset)].sort();
      const abc = ab.crossProduct(c);
      const rsc = [];

      for (let i = 0; i < rs.length; i++) {
        const abv = rs[i];

        for (let j = 0; j < cset.length; j++) {
          const cv = cset[j];

          rsc.push(abv.concat(cv));
        }
      }

      expect([...abc.values()]).toEqual(rsc);
    })
  )
});

