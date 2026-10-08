/**
 * Challenge 5: createCounter, once, memoize
 */

/**
 * Створює лічильник із замиканням.
 *
 * @param {number} [start=0]
 * @returns {{ increment: Function, reset: Function, value: Function }}
 */
export function createCounter(start = 0) {
  let current = start;

  return {
    increment() {
      current += 1;
      return current;
    },
    reset() {
      current = start;
      return current;
    },
    value() {
      return current;
    },
  };
}

/**
 * Виконує передану функцію лише один раз і повертає перший збережений результат.
 *
 * @param {Function} fn
 * @returns {Function}
 */
export function once(fn) {
  let hasRun = false;
  let cachedResult;

  return function (...args) {
    if (!hasRun) {
      hasRun = true;
      cachedResult = fn(...args);
    }
    return cachedResult;
  };
}

/**
 * Запам'ятовує результат виклику функції для одного примітивного аргументу.
 * Розрізняє примітиви 1 та '1' за допомогою Map.
 *
 * @param {Function} fn
 * @returns {Function}
 */
export function memoize(fn) {
  const cache = new Map();

  return function (arg) {
    if (cache.has(arg)) {
      return cache.get(arg);
    }

    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
}
