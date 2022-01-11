/**
 * Generates the src string given the size and format. Used with
 * rollup-generate-image-sizes
 *
 * @param srcString
 * @param size
 * @param format
 * @returns {`${*}@${string}w.jpg`}
 */
export const sizeGen = (srcString, size, format = 'jpg') => {
  const imagePathSplit = srcString.split('.');
  const imagePathPre = imagePathSplit.slice(0, -1).join('.');
  return `${imagePathPre}@${size}w.${format}`;
};
