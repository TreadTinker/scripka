# gulp-task-helpers [![Circle CI](https://circleci.com/gh/andrewscwei/gulp-task-helpers/tree/master.svg?style=svg)](https://circleci.com/gh/andrewscwei/gulp-task-helpers/tree/master) [![npm version](https://badge.fury.io/js/gulp-task-helpers.svg)](https://badge.fury.io/js/gulp-task-helpers)

Micro library containing helper functions for common Gulp tasks.

## API

### `config(config[, defaults][, useConcat])`

Returns: `Object`

Returns a new object by merging `config` into `defaults` with values that only concern the current `NODE_ENV` (defaults to `production` if blank). `NODE_ENV` specific values are specified inside the `envs.{NODE_ENV}` key, and will override the non `NODE_ENV`-specific values (ones that are defined in the root level of the object). If a key appears in both `config` and `defaults`, the value in `config` will take precedence and either overwrites or merges into the value in `defaults`, depending on its data type—`object`'s and `array`'s are merged recursively by iterating through their enumerable keys, all else (i.e. `string`, `number`, `boolean` and `function`) are overwritten. In the case where the value is an array, you can set `useConcat` to `true` to alter the merging behavior to concatenation instead.

#### `config`

Type: `Object`

Target config object to resolve.

#### `defaults`

Type: `Object`<br>
Default: `{}`

Optional config object containing default values.

#### `useConcat`

Type: `boolean`<br>
Default: `false`

#### Example

```js
config({
  foo: 10,
  envs: {
    production: {
      foo: 100
    }
  }
}, {
  foo: 1,
  bar: 2
});

// Yields the following when `NODE_ENV` is `production`
// {
//   foo: 100,
//   bar: 2
// }
```

### `glob(patterns[, options])`

Returns: `string` or `string[]`

Resolves and returns glob pattern(s) by prefixing `options.base` and appending the glob pattern derived from `options.exts` (an array of file extensions) to each value in `patterns`.

#### `patterns`

Type: `string` or `string[]`

Glob pattern(s) to resolve.

#### `options`

Type: `Object`<br>
Default: `undefined`

Additional options.

##### `options.base`

Type: `string`<br>
Default: `undefined`

Base path to prefix to each pattern provided in `patterns`.

##### `options.exts`

Type: `string` or `string[]`<br>
Default: `undefined`

Array of file extensions (no '.' in front) to append to each pattern.

#### Example

```js
glob([
  'a/b', 
  'c/d'
], { 
  exts: [
    ['a', 'b'], 
    ['c', 'd']
  ] 
});

// Yields the following:
// [
//   'a/b.{a,b,c,d}', 
//   'c/d.{a,b,c,d}'
// ];
```

## Disclaimer

This is an experimental project driven by internal requirements.

## License

This software is released under the [MIT License](http://opensource.org/licenses/MIT).
