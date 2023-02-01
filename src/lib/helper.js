// Helper functions

/**
 * Capitalizes the given string, e.g. from 'mouse' to 'Mouse'
 * @param {String} s 
 * @returns String
 */
export const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
};

/**
 * Decapitalizes the given string, e.g. from 'Mouse' to 'mouse'
 * @param {String} s 
 * @returns String
 */
export const decapitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toLowerCase() + s.slice(1)
};