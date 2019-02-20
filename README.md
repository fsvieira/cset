# CSet

CSet is a javascript lazzy Set library with support for cartesian product and predicate filtering, that is loosely based on 
tuple relation calculus and relation algebra.

Currently CSet support most normal set operation, including cartesian product.

# Install

```
    npm install cset
```

# Use (API)


## CSet

Create a set, from Array of values.
After set creation all operations on set are chainable, and they are not destructive and a new set is returned.


```javascript
    const CSet = require("cset");

    const A = new CSet([1, 2, 3]);
```

## Intersection

Creates a set with the intersection of two sets.

```javascript
    const A = new CSet([1, 2, 3]).intersect(
        new CSet([1, 2])
    );
```

### Intersection of cartesian product

Both cartesian product must have same headers, headers don't need to be in the same order.

```javascript
    const a = new CSet([1, 2]).as("A");
    const b = new CSet([3, 4]).as("B");

    const c = new CSet([1, 2]).as("A");
    const d = new CSet([3, 5]).as("B");

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
    const A = new CSet([1, 2, 3]).union(
        new CSet([1, 2])
    );
```

### Union of cartesian product

Both cartesian product must have same headers, headers don't need to be in the same order.

```javascript
    const a = new CSet([1, 2]).as("A");
    const b = new CSet([3, 4]).as("B");

    const c = new CSet([5, 6]).as("A");
    const d = new CSet([7, 8]).as("B");

    const ab = a.cartesianProduct(b);
    const cd = c.cartesianProduct(d);

    const ab_UNION_cd = ab.union(cd);

    console.log([...ab_UNION_cd.values()]); // [[1,3],[1,4],[2,3],[2,4],[5,7],[6,7],[5,8],[6,8]]

```

## Difference

Creates a set with the difference of two sets.

```javascript
    const A = new CSet([1, 2, 3]).difference(
        new CSet([1, 2])
    );
```

### Difference of cartesian product

Both cartesian product must have same headers, headers don't need to be in the same order.

```javascript
    const a = new CSet([1, 2]).as("A");
    const b = new CSet([3, 4]).as("B");

    const c = new CSet([1, 2]).as("A");
    const d = new CSet([3, 5]).as("B");

    const ab = a.cartesianProduct(b);
    const dc = d.cartesianProduct(c);

    const ab_DIFFERENCE_dc = ab.difference(dc);

    console.log([...ab_DIFFERENCE_dc.values()]); // [[1,4],[2,4]]
```


## SymmetricDifference

Creates a set with the symmetric difference of two sets.

```javascript
    const A = new CSet([1, 2, 3]).symmetricDifference(
        new CSet([1, 2])
    );
```

### SymmetricDifference of cartesian product

Both cartesian product must have same headers, headers don't need to be in the same order.

```javascript
    const a = new CSet([1, 2]).as("A");
    const b = new CSet([3, 4]).as("B");

    const c = new CSet([1, 2]).as("A");
    const d = new CSet([3, 5]).as("B");

    const ab = a.cartesianProduct(b);
    const dc = d.cartesianProduct(c);

    const ab_SYMMETRIC_DIFFERENCE_dc = ab.symmetricDifference(dc);

    console.log(JSON.stringify([...ab_SYMMETRIC_DIFFERENCE_dc.values()])); // [[1,4],[2,4],[1,5],[2,5]]
```

## CartesianProduct

Creates a set with the cartesian product of two sets.

```javascript
    const A = new CSet([1, 2, 3]).cartesianProduct(
        new CSet([1, 2])
    );
```

## DistinctCartesianProduct

This is not defined on set theory, but I find it useful.

Its the same as cartesian product but it doesn't repeat elements of the two provided sets. 

```javascript
    const A = new CSet([1, 2, 3]).distinctCartesianProduct(
        new CSet([1, 2])
    );

    // Values: [ [ 1, 2 ], [ 2, 1 ], [ 3, 1 ], [ 3, 2 ] ]
```

In the following example, the right part (A) and left part (B) will not contain any repeated elements 
from each other, but they may contain repeated elements from itself.

```javascript
    const a = new CSet([1, 2]);
    const A = a.cartesianProduct(a);
    const B = a.cartesianProduct(a);


    const C = A.distinctCartesianProduct(B);

    // Values: [[ 1, 1, 2, 2 ], [ 2, 2, 1, 1 ]]
    //          [ A, A, B, B ], [A , A, B, B]
```

## Has

It checks if an element is in the provided set.

```javascript
    const A = new CSet([1, 2, 3]);
    
    A.has(1); // True
    A.has(4); // False
```

## Values

Iterates all values of a set.

```javascript
    const A = new CSet([1, 2, 3]);

    for (let e of A.values()) {
        console.log(e); // will print all elements on A.
    }
```

## isEmpty

Checks if set is empty.

```javascript
  const empty = new CSet([]);
  const intersectEmpty = new CSet([1, 2]).intersect(new CSet([3, 4]));
  const notEmpty = new CSet([1, 2]).intersect(new CSet([2, 3, 4]));

  console.log(empty.isEmpty()); // True
  console.log(intersectEmpty.isEmpty()); // True
  console.log(notEmpty.isEmpty()); // False
```
## isSubset

Check if set is a subset of other set.

```javascript
  const a = new CSet([0, 1, 2]);
  const b = new CSet([0, 1, 2, 3, 4, 5]);
  
  console.log(a.isSubset(b)); // True 
  console.log(b.isSubset(b)); // True
  console.log(b.isSubset(a)); // False
```

## isProperSubset

Check if set is a proper subset of other set.

```javascript
  const a = new CSet([0, 1, 2]);
  const b = new CSet([0, 1, 2, 3, 4, 5]);
  
  console.log(a.isProperSubset(a)); // False, all elements of a are in a, so its not proper subset.
  console.log(a.isProperSubset(b)); // True, all lements of a are in b, 
```

## isSuperset

Check if set is a superset of other set.

```javascript
  const a = new CSet([0, 1, 2]);
  const b = new CSet([0, 1, 2, 3, 4, 5]);
  
  console.log(a.isSuperset(b)); // False
  console.log(b.isSuperset(b)); // True
  console.log(b.isSuperset(a)); // True

```

## isProperSuperset

Check if set is a proper superset of other set.

```javascript
  const a = new CSet([0, 1, 2]);
  const b = new CSet([0, 1, 2, 3, 4, 5]);
  
  console.log(a.isProperSuperset(a)); // False 
  console.log(a.isProperSuperset(b)); // False
  console.log(b.isProperSuperset(a)); // True
```

## isEqual

Check if two sets are equal.

```javascript
  const a = new CSet([0, 1, 2]);
  const b = new CSet([0, 1, 2, 3, 4, 5]);
  
  console.log(a.intersect(b).isEqual(a)); // True
  console.log(a.isEqual(b)); // False
  console.log(a.isEqual(a)); // True
  console.log(b.isEqual(a)); // False
```

## As

It binds an alias to a set. The "as" operation is normally useful to use with "constrains".

```javascript
    const A = new CSet([1, 2, 3]).as("A");
    const B = A.as("B");

    // A and B are same sets with different alias.
    const C = new CSet([4, 5]);
    const AC = A.union(C).as("AC"); // add alias to A and C union. 
```

### Alias on cartesian products

In case of cartesian products an alias work as prefix, or table name, so that each individual 
element on resulting tuples can still be referenced.

```javascript
  const ab = new CSet([1, 2]).as("a").cartesianProduct(new CSet([1, 2, 3]).as("b"));
  const AB = ab.as("A").cartesianProduct(ab.as("B"));

  console.log(AB.header); // "A.a", "A.b", "B.a", "B.b";
```


## Header

In case of cartesian product it will return an array of alias (string), 
for normal sets it will return one alias (string).

```javascript

    const A = new CSet([1, 2, 3]).as("A");
    const B = new CSet([1, 2, 3]).as("A");

    console.log(A.header); // ["A"]

    const AxB = A.cartesianProduct(B);
    console.log(AxB.header); // ["A", "B"]

```

## Constrain

A constrain works as a filter on set elements, as other operators it creates a new set
where all set elements must comply with provided constrains.


```javascript

    const A = new CSet([1, 2, 3, 4, 5, 6, 7, 8, 9])
        .as("a")
        .constrain(
            // the constrain will operate on alias:
            ["a"],

            // The predicate,
            {
                // name of operator,
                name: "even",

                // predicate,
                predicate: ({a}) => a % 2 === 0
            } 
        );
```

## Count

It counts the elements on a set.

```javascript
  const a = new CSet([1, 3, 2]);
  const b = a.union(new CSet([5, 3, 4]));

  console.log(a.count()); // 3
```

# Domain
Get the domain of a variable.

```javascript
    const a = new CSet([1, 2]).as("a");
    const b = new CSet([1, 2]).as("b");

    expect(a.domain("a")).toEqual([1, 2]);
    expect(a.cartesianProduct(b).domain("a")).toEqual([1, 2]);

    expect(a.cartesianProduct(b).constrain(
      ["a"], {
        name: "!2",
        predicate: x => x !== 2
      }
    ).domain("a")).toEqual([1]);
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

The presented solution takes from 5 to 8 seconds to complete.
```javascript

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


