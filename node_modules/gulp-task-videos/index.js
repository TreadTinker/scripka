// (c) Andrew Wei
/**
 * @file Gulp task for processing video files. Option to watch for changes by
 *       passing either `--watch` or `--w` flag in the CLI.
 */

const $ = require('gulp-task-helpers');
const sequence = require('run-sequence');
const size = require('gulp-size');
const util = require('gulp-util');

const FILE_EXTENSIONS = ['mov', 'avi', 'ogg', 'ogv', 'webm', 'flv', 'swf', 'mp4', 'mv4'];

const DEFAULT_CONFIG = {
  base: undefined,
  dest: undefined,
  src: undefined,
  watch: {
    files: undefined, // Emitted files
    tasks: undefined // Current task name
  }
};

/**
 * Method that defines the Gulp task.
 *
 * @param {Object} options - Task options.
 * @param {string} [options.base] - Base path for the source files to emit.
 * @param {string|string[]} [options.src] - Glob pattern(s), relative to
 *                                          `options.base` if specified, that
 *                                          specifies what files to emit into
 *                                          the Gulp stream. These patterns are
 *                                          automatically appended with a
 *                                          wildcard glob of affected file
 *                                          extensions unless custom extensions
 *                                          are specified in the patterns.
 * @param {string} options.dest - Destination path to write files to.
 * @param {Object} [options.watch] - Options that define the file watching
 *                                   behavior. If set to `false`, watching will
 *                                   be disabled even if the CLI flag is set.
 * @param {string|string[]} [options.watch.files] - Glob pattern(s) that matches
 *                                                  files to watch. Defaults to
 *                                                  the emitted source files.
 * @param {string|Function|Array} [options.watch.tasks] - Array of task names or
 *                                                        functions to execute
 *                                                        when watched files
 *                                                        change. Defaults to
 *                                                        the current task name.
 * @param {boolean} [extendsDefaults=true] - Maps to `useConcat` param in
 *                                           `gulp-task-helpers`#config.
 *
 * @return {Function} - A function that returns a Gulp stream for this task.
 */
module.exports = function(options, extendsDefaults) {
  let isWatching = false;

  return function() {
    const taskName = this.seq[0];

    // Set defaults based on options before merging.
    if (options.src) {
      DEFAULT_CONFIG.watch = {
        files: [].concat($.glob(options.src, { base: options.base, exts: FILE_EXTENSIONS })),
        tasks: [taskName]
      }
    }

    const config = $.config(options, DEFAULT_CONFIG, (typeof extendsDefaults !== 'boolean') || extendsDefaults);
    const shouldWatch = (util.env['watch'] || util.env['w']) && (config.watch !== false);
    const src = $.glob(config.src, { base: config.base, exts: FILE_EXTENSIONS });
    const dest = $.glob('', { base: config.dest });

    if (shouldWatch && !isWatching) {
      isWatching = true;
      this.watch(config.watch.files, () => sequence.use(this).apply(null, [].concat(config.watch.tasks)));
    }

    return this
      .src(src, { base: config.base })
      .pipe(size({ title: `[${taskName}]`, gzip: true }))
      .pipe(this.dest(dest));
  }
};
