const {
    performance,
    PerformanceObserver
} = require('perf_hooks');

const { CSetArray, CSet } = require('./index');

function printStats(stats) {
    const ss = [];

    let finalTotal = 0;
    for (let label in stats) {
        const s = stats[label];

        s.durations.sort();

        console.log(label, s.durations.map(v => v.toFixed(4)).join(","));
        const hits = s.durations.length;
        const total = s.durations.reduce((acc, v) => acc + v, 0);
        const avg = total / hits;
        const max = s.durations.reduce((acc, v) => v > acc ? v : acc, 0);
        const min = s.durations.reduce((acc, v) => v < acc ? v : acc, 0);

        finalTotal += total;
        ss.push({
            path: label,
            hits,
            total,
            avg, max, min
        });
    }

    ss.sort((a, b) => b.avg - a.avg);

    const str = ss.map(({ path, hits, total, avg, max, min }) => `${path} : ${hits} hits, total: ${total}, ${avg} avg, ${max} max, ${min} min.`).join("\n");

    console.log(str);
    console.log("FINAL TOTAL => ", finalTotal);

}
/*
const getName = (target, fn) => target ? `${target.constructor.name}.${fn.name}` : fn.name;

const perfFunction = (target, fn, stats) => {
    const name = getName(target, fn);

    return (...args) => {
        const start = performance.now();
        const r = fn.apply(target, args);

        const end = performance.now();
        const duration = end - start;

        const s = stats[name] = stats[name] || { durations: [] };
        s.durations.push(duration);

        printStats(stats);

        if (typeof r === 'function') {
            return perfFunction(null, r, stats);
        }
        else if (typeof r === 'object') {
            // return new Proxy(r, perfHandler(stats));
            return perfObject(r, stats);
        }

        return r;
    }
}

const perfObject = (target, stats) => {
    for (let prop in target) {
        const f = target[prop];
        const type = typeof f;

        if (type === 'function') {
            target[prop] = perfFunction(target, prop, stats);
        }
        else if (type === 'object') {

        }
    }
}

const perfHandler = stats => ({
    get: function (target, prop, receiver) {
        const fn = target[prop];
        fn.name = prop;
        const newPath = getName(target, fn);

        if (typeof fn === 'function') {
            return perfFunction(target, fn, stats);
        }
        else if (typeof r === 'Object') {
            return new Proxy(r, perfHandler(newPath, stats));
        }

        return fn;
    }
})

function perfClass(target) {
    const stats = {};

    const handler = {
        construct(target, args) {
            const t = new target(...args);
            return new Proxy(t, perfHandler(stats));
        }
    }

    return new Proxy(target, handler);
}
*/
/*
const proxyFunction = (target, fn) => (...args) => {
    const r = fn.call(target, ...args);

    if (typeof r === 'function') {
        return proxyFunction(null, fn);
    }
    else {

    }
};*/

const getName = (target, fn) => target ? `${target.constructor.name}.${fn.name}` : fn.name;

const recordStats = (stats, name, fn) => {
    const start = performance.now();
    const r = fn();

    const end = performance.now();
    const duration = end - start;

    const s = stats[name] = stats[name] || { durations: [] };
    s.durations.push(duration);

    printStats(stats);

    return r;
}

const perfHandler = stats => ({
    construct(target, args) {
        const r = new target(...args);
        return perfTracker(r, stats);
    },
    get: function (target, prop, receiver) {
        const r = Reflect.get(target, prop, receiver);

        if (typeof r === 'function') {
            const name = getName(target, r);
            return (...args) => {
                const p = recordStats(stats, name, () => r.call(target, ...args));
                return new perfTracker(p, stats);
            }
        }

        return perfTracker(r, stats);
    },
    apply: function (target, thisArg, argumentsList) {
        const r = recordStats(stats, getName(thisArg, target), () => target.apply(thisArg, argumentsList));
        return perfTracker(r, stats)
    }
});

function perfTracker(target, stats = {}) {
    try {
        return new Proxy(target, perfHandler(stats));
    }
    catch (e) {
        return target;
    }
}

module.exports = perfTracker;

