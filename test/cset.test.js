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

  const c = new CSet([1, 3]).as("A");
  const d = new CSet([2, 4]).as("B");

  const cd = c.cartesianProduct(d);

  expect(cd.header).toEqual(["A", "B"]);

  const abcd = ab.intersect(cd);

  expect(abcd.header).toEqual(["A", "B"]);

  expect([...abcd.values()]).toEqual([[1, 4]]);
  expect(abcd.has([1, 4])).toBeTruthy();
});

test('Set cartasian product difference', () => {
  const a = new CSet([1, 2]).as("A");
  const b = new CSet([3, 4]).as("B");
  const ab = a.cartesianProduct(b);

  const c = new CSet([1, 3]).as("A");
  const d = new CSet([2, 4]).as("B");

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

test("header of intersection", () => {

  const a = new CSet([1, 2]).as("A");
  const b = new CSet([1, 2]).as("B");

  expect(a.intersect(b).header).toEqual("A");

});

test("header of cartesian products", () => {

    const a = new CSet([1, 2]).as("A");
    const b = new CSet([1, 2, 3, 4]).as("B");

    expect(a.cartesianProduct(b).header).toEqual(["A", "B"]);

    expect(() => a.cartesianProduct(b.as("A")))
        .toThrowError('Repeated headers are not allowed A, A');

    expect(a.union(b).as("C").cartesianProduct(a).cartesianProduct(b).header).toEqual(["C","A","B"]);
});

test("cartesian products alias", () => {

  const ab = new CSet([1, 2]).as("a").cartesianProduct(new CSet([1, 2, 3]).as("b"));

  const AB = ab.as("A").cartesianProduct(ab.as("B"));

  expect(AB.header).toEqual(["A.a", "A.b", "B.a", "B.b"]);

});

test("Count", () => {

  const a = new CSet([1, 3, 2]);
  const b = a.union(new CSet([5, 3, 4])).as("AB");

  expect(a.count()).toBe(3);
  expect(b.count()).toBe(5);

  const ab = a.cartesianProduct(b); 
  expect(ab.count()).toBe(15);

  const oddSum = a.as("A").cartesianProduct(b.as("B")).constrain(
    ["A", "B"],
    {
      name: "odd-sum",
      predicate: ({A, B}) => (A + B) % 2 === 1
    }
  ); 

  expect(oddSum.count()).toBe(7);

});

test("distinct cartesian product (SEND MORE MONEY)", () => {

  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const d = new CSet(digits);

  // S E N D M O R Y
  const sendMoreMoney = d.as("S")
    .distinctCartesianProduct(d.as("E"))
    .distinctCartesianProduct(d.as("N"))
    .distinctCartesianProduct(d.as("D"))
    .distinctCartesianProduct(d.as("M"))
    .distinctCartesianProduct(d.as("O"))
    .distinctCartesianProduct(d.as("R"))
    .distinctCartesianProduct(d.as("Y"))
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

test("distinct cartesian product", () => {

    {
      const A = new CSet([1, 2, 3]).distinctCartesianProduct(
        new CSet([1, 2])
      );

      expect([...A.values()]).toEqual([[ 1, 2 ], [ 2, 1 ], [ 3, 1 ], [ 3, 2 ]]);
    }

    {
      const A = new CSet([1, 2]);

      const B = A.as("a").cartesianProduct(A.as("b")).distinctCartesianProduct(
        A.as("c").cartesianProduct(A.as("d"))
      );

      expect([...B.values()]).toEqual([[ 1, 1, 2, 2 ], [ 2, 2, 1, 1 ]]);
    }

    {
      const A = new CSet([1, 2, 3]);

      const B = A.as("a").cartesianProduct(A.as("b")).distinctCartesianProduct(
        A.as("c").cartesianProduct(A.as("d"))
      );

      expect([...B.values()]).toEqual(
        [
          [1,1,2,2],[1,1,2,3],[1,1,3,2],[1,1,3,3],
          [1,2,3,3],[1,3,2,2],[2,1,3,3],[2,2,1,1],
          [2,2,1,3],[2,2,3,1],[2,2,3,3],[2,3,1,1],
          [3,1,2,2],[3,2,1,1],[3,3,1,1],[3,3,1,2],
          [3,3,2,1],[3,3,2,2]
        ]
      );
    }

});

test("Order of cartasian set operations", () => {
  {
    const a = new CSet([1, 2]).as("A");
    const b = new CSet([3, 4]).as("B");

    const c = new CSet([5, 6]).as("A");
    const d = new CSet([7, 8]).as("B");

    const ab = a.cartesianProduct(b);
    const dc = d.cartesianProduct(c);

    const ab_UNION_dc = ab.union(dc);

    expect([...ab_UNION_dc.values()]).toEqual([[1,3],[1,4],[2,3],[2,4],[5,7],[6,7],[5,8],[6,8]]);

  }

  {
    const a = new CSet([1, 2]).as("A");
    const b = new CSet([3, 4]).as("B");

    const c = new CSet([1, 2]).as("A");
    const d = new CSet([3, 5]).as("B");

    const ab = a.cartesianProduct(b);
    const dc = d.cartesianProduct(c);

    expect(dc.header).toEqual(["B", "A"]);

    const ab_INTERSECT_dc = ab.intersect(dc);

    expect([...ab_INTERSECT_dc.values()]).toEqual([[1,3],[2,3]]);
  }

  {
    const a = new CSet([1, 2]).as("A");
    const b = new CSet([3, 4]).as("B");

    const c = new CSet([1, 2]).as("A");
    const d = new CSet([3, 5]).as("B");

    const ab = a.cartesianProduct(b);
    const dc = d.cartesianProduct(c);

    const ab_DIFFERENCE_dc = ab.difference(dc);

    expect([...ab_DIFFERENCE_dc.values()]).toEqual([[1,4],[2,4]]);
  }

});

// TODO: test cartesian for duplicated values (for self, union, ...)


