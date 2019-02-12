# CSet

CSet is a javascript lazzy Set library with support for cartesian product and predicate filtering, that is loosely based on 
tuple relation calculus).

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


## Union

Creates a set with the union of two sets.

```javascript
    const A = new CSet([1, 2, 3]).union(
        new CSet([1, 2])
    );
```

## Difference

Creates a set with the difference of two sets.


```javascript
    const A = new CSet([1, 2, 3]).difference(
        new CSet([1, 2])
    );
```
## SymetricDifference

Creates a set with the symetric difference of two sets.

```javascript
    const A = new CSet([1, 2, 3]).symetricDifference(
        new CSet([1, 2])
    );
```

## CartesianProduct

Creates a set with the cartesian product of two sets.

```javascript
    const A = new CSet([1, 2, 3]).cartesianProduct(
        new CSet([1, 2])
    );
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

It binds an alias to a set. The "as" operation is normally usefull to use with "constrains".

```javascript
    const A = new CSet([1, 2, 3]).as("A");
    const B = A.as("B");

    // A and B are same sets with different alias.
    const C = new CSet([4, 5]);
    const AC = A.union(C).as("AC"); // add alias to A and C union. 
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


First I will show a simpler but not optimized version, this version will take more than one minute to complete.
Maybe in the future CSet will be optimized to run both versions at same spead :D...

```javascript

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

```

Now a more ugly version but that will run in less than ~20s.

```javascript

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


