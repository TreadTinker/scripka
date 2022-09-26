// (c) Andrew Wei

const _ = require('lodash');
const path = require('path');

/**
 * Returns a new object by merging `config` into `defaults` with values that
 * only concern the current `NODE_ENV` (defaults to `production` if blank).
 * `NODE_ENV` specific values are specified inside the `envs.{NODE_ENV}` key,
 * and will override the non `NODE_ENV`-specific values (ones that are defined
 * in the root level of the object). If a key appears in both `config` and
 * `defaults`, the value in `config` will take precedence and either overwrites
 * or merges into the value in `defaults`, depending on its data type—`object`'s
 * and `array`'s are merged recursively by iterating through their enumerable
 * keys, all else (i.e. `string`, `number`, `boolean` and `function`) are
 * overwritten. In the case where the value is an array, you can set
 * `useConcat` to `true` to alter the merging behavior to concatenation
 * instead.
 *
 * @param {Object} config - Target config object to resolve.
 * @param {Object} [defaults={}] - Optional config object containing default
 *                                 values.
 * @param {boolean} [useConcat] - Specifies whether array values between
 *                                `config` and `defaults` should be merged by
 *                                concatenation rather than the iterating
 *                                through each enumerable key.
 *
 * @return {Object} - Resulting config object that contains only current
 *                    `NODE_ENV` specific values.
 *
 * @example
 *   config({
 *     foo: 10,
 *     envs: {
 *       production: {
 *         foo: 100
 *       }
 *     }
 *   }, {
 *     foo: 1,
 *     bar: 2
 *   });
 *
 *   // Yields the following when `NODE_ENV` is `production`
 *   // {
 *   //   foo: 100,
 *   //   bar: 2
 *   // }
 */
exports.config = function(config, defaults, useConcat) {
  const env = process.env.NODE_ENV || 'production';
  const defaultConfig = _.omit(defaults, 'envs') || {};
  const defaultEnvConfig = _.get(defaults, `envs.${env}`) || {};
  const targetBaseConfig = _.omit(config, 'envs') || {};
  const targetEnvConfig = _.get(config, `envs.${env}`) || {};
  useConcat = (typeof defaults === 'boolean') ? defaults : useConcat;

  const baseConfig = _.mergeWith(defaultConfig, targetBaseConfig, function(a, b) { return (useConcat && _.isArray(a)) ? _.union(a, b) : undefined; });
  const envConfig = _.mergeWith(defaultEnvConfig, targetEnvConfig, function(a, b) { return (useConcat && _.isArray(a)) ? _.union(a, b) : undefined; });

  return _.merge(baseConfig, envConfig);
};

/**
 * Resolves and returns glob pattern(s) by prefixing `options.base` and
 * appending the glob pattern derived from `options.exts` (an array of file
 * extensions) to each value in `patterns`.
 *
 * @param {string|string[]} [patterns] - Glob pattern(s) to resolve.
 * @param {Object} [options] - Additional options.
 * @param {string} [options.base] - Base path to prefix to each pattern provided
 *                                  in `patterns`.
 * @param {string|string[]} [options.exts] - Array of file extensions (no '.' in
 *                                           front) to append to each pattern.
 *
 * @return {string|string[]} - Resolved glob pattern(s).
 *
 * @example
 *   glob([
 *     'a/b',
 *     'c/d'
 *   ], {
 *     exts: [
 *       ['a', 'b'],
 *       ['c', 'd']
 *     ]
 *   });
 *
 *   // Yields the following:
 *   // [
 *   //   'a/b.{a,b,c,d}',
 *   //   'c/d.{a,b,c,d}'
 *   // ];
 */
exports.glob = function(patterns, options) {
  if (patterns instanceof Array) {
    patterns = _.flatten(patterns);
    return _.map(patterns, val => (exports.glob(val, options)));
  }
  else {
    if (!patterns) patterns = '';
    const base = _.get(options, 'base');
    const negate = _.startsWith(patterns, '!') && patterns.length > 1;
    const exts = (path.extname(patterns) === '') ? globExts(_.get(options, 'exts')) : '';

    if (negate) patterns = patterns.substr(1);

    return `${negate ? '!' : ''}${path.join(base || '', `${patterns}${exts}`)}`;
  }
};

/**
 * Returns a wildcard glob pattern of the specified file extensions.
 *
 * @param {...(string|string[])} extensions - Extensions to be included in the
 *                                            wildcard pattern.
 *
 * @return {string} - Wildcard glob pattern consisting of all specified
 *                    extensions.
 */
function globExts(extensions) {
  let exts = _.flattenDeep(_.concat.apply(null, arguments));
  return (exts.length <= 1) ? (exts[0] && `.${exts[0]}` || '') : `.{${exts.join(',')}}`;
};
