# CSet

CSet is a javascript lazzy Set library with support for cartesian product and predicate filtering, that is loosely based on 
tuple relation calculus and relation algebra.

Currently CSet support most normal set operation, including cartesian product.

# Install

```
    npm install cset
```

# Use (API)


## CSetArray

Create a set, from Array of values.
After set creation all operations on set are chainable, and they are not destructive and a new set is returned.


```javascript
    const {CSetArray, CSet} = require("cset");

    const A = new CSetArray([1, 2, 3]);
```

## Intersection

Creates a set with the intersection of two sets.

```javascript
    const A = new CSetArray([1, 2, 3]).intersect(
        new CSetArray([1, 2])
    );
```

### Intersection of cartesian product

Both cartesian product must have same headers, headers don't need to be in the same order.

```javascript
    const a = new CSetArray([1, 2]).as("A");
    const b = new CSetArray([3, 4]).as("B");

    const c = new CSetArray([1, 2]).as("A");
    const d = new CSetArray([3, 5]).as("B");

    const ab = a.cartesianProduct(b);
    const dc = d.cartesianProduct(c);

    console.log(dc.header); // ["B", "A"];
    console.log(ab.header); // ["A", "B"];

    const ab_INTERSECT_dc = ab.intersect(dc);

    consol.log([...ab_INTERSECT_dc.values()]); // [[1,3],[2,3]]
```


## Union

Creates a set with the union of two sets.

```javascript
    const A = new CSetArray([1, 2, 3]).union(
        new CSetArray([1, 2])
    );
```

### Union of cartesian product

Both cartesian product must have same headers, headers don't need to be in the same order.

```javascript
    const a = new CSetArray([1, 2]).as("A");
    const b = new CSetArray([3, 4]).as("B");

    const c = new CSetArray([5, 6]).as("A");
    const d = new CSetArray([7, 8]).as("B");

    const ab = a.cartesianProduct(b);
    const cd = c.cartesianProduct(d);

    const ab_UNION_cd = ab.union(cd);

    console.log([...ab_UNION_cd.values()]); // [[1,3],[1,4],[2,3],[2,4],[5,7],[6,7],[5,8],[6,8]]

```

## Difference

Creates a set with the difference of two sets.

```javascript
    const A = new CSetArray([1, 2, 3]).difference(
        new CSetArray([1, 2])
    );
```

### Difference of cartesian product

Both cartesian product must have same headers, headers don't need to be in the same order.

```javascript
    const a = new CSetArray([1, 2]).as("A");
    const b = new CSetArray([3, 4]).as("B");

    const c = new CSetArray([1, 2]).as("A");
    const d = new CSetArray([3, 5]).as("B");

    const ab = a.cartesianProduct(b);
    const dc = d.cartesianProduct(c);

    const ab_DIFFERENCE_dc = ab.difference(dc);

    console.log([...ab_DIFFERENCE_dc.values()]); // [[1,4],[2,4]]
```


## SymmetricDifference

Creates a set with the symmetric difference of two sets.

```javascript
    const A = new CSetArray([1, 2, 3]).symmetricDifference(
        new CSetArray([1, 2])
    );
```

### SymmetricDifference of cartesian product

Both cartesian product must have same headers, headers don't need to be in the same order.

```javascript
    const a = new CSetArray([1, 2]).as("A");
    const b = new CSetArray([3, 4]).as("B");

    const c = new CSetArray([1, 2]).as("A");
    const d = new CSetArray([3, 5]).as("B");

    const ab = a.cartesianProduct(b);
    const dc = d.cartesianProduct(c);

    const ab_SYMMETRIC_DIFFERENCE_dc = ab.symmetricDifference(dc);

    console.log(JSON.stringify([...ab_SYMMETRIC_DIFFERENCE_dc.values()])); // [[1,4],[2,4],[1,5],[2,5]]
```

## CartesianProduct

Creates a set with the cartesian product of two sets.

```javascript
    const A = new CSetArray([1, 2, 3]).cartesianProduct(
        new CSetArray([1, 2])
    );
```

## Has

It checks if an element is in the provided set.

```javascript
    const A = new CSetArray([1, 2, 3]);
    
    A.has(1); // True
    A.has(4); // False
```

## Values

Iterates all values of a set.

```javascript
    const A = new CSetArray([1, 2, 3]);

    for (let e of A.values()) {
        console.log(e); // will print all elements on A.
    }
```

## isEmpty

Checks if set is empty.

```javascript
  const empty = new CSetArray([]);
  const intersectEmpty = new CSetArray([1, 2]).intersect(new CSetArray([3, 4]));
  const notEmpty = new CSetArray([1, 2]).intersect(new CSetArray([2, 3, 4]));

  console.log(empty.isEmpty()); // True
  console.log(intersectEmpty.isEmpty()); // True
  console.log(notEmpty.isEmpty()); // False
```
## isSubset

Check if set is a subset of other set.

```javascript
  const a = new CSetArray([0, 1, 2]);
  const b = new CSetArray([0, 1, 2, 3, 4, 5]);
  
  console.log(a.isSubset(b)); // True 
  console.log(b.isSubset(b)); // True
  console.log(b.isSubset(a)); // False
```

## isProperSubset

Check if set is a proper subset of other set.

```javascript
  const a = new CSetArray([0, 1, 2]);
  const b = new CSetArray([0, 1, 2, 3, 4, 5]);
  
  console.log(a.isProperSubset(a)); // False, all elements of a are in a, so its not proper subset.
  console.log(a.isProperSubset(b)); // True, all lements of a are in b, 
```

## isSuperset

Check if set is a superset of other set.

```javascript
  const a = new CSetArray([0, 1, 2]);
  const b = new CSetArray([0, 1, 2, 3, 4, 5]);
  
  console.log(a.isSuperset(b)); // False
  console.log(b.isSuperset(b)); // True
  console.log(b.isSuperset(a)); // True

```

## isProperSuperset

Check if set is a proper superset of other set.

```javascript
  const a = new CSetArray([0, 1, 2]);
  const b = new CSetArray([0, 1, 2, 3, 4, 5]);
  
  console.log(a.isProperSuperset(a)); // False 
  console.log(a.isProperSuperset(b)); // False
  console.log(b.isProperSuperset(a)); // True
```

## isEqual

Check if two sets are equal.

```javascript
  const a = new CSetArray([0, 1, 2]);
  const b = new CSetArray([0, 1, 2, 3, 4, 5]);
  
  console.log(a.intersect(b).isEqual(a)); // True
  console.log(a.isEqual(b)); // False
  console.log(a.isEqual(a)); // True
  console.log(b.isEqual(a)); // False
```

## As

It binds an alias to a set. The "as" operation is normally useful to use with select.

```javascript
    const A = new CSetArray([1, 2, 3]).as("A");
    const B = A.as("B");

    // A and B are same sets with different alias.
    const C = new CSetArray([4, 5]);
    const AC = A.union(C).as("AC"); // add alias to A and C union. 
```

### Alias on cartesian products

In case of cartesian products an alias work as prefix, or table name, so that each individual 
element on resulting tuples can still be referenced.

```javascript
  const ab = new CSetArray([1, 2]).as("a").cartesianProduct(new CSetArray([1, 2, 3]).as("b"));
  const AB = ab.as("A").cartesianProduct(ab.as("B"));

  console.log(AB.header); // "A.a", "A.b", "B.a", "B.b";
```


## Header

In case of cartesian product it will return an array of alias (string), 
for normal sets it will return one alias (string).

```javascript

    const A = new CSetArray([1, 2, 3]).as("A");
    const B = new CSetArray([1, 2, 3]).as("A");

    console.log(A.header); // ["A"]

    const AxB = A.cartesianProduct(B);
    console.log(AxB.header); // ["A", "B"]

```

## Select

A select works as a filter on set elements, as other operators it creates a new set
where all set elements must comply with provided constrains.

```javascript
  const a = new CSetArray([1, 3, 2]);
  const b = a.union(new CSetArray([5, 3, 4])).as("AB");

  expect(a.count()).toBe(3);
  expect(b.count()).toBe(5);

  const ab = a.cartesianProduct(b); 
  expect(ab.count()).toBe(15);

  const oddSum = a.as("A").cartesianProduct(b.as("B")).select(
    ["A", "B"],
    {
      name: "odd-sum",
      predicate: (A, B) => (A + B) % 2 === 1
    }
  );

  for (let e of oddSum.values()) {
    console.log(e);
  }

  /*
    Output:
      [ 1, 2 ]
      [ 1, 4 ]
      [ 3, 2 ]
      [ 3, 4 ]
      [ 2, 1 ]
      [ 2, 3 ]
      [ 2, 5 ]
  */

```

Making a distinct cartesian product with selects:

```javascript
  const notEqualPred = {
    name: "<>",
    predicate: (a, b) => a !== b
  };

  const A = new CSetArray([1, 2, 3]).as("a").cartesianProduct(
    new CSetArray([1, 2]).as("b")
  ).select(["a", "b"], notEqualPred);

  console.log(JSON.stringfy([...A.values()]); // [[ 1, 2 ], [ 2, 1 ], [ 3, 1 ], [ 3, 2 ]]
```

Note: Its better to make selects with less variables, for example one or two variables, 
because they can be distributed and tested sooner on partial results.

## Count

It counts the elements on a set.

```javascript
  const a = new CSetArray([1, 3, 2]);
  const b = a.union(new CSetArray([5, 3, 4]));

  console.log(a.count()); // 3
```

# Projection

Creates a subset from original set with a restricted set of attributes.

```javascript
  const a = new CSetArray([1, 2]).as("a");
  const b = new CSetArray([3, 4]).as("b");
  const c = new CSetArray([5, 6]).as("c");
  const d = new CSetArray([7, 8]).as("d");

  const s = a.cartesianProduct(b).cartesianProduct(c).cartesianProduct(d);
  
  console.log([...s.projection("d", "b").values()]); 
  /* Output:
    [[7, 3], [8, 3], [7, 4], [8, 4]]
  */
```


# Examples

In this section I just want to show a few examples on how CSet can be used, but some of examples may not be the best use 
case for the lib (See Motivation section).

## Puzzle: Send+More=Money

Solve expression:

      S E N D
    + M O R E
  ------------
    M O N E Y


Where each letter on the expression is a digit (0..9) and all letters must have different values.
Some people discard M=0 solutions, but in this case I will consider all solutions including M=0.

```javascript

  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const d = new CSet(digits);
  const letters = ["S", "E", "N", "D", "M", "O", "R", "Y"];
  const notEqualPred = {
    name: "<>",
    predicate: (a, b) => a !== b
  };

  let s = d.as(letters[0]);
  for (let i=1; i<letters.length; i++) {
    const letter=letters[i];

    s = s.cartesianProduct(d.as(letter));
    
    // make constrains to all variables be different.
    for (let j=i-1; j>=0; j--) {
      const a = letters[j];
      s = s.constrain([a, letter], notEqualPred);
    }
  }

  // S E N D M O R Y
  const sendMoreMoney = s.constrain(
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
    console.log(`${S * 1000 + E * 100 + N * 10 + D} + ${M * 1000 + O * 100 + R * 10 + E} = ${M * 10000 + O * 1000 + N * 100 + E * 10 + Y}`);
  }

```

# Motivation

I created CSet to try to find a way to handle domain combinatorial explosion.
The main design concept of CSet is to be lazzy, do as little as possible and only do it on demand,
by delaying evaluation and by failing sooner than later we can save processing time and memory.

While memory and processing time is a concern of CSet design, not all combinatorial problems are
suited for CSet, CSet is meant to be used as a domain/set representation library, but not to be used 
for example as a Constrain Solving Problem library. 


# Future Work

I think I would like to grow CSet features, manly set theory stuff, and optimize the engine with a 
planner, cache and some other database techniques.


