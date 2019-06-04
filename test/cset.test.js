const {CSetArray, CSet} = require('../src/index');

test('Create a set of 3 elements', () => {
  const a = new CSetArray([1, 2, 3]);
  expect([...a.values()]).toEqual([1, 2, 3]);
  expect(a.has(1)).toBeTruthy();
  expect(a.has(4)).toBeFalsy();
});

test('Set intersection', () => {
  const a = new CSetArray([1, 2, 3]);
  const b = new CSetArray([2, 3, 4]);
  const ab = a.intersect(b);

  expect([...ab.values()]).toEqual([2, 3]);

  expect(ab.has(2)).toBeTruthy();
  expect(ab.has(1)).toBeFalsy();

});

test('Set Union', () => {
  const a = new CSetArray([1, 2, 3]);
  const b = new CSetArray([2, 3, 4]);
  const ab = a.union(b);
  expect([...ab.values()]).toEqual([1, 2, 3, 4]);

  expect(ab.has(1)).toBeTruthy();
  expect(ab.has(4)).toBeTruthy();

});

test('Set cartasian product', () => {
  const a = new CSetArray([1, 2]);
  const b = new CSetArray([3, 4]);
  const ab = a.crossProduct(b);

  expect([...ab.values()]).toEqual([[1, 3], [1, 4], [2, 3], [2, 4]]);

  expect(ab.has([1, 4])).toBeTruthy();
  expect(ab.has(1)).toBeFalsy();
  expect(ab.has(4)).toBeFalsy();
  expect(ab.has([1, 3, 4])).toBeFalsy();

  // with 3 elements,
  const c = new CSetArray([5, 6]);

  const abc = ab.crossProduct(c);
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
  const a = new CSetArray([1, 2]).as("A");
  const b = new CSetArray([3, 4]).as("B");
  const ab = a.crossProduct(b);

  const c = new CSetArray([1, 3]).as("A");
  const d = new CSetArray([2, 4]).as("B");

  const cd = c.crossProduct(d);

  expect(cd.header).toEqual(["A", "B"]);

  const abcd = ab.intersect(cd);

  expect(abcd.header).toEqual(["A", "B"]);

  expect([...abcd.values()]).toEqual([[1, 4]]);
  expect(abcd.has([1, 4])).toBeTruthy();
});

test('Set cartasian product difference', () => {
  const a = new CSetArray([1, 2]).as("A");
  const b = new CSetArray([3, 4]).as("B");
  const ab = a.crossProduct(b);

  const c = new CSetArray([1, 3]).as("A");
  const d = new CSetArray([2, 4]).as("B");

  const cd = c.crossProduct(d);

  const abcd = ab.difference(cd);

  expect([...abcd.values()]).toEqual([[1,3],[2,3],[2,4]]);
  expect(abcd.has([1, 3])).toBeTruthy();
  expect(abcd.has([1, 4])).toBeFalsy();

});

test('Set cartasian no repeat product', () => {
  const a = new CSetArray([1, 2]).as("a");
  const b = new CSetArray([1, 2]).as("b");

  const ab = a.crossProduct(b)
    .select(["a", "b"], {
      name: "<>",
      predicate: (a, b) => a !== b
    });

  expect([...ab.values()]).toEqual([[1, 2], [2, 1]]);

  expect(ab.has([1, 2])).toBeTruthy();
  expect(ab.has(1)).toBeFalsy();
  expect(ab.has(4)).toBeFalsy();
  expect(ab.has([1, 3, 4])).toBeFalsy();

  // with 3 elements,
  const c = new CSetArray([1, 2, 3]).as("c");

  const abc = ab.crossProduct(c).select(
    ["a", "b", "c"], {
      name: "<>",
      predicate: (a, b, c) => a !== b && a !== c && b !== c
    });

  expect([...abc.values()]).toEqual([[1, 2, 3], [2, 1, 3]]);

});

test('Set isEmpty ?', () => {
  const empty = new CSetArray([]);
  const intersectEmpty = new CSetArray([1, 2]).intersect(new CSetArray([3, 4]));
  const notEmpty = new CSetArray([1, 2]).intersect(new CSetArray([2, 3, 4]));

  expect(empty.isEmpty()).toBeTruthy();
  expect(intersectEmpty.isEmpty()).toBeTruthy();
  expect(notEmpty.isEmpty()).toBeFalsy();

});

test("Subsets and Proper Subsets", () => {
  const a = new CSetArray([0, 1, 2]);
  const b = new CSetArray([0, 1, 2, 3, 4, 5]);
  
  expect(a.isSubset(b)).toBeTruthy();
  expect(b.isSubset(b)).toBeTruthy();
  expect(b.isSubset(a)).toBeFalsy();

  expect(a.isProperSubset(a)).toBeFalsy();
  expect(a.isProperSubset(b)).toBeTruthy();

});

test("Supersets and Proper Supersets", () => {
  const a = new CSetArray([0, 1, 2]);
  const b = new CSetArray([0, 1, 2, 3, 4, 5]);
  
  expect(a.isSuperset(b)).toBeFalsy();
  expect(b.isSuperset(b)).toBeTruthy();
  expect(b.isSuperset(a)).toBeTruthy();

  expect(a.isProperSuperset(a)).toBeFalsy();
  expect(a.isProperSuperset(b)).toBeFalsy();
  expect(b.isProperSuperset(a)).toBeTruthy();
});

test("Equal and Proper Supersets", () => {
  const a = new CSetArray([0, 1, 2]);
  const b = new CSetArray([0, 1, 2, 3, 4, 5]);
  
  expect(a.intersect(b).isEqual(a)).toBeTruthy();
  expect(a.isEqual(b)).toBeFalsy();
  expect(a.isEqual(a)).toBeTruthy();
  expect(b.isEqual(a)).toBeFalsy();

});

test("header of intersection", () => {

  const a = new CSetArray([1, 2]).as("A");
  const b = new CSetArray([1, 2]).as("B");

  expect(a.intersect(b).header).toEqual(["A"]);

});

test("header of cross products", () => {

    const a = new CSetArray([1, 2]).as("A");
    const b = new CSetArray([1, 2, 3, 4]).as("B");

    expect(a.crossProduct(b).header).toEqual(["A", "B"]);

    expect(() => a.crossProduct(b.as("A")))
        .toThrowError('Repeated headers are not allowed A, A');

    const s = a.union(b).as("C").crossProduct(a).crossProduct(b);
    expect(s.header).toEqual(["C","A","B"]);
});

test("cross product alias", () => {

  const ab = new CSetArray([1, 2]).as("a").crossProduct(new CSetArray([1, 2, 3]).as("b"));

  const AB = ab.as("A").crossProduct(ab.as("B"));

  expect(AB.header).toEqual(["A.a", "A.b", "B.a", "B.b"]);

});

test("Union + Cross Product", () => {
  const a = new CSetArray([1, 3, 2]);
  const b = a.union(new CSetArray([5, 3, 4])).as("AB");
  
  expect([...b.values()]).toEqual([1, 3, 2, 5, 4]);

  expect(a.count()).toBe(3);
  expect(b.count()).toBe(5);
  
  const ab = a.crossProduct(b); 
  expect(ab.count()).toBe(15);
  
  expect([...ab.values()]).toEqual(
    [
      [1,1],[1,3],[1,2],[1,5],
      [1,4],[3,1],[3,3],[3,2],
      [3,5],[3,4],[2,1],[2,3],
      [2,2],[2,5],[2,4]
    ]
  );
});

test("Count", () => {

  const a = new CSetArray([1, 3, 2]);
  const b = a.union(new CSetArray([5, 3, 4])).as("AB");
  
  expect(a.count()).toBe(3);
  expect(b.count()).toBe(5);

  const ab = a.crossProduct(b); 
  expect(ab.count()).toBe(15);

  const oddSum = a.as("A").crossProduct(b.as("B")).select(
    ["A", "B"],
    {
      name: "odd-sum",
      predicate: (A, B) => (A + B) % 2 === 1
    }
  ); 

  expect(oddSum.count()).toBe(7);

});

test("distinct cross product (SEND MORE MONEY)", () => {

  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const d = new CSetArray(digits);
  const letters = ["S", "E", "N", "D", "M", "O", "R", "Y"];
  const notEqualPred = {
    name: "<>",
    predicate: (a, b) => a !== b
  };

  let s = d.as(letters[0]);
  for (let i=1; i<letters.length; i++) {
    const letter=letters[i];

    s = s.crossProduct(d.as(letter));
    
    // make selects to all variables be different.
    for (let j=i-1; j>=0; j--) {
      const a = letters[j];
      s = s.select([a, letter], notEqualPred);
    }
  }

  // S E N D M O R Y
  const sendMoreMoney = s.select(
    ["S", "E", "N", "D", "M", "O", "R", "Y"],
    {
      name: "add",
      predicate: (S, E, N, D, M, O, R, Y) => 
          S * 1000 + E * 100 + N * 10 + D 
        + M * 1000 + O * 100 + R * 10  + E  
          === 
          M * 10000 + O * 1000 + N * 100 + E * 10 + Y
    }
  );

  for (let [S, E, N, D, M, O, R, Y] of sendMoreMoney.values()) {
    const send = S * 1000 + E * 100 + N * 10 + D;
    const more = M * 1000 + O * 100 + R * 10  + E;
    const money = M * 10000 + O * 1000 + N * 100 + E * 10 + Y;
    // console.log(`${send} + ${more} = ${money}`);
    expect(send + more).toBe(money);
  }
});

test("distinct cross product", () => {

    const notEqualPred = {
      name: "<>",
      predicate: (a, b) => a !== b
    };

    {
      const A = new CSetArray([1, 2, 3]).as("a").crossProduct(
        new CSetArray([1, 2]).as("b")
      ).select(["a", "b"], notEqualPred);

      expect([...A.values()]).toEqual([[ 1, 2 ], [ 2, 1 ], [ 3, 1 ], [ 3, 2 ]]);
    }

    {
      const A = new CSetArray([1, 2]);

      const B = A.as("a").crossProduct(A.as("b")).crossProduct(
        A.as("c").crossProduct(A.as("d"))
      )
        .select(["a", "c"], notEqualPred)
        .select(["a", "d"], notEqualPred)
        .select(["b", "c"], notEqualPred)
        .select(["b", "d"], notEqualPred)
      ;

      expect([...B.values()]).toEqual([[ 1, 1, 2, 2 ], [ 2, 2, 1, 1 ]]);
    }

    {
      const A = new CSetArray([1, 2, 3]);

      const B = A.as("a").crossProduct(A.as("b")).crossProduct(
        A.as("c").crossProduct(A.as("d"))
        
      )
        .select(["a", "c"], notEqualPred)
        .select(["a", "d"], notEqualPred)
        .select(["b", "c"], notEqualPred)
        .select(["b", "d"], notEqualPred)
      ;

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
    const a = new CSetArray([1, 2]).as("A");
    const b = new CSetArray([3, 4]).as("B");

    const c = new CSetArray([5, 6]).as("A");
    const d = new CSetArray([7, 8]).as("B");

    const ab = a.crossProduct(b);
    const dc = d.crossProduct(c);

    const ab_UNION_dc = ab.union(dc);

    expect([...ab_UNION_dc.values()]).toEqual(
      [[1,3],[1,4],[2,3],[2,4],[5,7],[6,7],[5,8],[6,8]]
    );
  }

  {
    const a = new CSetArray([1, 2]).as("A");
    const b = new CSetArray([3, 4]).as("B");

    const c = new CSetArray([1, 2]).as("A");
    const d = new CSetArray([3, 5]).as("B");

    const ab = a.crossProduct(b);
    const dc = d.crossProduct(c);

    expect(dc.header).toEqual(["B", "A"]);

    const ab_INTERSECT_dc = ab.intersect(dc);

    expect([...ab_INTERSECT_dc.values()]).toEqual([[1,3],[2,3]]);
  }

  {
    const a = new CSetArray([1, 2]).as("A");
    const b = new CSetArray([3, 4]).as("B");

    const c = new CSetArray([1, 2]).as("A");
    const d = new CSetArray([3, 5]).as("B");

    const ab = a.crossProduct(b);
    const dc = d.crossProduct(c);

    const ab_DIFFERENCE_dc = ab.difference(dc);

    expect([...ab_DIFFERENCE_dc.values()]).toEqual([[1,4],[2,4]]);
  }

  {
    const a = new CSetArray([1, 2]).as("A");
    const b = new CSetArray([3, 4]).as("B");

    const c = new CSetArray([1, 2]).as("A");
    const d = new CSetArray([3, 5]).as("B");

    const ab = a.crossProduct(b);
    const dc = d.crossProduct(c);

    const ab_SYMMETRIC_DIFFERENCE_dc = ab.symmetricDifference(dc);

    expect([...ab_SYMMETRIC_DIFFERENCE_dc.values()]).toEqual([[1,4],[2,4],[1,5],[2,5]]);
  }

});

test("domain set extraction with projection", () => {

    const a = new CSetArray([1, 2]).as("a");
    const b = new CSetArray([1, 2]).as("b");

    expect([...a.projection("a").values()]).toEqual([1, 2]);
    expect([...a.crossProduct(b).projection("a").values()]).toEqual([1, 2]);
    expect([...a.crossProduct(b).select(
      ["a"], {
        name: "!2",
        predicate: x => x !== 2
      }
    ).projection("a").values()]).toEqual([1]);
});

test("projection set extraction", () => {

  const a = new CSetArray([1, 2]).as("a");
  const b = new CSetArray([3, 4]).as("b");
  const c = new CSetArray([5, 6]).as("c");
  const d = new CSetArray([7, 8]).as("d");

  const s = a.crossProduct(b).crossProduct(c).crossProduct(d);
  const db = s.projection("d", "b");

  expect(db.header).toEqual(["d", "b"]);
  expect([...s.projection("d", "b").values()]).toEqual([
      [7, 3], [8, 3], [7, 4], [8, 4]
  ]);

});

test("is equal", () => {
  const s = new CSetArray([0, 1]);
  const zero = new CSetArray([0]);
  const one = new CSetArray([1]);


  // and operation set,

  const a = zero.as("a").crossProduct(zero.as("b")).crossProduct(zero.as("c"))
    .union(zero.as("a").crossProduct(one.as("b")).crossProduct(zero.as("c")))
    .union(one.as("a").crossProduct(zero.as("b")).crossProduct(zero.as("c")))
    .union(one.as("a").crossProduct(one.as("b")).crossProduct(one.as("c")));

  expect([...a.values()]).toEqual([
    [0, 0, 0],
    [0, 1, 0],
    [1, 0, 0],
    [1, 1, 1]
  ]);

  const b = s.as("a").crossProduct(s.as("b")).crossProduct(s.as("c"))
    .select(["a", "b"], {name: "=", predicate: (a, b) => a === b})
    .select(["a", "c"], {name: "=", predicate: (a, c) => a === c})
    .select(["b", "c"], {name: "=", predicate: (b, c) => b === c})
    .union(
        s.as("a").crossProduct(s.as("b")).crossProduct(zero.as("c"))
        .select(["a", "b"], {name: "<>", predicate: (a, b) => a !== b})
    );

    expect([...b.values()]).toEqual([
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
      [1, 0, 0]
    ]);
  
    expect(a.isEqual(b)).toBe(true);

});

test("Extend CSet", () => {
  class Even extends CSet {
    *values () {
      for (let i=2; ; i+=2) {
          yield i;
      }
    }

    count () {
      return Infinity;
    }

    has (x) {
      return x % 2 === 0;
    }
  };

  const values = new CSetArray([1, 2, 3, 4, 5, 6]);
  const even = new Even();

  const ve = values.intersect(even);

  expect([...ve.values()]).toEqual([2, 4, 6]);
  expect(ve.count()).toEqual(3);

});

test("Select has(x)", () => {
  const a = new CSetArray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).as("a");
  const c = a.select(['a'], {
    name: "x%2",
    predicate: a => a % 2 === 0
  });

  expect(a.has(2)).toBeTruthy(); 
  expect(a.has(3)).toBeTruthy(); 

  expect(c.has(2)).toBeTruthy(); 
  expect(c.has(3)).toBeFalsy(); 

});

// TODO: test cross product for duplicated values (for self, union, ...)
