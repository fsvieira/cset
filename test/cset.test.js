const {CSetArray, CSet, fromJSON} = require('../src');

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

  expect([...b.values()]).toEqual([1, 2, 3, 4, 5]);

  expect(a.count()).toBe(3);
  expect(b.count()).toBe(5);
  
  const ab = a.crossProduct(b); 
  expect(ab.count()).toBe(15);

  expect([...ab.values()]).toEqual(
    [
      [1,1],[1,2],[1,3],[1,4],[1,5],
      [2,1],[2,2],[2,3],[2,4],[2,5],
      [3,1],[3,2],[3,3],[3,4],[3,5]
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

test("distinct cross product (SEND MORE MONEY) [NO OPTIMIZATIONS]", () => {

  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const d = new CSetArray(digits);
  const letters = ["S", "E", "N", "D", "M", "O", "R", "Y"];

  const s = letters.map(h => d.as(h)).reduce(
    (s, e) => s?s.crossProduct(e):e
  );

  // S E N D M O R Y
  const sendMoreMoney = s.select(
    ["S", "E", "N", "D", "M", "O", "R", "Y"],
    {
      name: "add",
      predicate: (S, E, N, D, M, O, R, Y) => 
          S * 1000 + E * 100 + N * 10 + D 
        + M * 1000 + O * 100 + R * 10  + E  
          === 
          M * 10000 + O * 1000 + N * 100 + E * 10 + Y,
      partial: (headers, values) => new Set(values).size === values.length
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

test("distinct cross product (SEND MORE MONEY) [OPTIMIZATIONS]", () => {

  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const d = new CSetArray(digits);
  const letters = ["S", "E", "N", "D", "M", "O", "R", "Y"];

  const s = letters.map(h => d.as(h)).reduce(
    (s, e) => s?s.crossProduct(e):e
  );

  // S E N D M O R Y
  const sendMoreMoney = s.select(
    ["S", "E", "N", "D", "M", "O", "R", "Y"],
    {
      name: "add",
      predicate: (S, E, N, D, M, O, R, Y) => 
          S * 1000 + E * 100 + N * 10 + D 
        + M * 1000 + O * 100 + R * 10  + E  
          === 
          M * 10000 + O * 1000 + N * 100 + E * 10 + Y,
      partial: (headers, values) => {
        if (new Set(values).size === values.length) {

          if (headers.length >= 3) {
            const e = headers.indexOf("E");
            let rs = true;

            if (e !== -1) {
              const d = headers.indexOf("D");
              const y = headers.indexOf("Y");
              const n = headers.indexOf("N");
              const r = headers.indexOf("R");
              const o = headers.indexOf("O");
  
              if (d !== -1 && y !== -1) {
                rs = rs && (values[d] + values[e]) % 10 === values[y];
              }

              if (n !== -1) {
                if (r !== -1) {
                  rs = rs && 
                    ((values[n] + values[r]) % 10 === values[e]
                      || (values[n] + values[r] + 1) % 10 === values[e]
                    );
                }

                if (o !== -1) {
                  rs = rs && (
                    values[e] + values[o]) % 10 === values[n]
                    || (values[e] + values[o] + 1) % 10 === values[n]
                    ;
                }
              }

            }

            return rs;
          }

          return true;
        }

        return false;
      }
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
      const A = new CSetArray([1, 2, 3, 4, 5, 7, 8, 9, 10]);
      const B = A.as("a").crossProduct(A.as("b")).crossProduct(
        A.as("c").crossProduct(A.as("d"))
      )
        .select(["a", "b", "c", "d"], {
          name: "<>",
          partial: (headers, values) => {
              const p = headers.map(h => ["a", "b", "c", "d"].indexOf(h));
              const s = values[0];
              for (let i=1; i<values.length; i++) {
                if (values[i] !== s + p[i]) {
                  return false;
                }
              }

              return true;
            }
        });

      expect([...B.values()]).toEqual([[1,2,3,4],[2,3,4,5],[7,8,9,10]]);
    }

    {
      const A = new CSetArray([1, 2, 3, 4, 5, 7, 8, 9, 10]);

      const B = A.as("a").crossProduct(A.as("b")).crossProduct(
        A.as("c").crossProduct(A.as("d"))
      )
        .select(["a", "b", "c", "d"], {
          name: "<>",
          predicate: (a, b, c, d) => b === a + 1 && c === b + 1 && d === c + 1,
          partial: (headers, ...args) => new Set(args).size === args.length
        });

      expect([...B.values()]).toEqual([[1,2,3,4],[2,3,4,5],[7,8,9,10]]);
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

test("intersection => projection", () => {

  const a = new CSetArray([1, 2, 3]).as("a");

  const A = a.crossProduct(a.as("b")).crossProduct(a.as("c"));
  const B = a.crossProduct(a.as("b")).crossProduct(a.as("c"));

  const abc = A.intersect(B);
  const ac = abc.projection("a", "c");

  expect(ac.header).toEqual(["a", "c"]);

  expect([...ac.values()]).toEqual([
    [1,1],[1,2],[1,3],
    [2,1],[2,2],[2,3],
    [3,1],[3,2],[3,3]
  ]);

});

test("projection => intersection", () => {

  const a = new CSetArray([1, 2, 3]).as("a");

  const abc = a.crossProduct(a.as("b")).crossProduct(a.as("c"));
  const ac = abc.projection("a", "c");
  const acac = ac.intersect(ac);

  expect(acac.header).toEqual(["a", "c"]);
  expect([...acac.values()]).toEqual([
    [1,1],[1,2],[1,3],
    [2,1],[2,2],[2,3],
    [3,1],[3,2],[3,3]
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
  
    expect([...a.intersect(b).values()]).toEqual([[0,0,0],[0,1,0],[1,0,0],[1,1,1]]);
    expect([...a.difference(b).values()]).toEqual([]);

    expect(a.isEqual(b)).toBe(true);
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

test("Intersect > 10 Values", () => {
  const a = new CSetArray([13, 23, 19]);
  const ab = a.crossProduct(a.as("b"));

  const aIb = ab.intersect(ab);

  console.log([...aIb.values()]);
});

/*

// ---- JSON test,

test("JSON CSetArray", () => {
  const a = new CSetArray([1, 2, 3]);

  const aJSON = a.toJSON();

  const aj = fromJSON(aJSON);

  expect([...a.values()]).toEqual([...aj.values()]);
}); 

test("JSON Intersect", () => {
  const a = new CSetArray([1, 2, 3]);
  const b = new CSetArray([2, 3, 4]);
  const ab = a.intersect(b);

  const abJSON = ab.toJSON();

  const abj = fromJSON(abJSON);

  console.log(
    JSON.stringify([...ab.values()]), 
    JSON.stringify([...abj.values()]), 
  );

  expect([...ab.values()]).toEqual([...abj.values()]);
}); 

test("JSON Union", () => {
  const a = new CSetArray([1, 2, 3]);
  const b = new CSetArray([2, 3, 4]);
  const ab = a.union(b);

  const abJSON = ab.toJSON();

  const abj = fromJSON(abJSON);

  console.log(
    JSON.stringify([...ab.values()]), 
    JSON.stringify([...abj.values()]), 
  );

  expect([...ab.values()]).toEqual([...abj.values()]);
}); 
*/

/*
test("JSON test", () => {
  const a = fromJSON(
    {
      "sets": {
        "1": {
          "className": "CSetArray",
          "header": [
            "set_1"
          ],
          "values": [
            13
          ],
          "id": 1
        },
        "2": {
          "className": "Alias",
          "name": "set_2",
          "id": 2,
          "args": {
            "rename": "id$13"
          },
          "a": 1
        },
        "3": {
          "className": "CSetArray",
          "header": [
            "set_3"
          ],
          "values": [
            19
          ],
          "id": 3
        },
        "4": {
          "className": "Alias",
          "name": "set_4",
          "id": 4,
          "args": {
            "rename": "id$13"
          },
          "a": 3
        },
        "5": {
          "className": "Union",
          "name": "set_5",
          "id": 5,
          "a": 2,
          "b": 4
        },
        "6": {
          "className": "CSetArray",
          "header": [
            "set_6"
          ],
          "values": [
            23
          ],
          "id": 6
        },
        "7": {
          "className": "Alias",
          "name": "set_7",
          "id": 7,
          "args": {
            "rename": "id$13"
          },
          "a": 6
        },
        "8": {
          "className": "Union",
          "name": "set_8",
          "id": 8,
          "a": 5,
          "b": 7
        },
        "23": {
          "className": "CSetArray",
          "header": [
            "set_23"
          ],
          "values": [
            13
          ],
          "id": 23
        },
        "24": {
          "className": "Alias",
          "name": "set_24",
          "id": 24,
          "args": {
            "rename": "4$2"
          },
          "a": 23
        },
        "25": {
          "className": "CrossProduct",
          "name": "set_25",
          "id": 25,
          "a": 8,
          "b": 24
        },
        "26": {
          "className": "CSetArray",
          "header": [
            "set_26"
          ],
          "values": [
            19
          ],
          "id": 26
        },
        "27": {
          "className": "Alias",
          "name": "set_27",
          "id": 27,
          "args": {
            "rename": "4$2"
          },
          "a": 26
        },
        "28": {
          "className": "CrossProduct",
          "name": "set_28",
          "id": 28,
          "a": 8,
          "b": 27
        },
        "29": {
          "className": "Union",
          "name": "set_29",
          "id": 29,
          "a": 25,
          "b": 28
        },
        "30": {
          "className": "CSetArray",
          "header": [
            "set_30"
          ],
          "values": [
            23
          ],
          "id": 30
        },
        "31": {
          "className": "Alias",
          "name": "set_31",
          "id": 31,
          "args": {
            "rename": "4$2"
          },
          "a": 30
        },
        "32": {
          "className": "CrossProduct",
          "name": "set_32",
          "id": 32,
          "a": 8,
          "b": 31
        },
        "33": {
          "className": "Union",
          "name": "set_33",
          "id": 33,
          "a": 29,
          "b": 32
        },
        "96": {
          "className": "Intersect",
          "name": "set_96",
          "id": 96,
          "a": 33,
          // "b": 33
          "b": 33
        }
      },
      "start": 96
    }
  );

  console.log(JSON.stringify([...a.values()]));

});
*/

/*
test("JSON test", () => {
  const a = fromJSON(
    {
      "sets": {
        "1": {
          "className": "CSetArray",
          "header": [
            "set_1"
          ],
          "values": [
            13
          ],
          "id": 1
        },
        "2": {
          "className": "Alias",
          "name": "set_2",
          "id": 2,
          "args": {
            "rename": "id$13"
          },
          "a": 1
        },
        "3": {
          "className": "CSetArray",
          "header": [
            "set_3"
          ],
          "values": [
            19
          ],
          "id": 3
        },
        "4": {
          "className": "Alias",
          "name": "set_4",
          "id": 4,
          "args": {
            "rename": "id$13"
          },
          "a": 3
        },
        "5": {
          "className": "Union",
          "name": "set_5",
          "id": 5,
          "a": 2,
          "b": 4
        },
        "6": {
          "className": "CSetArray",
          "header": [
            "set_6"
          ],
          "values": [
            23
          ],
          "id": 6
        },
        "7": {
          "className": "Alias",
          "name": "set_7",
          "id": 7,
          "args": {
            "rename": "id$13"
          },
          "a": 6
        },
        "8": {
          "className": "Union",
          "name": "set_8",
          "id": 8,
          "a": 5,
          "b": 7
        },
        "23": {
          "className": "CSetArray",
          "header": [
            "set_23"
          ],
          "values": [
            13
          ],
          "id": 23
        },
        "24": {
          "className": "Alias",
          "name": "set_24",
          "id": 24,
          "args": {
            "rename": "4$2"
          },
          "a": 23
        },
        "25": {
          "className": "CrossProduct",
          "name": "set_25",
          "id": 25,
          "a": 8,
          "b": 24
        },
        "26": {
          "className": "CSetArray",
          "header": [
            "set_26"
          ],
          "values": [
            19
          ],
          "id": 26
        },
        "27": {
          "className": "Alias",
          "name": "set_27",
          "id": 27,
          "args": {
            "rename": "4$2"
          },
          "a": 26
        },
        "28": {
          "className": "CrossProduct",
          "name": "set_28",
          "id": 28,
          "a": 8,
          "b": 27
        },
        "29": {
          "className": "Union",
          "name": "set_29",
          "id": 29,
          "a": 25,
          "b": 28
        },
        "30": {
          "className": "CSetArray",
          "header": [
            "set_30"
          ],
          "values": [
            23
          ],
          "id": 30
        },
        "31": {
          "className": "Alias",
          "name": "set_31",
          "id": 31,
          "args": {
            "rename": "4$2"
          },
          "a": 30
        },
        "32": {
          "className": "CrossProduct",
          "name": "set_32",
          "id": 32,
          "a": 8,
          "b": 31
        },
        "33": {
          "className": "Union",
          "name": "set_33",
          "id": 33,
          "a": 29,
          "b": 32
        },
        "76": {
          "className": "Select",
          "name": "set_76",
          "id": 76,
          "args": {
            "name": "=",
            "alias": [
              "4$2",
              "id$13"
            ]
          },
          "a": 33
        },
        "77": {
          "className": "Select",
          "name": "set_77",
          "id": 77,
          "args": {
            "name": "const",
            "alias": [
              "id$13"
            ]
          },
          "a": 33
        },
        "78": {
          "className": "Select",
          "name": "set_78",
          "id": 78,
          "args": {
            "name": "const",
            "alias": [
              "id$13"
            ]
          },
          "a": 33
        },
        "79": {
          "className": "Select",
          "name": "set_79",
          "id": 79,
          "args": {
            "name": "const",
            "alias": [
              "id$13"
            ]
          },
          "a": 33
        },
        "80": {
          "className": "Intersect",
          "name": "set_80",
          "id": 80,
          "a": 76,
          "b": 77
        },
        "88": {
          "className": "Intersect",
          "name": "set_88",
          "id": 88,
          "a": 76,
          "b": 78
        },
        "96": {
          "className": "Intersect",
          "name": "set_96",
          "id": 96,
          "a": 76,
          "b": 79
        },
        "104": {
          "className": "Union",
          "name": "set_104",
          "id": 104,
          "a": 80,
          "b": 88
        },
        "105": {
          "className": "Union",
          "name": "set_105",
          "id": 105,
          "a": 104,
          "b": 96
        },
        "106": {
          "className": "Union",
          "name": "set_106",
          "id": 106,
          "a": 33,
          "b": 105
        },
        "107": {
          "className": "Intersect",
          "name": "set_107",
          "id": 107,
          "a": 33,
          "b": 105
        },
        "108": {
          "className": "Difference",
          "name": "set_108",
          "id": 108,
          "a": 106,
          "b": 107
        },
        "109": {
          "className": "Projection",
          "name": "set_109",
          "id": 109,
          "args": {
            "h": [
              "4$2"
            ]
          },
          "a": 108
        },
        "110": {
          "className": "CrossProduct",
          "name": "set_110",
          "id": 110,
          "a": 8,
          "b": 109
        },
        "111": {
          "className": "Intersect",
          "name": "set_111",
          "id": 111,
          "a": 108,
          "b": 110
        },
        "134": {
          "className": "Projection",
          "name": "set_134",
          "id": 134,
          "args": {
            "h": [
              "4$2"
            ]
          },
          "a": 111
        },
        "135": {
          "className": "CrossProduct",
          "name": "set_135",
          "id": 135,
          "a": 8,
          "b": 134
        },
        "136": {
          "className": "Intersect",
          "name": "set_136",
          "id": 136,
          "a": 111,
          "b": 135
        }
      },
      // "start": 136
      "start": 108
    },
    {
      "const": {
        name: "const",
        predicate: (...x) => {
          console.log("Select Const => " + JSON.stringify(x));
          return true;
        }        
      },
      "=": {
        name: "=",
        predicate: (...x) => new Set(x).size === 1,
        partial: (hs, vs) => new Set(vs).size === 1
      }
    }
  );

  console.log(JSON.stringify([...a.values()]));

});
*/
