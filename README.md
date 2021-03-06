# CSet

CSet is a JavaScript lazy Set library with support for cartesian product and predicate filtering, that is loosely based on 
tuple relation calculus and relation algebra.

Currently CSet support most normal set operation, including cartesian product.

# Changes

## 3.0.0
  * Version schema is now based on Semantic Version System (https://semver.org/)
  * From now to the future CSet will only support positive integers as elements.
  * Select now supports partial filtering.

# Install

```
    npm install cset
```

# Use (API)


## CSetArray

Create a set, from Array of values.
After set creation all operations on set are chainable, and they are not destructive and a new set is returned.


```javascript
    const {CSetArray} = require("cset");

    const A = new CSetArray([1, 2, 3]);
```

## Intersection

Creates a set with the intersection of two sets.

```javascript
    const A = new CSetArray([1, 2, 3]).intersect(
        new CSetArray([1, 2])
    );
```

### Intersection of cartesian/cross product

Both cartesian/cross product must have same headers, headers don't need to be in the same order.

```javascript
    const a = new CSetArray([1, 2]).as("A");
    const b = new CSetArray([3, 4]).as("B");

    const c = new CSetArray([1, 2]).as("A");
    const d = new CSetArray([3, 5]).as("B");

    const ab = a.crossProduct(b);
    const dc = d.crossProduct(c);

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

### Union of cartesian/cross product

Both cartesian/cross product must have same headers, headers don't need to be in the same order.

```javascript
    const a = new CSetArray([1, 2]).as("A");
    const b = new CSetArray([3, 4]).as("B");

    const c = new CSetArray([5, 6]).as("A");
    const d = new CSetArray([7, 8]).as("B");

    const ab = a.crossProduct(b);
    const cd = c.crossProduct(d);

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

### Difference of cartesian/cross product

Both cartesian/cross product must have same headers, headers don't need to be in the same order.

```javascript
    const a = new CSetArray([1, 2]).as("A");
    const b = new CSetArray([3, 4]).as("B");

    const c = new CSetArray([1, 2]).as("A");
    const d = new CSetArray([3, 5]).as("B");

    const ab = a.crossProduct(b);
    const dc = d.crossProduct(c);

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

### SymmetricDifference of cartesian/cross product

Both cartesian/cross product must have same headers, headers don't need to be in the same order.

```javascript
    const a = new CSetArray([1, 2]).as("A");
    const b = new CSetArray([3, 4]).as("B");

    const c = new CSetArray([1, 2]).as("A");
    const d = new CSetArray([3, 5]).as("B");

    const ab = a.crossProduct(b);
    const dc = d.crossProduct(c);

    const ab_SYMMETRIC_DIFFERENCE_dc = ab.symmetricDifference(dc);

    console.log(JSON.stringify([...ab_SYMMETRIC_DIFFERENCE_dc.values()])); // [[1,4],[2,4],[1,5],[2,5]]
```

## Cartesian/Cross Product

Creates a set with the cartesian/cross product of two sets.

```javascript
    const A = new CSetArray([1, 2, 3]).crossProduct(
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

### Alias on cartesian/cross products

In case of cartesian/cross products an alias work as prefix, or table name, so that each individual 
element on resulting tuples can still be referenced.

```javascript
  const ab = new CSetArray([1, 2]).as("a").crossProduct(new CSetArray([1, 2, 3]).as("b"));
  const AB = ab.as("A").crossProduct(ab.as("B"));

  console.log(AB.header); // "A.a", "A.b", "B.a", "B.b";
```


## Header

In case of cartesian/cross product it will return an array of alias (string), 
for normal sets it will return one alias (string).

```javascript

    const A = new CSetArray([1, 2, 3]).as("A");
    const B = new CSetArray([1, 2, 3]).as("A");

    console.log(A.header); // ["A"]

    const AxB = A.crossProduct(B);
    console.log(AxB.header); // ["A", "B"]

```

## Select

A select works as a filter on set elements, like other operators it creates a new set
where all set elements must comply with provided constrains.

Select(alias, {name, predicate, partial})

  * alias, an array containing name header of the restrictions,
  * name, the name of the constrain, it can be any string, useful for JSON serialization.
  * predicate, its a function defining a constrain, it has as arguments a value and outputs a boolean. 
  * partial, its similar to a constrain but it may be applied on partial values.

  We must define at least a predicate or a partial function.

```javascript
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

Using a partial and a predicate:


```javascript
      const A = new CSetArray([1, 2, 3, 4, 5, 7, 8, 9, 10]);

      const B = A.as("a").crossProduct(A.as("b")).crossProduct(
        A.as("c").crossProduct(A.as("d"))
      )
        .select(["a", "b", "c", "d"], {
          name: "<>",
          predicate: (a, b, c, d) => b === a + 1 && c === b + 1 && d === c + 1,

          // headers the partial header, value is the partial value.
          // eg. headers=["a", "b"], values=[1, 2]
          partial: (headers, value) => new Set(value).size === args.length
        });

      console.log([...B.values()]); // [[1,2,3,4],[2,3,4,5],[7,8,9,10]];
```

Same example with only partial definition:

```javascript
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

      console.log([...B.values()]); // [[1,2,3,4],[2,3,4,5],[7,8,9,10]];
```

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

  const s = a.crossProduct(b).crossProduct(c).crossProduct(d);
  
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
    console.log(`${send} + ${more} = ${money}`);
  }
```

With the use of partial filter, the problem is much more clean and optimized since we 
are filtering all values that are distinct.

# Motivation

I created CSet to try to find a way to handle domain combinatorial explosion.
The main design concept of CSet is to be lazy, do as little as possible and only do it on demand,
by delaying evaluation and by failing sooner than later we can save processing time and memory.

While memory and processing time is a concern of CSet design, not all combinatorial problems are
suited for CSet, CSet is meant to be used as a domain/set representation library, but not to be used 
for example as a Constrain Solving Problem library. 


# Future Work

I think I would like to grow CSet features, manly set theory stuff, and optimize the engine with a 
planner, cache and some other database techniques.


