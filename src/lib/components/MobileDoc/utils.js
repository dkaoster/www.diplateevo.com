import franc from 'franc';

/**
 * Takes the iterative nature of markups and turns it into a recursive
 * version so that we can render it with svelte
 *
 * @param markers
 * @returns {[]}
 */
const processMarkers = (markers) => {
  let stack = [];
  let stackCount = 0;
  let tree = [];

  markers.forEach(([
    textTypeIdentifier, openMarkupsIndexes, numberOfClosedMarkups, arg,
  ]) => {
    // Base case
    if (openMarkupsIndexes.length === numberOfClosedMarkups
      && numberOfClosedMarkups <= 1
      && stackCount === 0
    ) {
      tree = tree.concat([{
        textTypeIdentifier,
        markupIndex: openMarkupsIndexes[0],
        tree: arg,
        atomIndex: arg,
      }]);
    } else if (openMarkupsIndexes.length === numberOfClosedMarkups
      && numberOfClosedMarkups > 1
      && stackCount === 0
    ) {
      // single recursive case
      tree = tree.concat([{
        textTypeIdentifier: 0,
        markupIndex: openMarkupsIndexes[0],
        tree: processMarkers([[
          textTypeIdentifier,
          openMarkupsIndexes.slice(1),
          numberOfClosedMarkups - 1,
          arg,
        ]]),
      }]);
    } else {
      // push to stack
      stack = stack.concat([[
        textTypeIdentifier, openMarkupsIndexes, numberOfClosedMarkups, arg,
      ]]);
      stackCount += openMarkupsIndexes.length;
      stackCount -= numberOfClosedMarkups;

      // pop from stack recursive case
      if (stackCount === 0) {
        tree = tree.concat([{
          textTypeIdentifier: stack[0][0],
          markupIndex: stack[0][1][0],
          tree: processMarkers(stack.map((el, i) => {
            const copy = [...el];
            if (i === 0) copy[1] = copy[1].slice(1);
            if (i === stack.length - 1) copy[2] -= 1;
            return copy;
          })),
          atomIndex: stack[0][3],
        }]);
        stack = [];
      }
    }
  });

  return tree;
};

/**
 * Generate props
 *
 * @param arr
 * @returns {*}
 */
const genProps = (arr) => (arr
  ? arr.reduce((acc, val, i, arr2) => {
    // Because props is a flattened array, we need to unflatten
    // it into an object
    if (i % 2 === 0) acc[val] = arr2[i + 1];
    return acc;
  }, {})
  : {});

/**
 * Assigns the lang attribute to the appropriate tags.
 *
 * @param markers
 * @returns {*}
 */
const assignLang = (markers) => {
  const langMap = { cmn: 'zh' };
  return markers.map((marker) => ({
    ...marker,
    lang: langMap[franc(marker.tree, { minLength: 2 })] || 'en',
  }));
}

/**
 * Returns the most common entry in array, or the mode of the array.
 *
 * @param arr
 * @returns {any}
 */
const mode = (arr) => arr.sort(
  (a, b) => arr.filter((v) => v === a).length
    - arr.filter((v) => v === b).length,
).pop()

export {
  processMarkers, genProps, assignLang, mode,
};
