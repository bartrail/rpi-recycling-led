/**
 * parses obj data in a string, within those elements :text: {text} __text__
 * "peter is {age} years old and likes :pet: the most because of their __something__".parse({
 *   age       : 23,
 *   pet       : 'cats',
 *   something : 'tails'
 * })
 * @param obj
 * @returns {string}
 */
var parse = function (obj) {
  let getValueAsString = function (v) {
    return v === null ? '' : v
  }
  return this.toString().replace(/\{([^}]+)\}/g, (m, g) => {
    return getValueAsString(obj[g])
  }).replace(/:([a-zA-Z0-9]+):/g, (m, g) => {
    return getValueAsString(obj[g])
  }).replace(/__([a-zA-Z0-9]+)__/g, (m, g) => {
    return getValueAsString(obj[g])
  })
}

String.prototype.parse = parse

module.exports = parse