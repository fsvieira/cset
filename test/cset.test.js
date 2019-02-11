const CSet = require('../src/cset');

test('Create a set of 3 elements', () => {
  const a = new CSet([1, 2, 3]);
  expect([...a.values()]).toEqual([1, 2, 3]);
  expect(a.has(1)).toBeTruthy();
  expect(a.has(4)).toBeFalsy();
});

test('Set intersection', () => {
  const a = new CSet([1, 2, 3]);
  const b = new CSet([2, 3, 4]);
  const ab = a.intersect(b);
  expect([...ab.values()]).toEqual([2, 3]);

  expect(ab.has(2)).toBeTruthy();
  expect(ab.has(1)).toBeFalsy();

});

test('Set Union', () => {
  const a = new CSet([1, 2, 3]);
  const b = new CSet([2, 3, 4]);
  const ab = a.union(b);
  expect([...ab.values()]).toEqual([1, 2, 3, 4]);

  expect(ab.has(1)).toBeTruthy();
  expect(ab.has(4)).toBeTruthy();

});

test('Set cartasian product', () => {
  const a = new CSet([1, 2]);
  const b = new CSet([3, 4]);
  const ab = a.cartesianProduct(b);
  expect([...ab.values()]).toEqual([[1, 3], [1, 4], [2, 3], [2, 4]]);

  expect(ab.has([1, 4])).toBeTruthy();
  expect(ab.has(1)).toBeFalsy();
  expect(ab.has(4)).toBeFalsy();
  expect(ab.has([1, 3, 4])).toBeFalsy();

  // with 3 elements,
  const c = new CSet([5, 6]);

  const abc = ab.cartesianProduct(c);

  expect([...abc.values()]).toEqual([ 
      [ 1, 3, 5 ],
      [ 1, 3, 6 ],
      [ 1, 4, 5 ],
      [ 1, 4, 6 ],
      [ 2, 3, 5 ],
      [ 2, 3, 6 ],
      [ 2, 4, 5 ],
      [ 2, 4, 6 ] 
    ]);

});

test('Set cartasian product intersection', () => {
  const a = new CSet([1, 2]).as("A");
  const b = new CSet([3, 4]).as("B");
  const ab = a.cartesianProduct(b);

  const c = new CSet([1, 3]).as("C");
  const d = new CSet([2, 4]).as("D");

  const cd = c.cartesianProduct(d);

  expect(cd.header).toEqual(["C", "D"]);

  const abcd = ab.intersect(cd);

  expect([...abcd.values()]).toEqual([[1, 4]]);
  expect(abcd.has([1, 4])).toBeTruthy();

});

test('Set cartasian product difference', () => {
  const a = new CSet([1, 2]);
  const b = new CSet([3, 4]);
  const ab = a.cartesianProduct(b);

  const c = new CSet([1, 3]);
  const d = new CSet([2, 4]);

  const cd = c.cartesianProduct(d);

  const abcd = ab.difference(cd);

  expect([...abcd.values()]).toEqual([[1,3],[2,3],[2,4]]);
  expect(abcd.has([1, 3])).toBeTruthy();
  expect(abcd.has([1, 4])).toBeFalsy();

});

test('Set cartasian no repeat product', () => {
  const a = new CSet([1, 2]).as("a");
  const b = new CSet([1, 2]).as("b");

  const ab = a.cartesianProduct(b)
    .constrain(["a", "b"], {
      name: "<>",
      predicate: ({a, b}) => a !== b 
    });

  expect([...ab.values()]).toEqual([[1, 2], [2, 1]]);

  expect(ab.has([1, 2])).toBeTruthy();
  expect(ab.has(1)).toBeFalsy();
  expect(ab.has(4)).toBeFalsy();
  expect(ab.has([1, 3, 4])).toBeFalsy();

  // with 3 elements,
  const c = new CSet([1, 2, 3]).as("c");

  const abc = ab.cartesianProduct(c).constrain(
    ["a", "b", "c"], {
      name: "<>",
      predicate: ({a, b, c}) => a !== b && a !== c && b !== c
    });

  expect([...abc.values()]).toEqual([[1, 2, 3], [2, 1, 3]]);

});

/*
test('Set cartasian SEND MORE MONEY', () => {
  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const d = new CSet(digits);

  // S E N D M O R Y
  const sendMoreMoney = d.as("S")
    .cartesianProduct(d.as("E"))
    .cartesianProduct(d.as("N"))
    .cartesianProduct(d.as("D"))
    .cartesianProduct(d.as("M"))
    .cartesianProduct(d.as("O"))
    .cartesianProduct(d.as("R"))
    .cartesianProduct(d.as("Y"))
    .constrain(
      ["S", "E", "N", "D", "M", "O", "R", "Y"],
      {
        name : "<>",
        predicate: x => {
          // Make sure that all values are diferent,
          const vs = new Set();
          for (let a in x) {
            const v = x[a];
            if (vs.has(v)) {
              return false;
            }

            vs.add(v);
          }

          return true;
        }
      }
    )
    .constrain(
      ["S", "E", "N", "D", "M", "O", "R", "Y"],
      {
        name: "add",
        predicate: ({S, E, N, D, M, O, R, Y}) => 
            S * 1000 + E * 100 + N * 10 + D 
          + M * 1000 + O * 100 + R * 10  + E  
            === 
            M * 10000 + O * 1000 + N * 100 + E * 10 + Y
      }
    );

    for (let [S, E, N, D, M, O, R, Y] of sendMoreMoney.values()) {
      expect(S * 1000 + E * 100 + N * 10 + D + M * 1000 + O * 100 + R * 10  + E)
        .toBe(M * 10000 + O * 1000 + N * 100 + E * 10 + Y)
    }
});

test('Set cartasian SEND MORE MONEY (Optimize)', () => {
  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const d = new CSet(digits);

  const notEqual = {
    name: "<>",
    predicate: x => {
      // Make sure that all values are diferent,
      const vs = new Set();
      for (let a in x) {
        const v = x[a];
        if (vs.has(v)) {
          return false;
        }

         vs.add(v);
      }

      return true;
    }
  };

  // S E N D M O R Y
  const sendMoreMoney = d.as("S")
    .cartesianProduct(d.as("E"))
      .constrain(["S", "E"], notEqual)
    .cartesianProduct(d.as("N"))
      .constrain(["S", "E", "N"], notEqual)
    .cartesianProduct(d.as("D"))
      .constrain(["S", "E", "N", "D"], notEqual)
    .cartesianProduct(d.as("M"))
      .constrain(["S", "E", "N", "D", "M"], notEqual)
    .cartesianProduct(d.as("O"))
      .constrain(["S", "E", "N", "D", "M", "O"], notEqual)
    .cartesianProduct(d.as("R"))
      .constrain(["S", "E", "N", "D", "M", "O", "R"], notEqual)
    .cartesianProduct(d.as("Y"))
    .constrain(
      ["S", "E", "N", "D", "M", "O", "R", "Y"],
      notEqual
    )
    .constrain(
      ["S", "E", "N", "D", "M", "O", "R", "Y"],
      {
        name: "add",
        predicate: ({S, E, N, D, M, O, R, Y}) => 
            S * 1000 + E * 100 + N * 10 + D 
          + M * 1000 + O * 100 + R * 10  + E  
            === 
            M * 10000 + O * 1000 + N * 100 + E * 10 + Y
      }
    );

    for (let [S, E, N, D, M, O, R, Y] of sendMoreMoney.values()) {
      expect(S * 1000 + E * 100 + N * 10 + D + M * 1000 + O * 100 + R * 10  + E)
        .toBe(M * 10000 + O * 1000 + N * 100 + E * 10 + Y)
    }
});
*/

test('Set isEmpty ?', () => {
  const empty = new CSet([]);
  const intersectEmpty = new CSet([1, 2]).intersect(new CSet([3, 4]));
  const notEmpty = new CSet([1, 2]).intersect(new CSet([2, 3, 4]));

  expect(empty.isEmpty()).toBeTruthy();
  expect(intersectEmpty.isEmpty()).toBeTruthy();
  expect(notEmpty.isEmpty()).toBeFalsy();

});

test("Subsets and Proper Subsets", () => {
  const a = new CSet([0, 1, 2]);
  const b = new CSet([0, 1, 2, 3, 4, 5]);
  
  expect(a.isSubset(b)).toBeTruthy();
  expect(b.isSubset(b)).toBeTruthy();
  expect(b.isSubset(a)).toBeFalsy();

  expect(a.isProperSubset(a)).toBeFalsy();
  expect(a.isProperSubset(b)).toBeTruthy();

});

test("Supersets and Proper Supersets", () => {
  const a = new CSet([0, 1, 2]);
  const b = new CSet([0, 1, 2, 3, 4, 5]);
  
  expect(a.isSuperset(b)).toBeFalsy();
  expect(b.isSuperset(b)).toBeTruthy();
  expect(b.isSuperset(a)).toBeTruthy();

  expect(a.isProperSuperset(a)).toBeFalsy();
  expect(a.isProperSuperset(b)).toBeFalsy();
  expect(b.isProperSuperset(a)).toBeTruthy();
});

test("Equal and Proper Supersets", () => {
  const a = new CSet([0, 1, 2]);
  const b = new CSet([0, 1, 2, 3, 4, 5]);
  
  expect(a.intersect(b).isEqual(a)).toBeTruthy();
  expect(a.isEqual(b)).toBeFalsy();
  expect(a.isEqual(a)).toBeTruthy();
  expect(b.isEqual(a)).toBeFalsy();

});
