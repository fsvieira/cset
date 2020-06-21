const { CSetArray, CSet } = require('../../src');
const fc = require('fast-check');

test('Create a set of 3 elements', () => {
  fc.assert(
    fc.property(fc.array(fc.nat()), a => {
      const cs = new CSetArray(a);

      expect([...cs.values()]).toEqual(a.sort());
    })
  );
});

