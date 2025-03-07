import svelte from 'rollup-plugin-svelte';
import vue from 'rollup-plugin-vue';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import copy from 'rollup-plugin-copy';
import terser from '@rollup/plugin-terser';
import css from 'rollup-plugin-css-only';
import { sveltePreprocess } from 'svelte-preprocess';
import { spawn } from 'child_process';

const docsSite = process.env.DOCS_SITE === 'true';
const watch = process.env.ROLLUP_WATCH === 'true';
const production = !watch;

const serve = () => {
  let server;

  const toExit = () => {
    if (server) server.kill(0);
  };

  return {
    writeBundle() {
      if (server) return;

      server = spawn(
        'npm',
        ['run', 'start', '--', '--dev', '--port', 4000, '--host'],
        { stdio: ['ignore', 'inherit', 'inherit'], shell: true },
      );

      process.on('SIGTERM', toExit);
      process.on('exit', toExit);
    },
  };
};

export default [
  // The config for building just the scrolly-video library
  !docsSite && {
    input: 'src/ScrollyVideo.js',
    output: {
      sourcemap: !production,
      format: 'iife',
      file: 'dist/scrolly-video.js',
      name: 'ScrollyVideo',
    },
    plugins: [
      copy({
        targets: [
          // Copy the raw source code and components over to dist
          { src: ['src/**/*', '!**/*.vue', '!**/*.jsx'], dest: 'dist' },
        ],
      }),

      // If you have external dependencies installed from
      // npm, you'll most likely need these plugins. In
      // some cases you'll need additional configuration -
      // consult the documentation for details:
      // https://github.com/rollup/plugins/tree/master/packages/commonjs
      resolve({ browser: true }),
      commonjs(),

      // If we're building for production (npm run build
      // instead of npm run dev), minify
      production &&
        terser({
          output: {
            comments: false,
          },
        }),
    ],
  },
  // The react component needs to be built
  !docsSite && {
    input: 'src/ScrollyVideo.jsx',
    output: [
      {
        file: 'dist/ScrollyVideo.cjs.jsx',
        format: 'cjs',
      },
      {
        file: 'dist/ScrollyVideo.esm.jsx',
        format: 'esm',
      },
    ],
    plugins: [
      babel({
        exclude: 'node_modules/**',
      }),
      resolve(),
      commonjs(),
    ],
  },
  // The vue component needs to be built
  !docsSite && {
    input: 'src/ScrollyVideo.vue',
    output: {
      file: 'dist/ScrollyVideo.vue.js',
      format: 'cjs',
    },
    plugins: [
      vue(),
      babel({
        exclude: 'node_modules/**',
      }),
      resolve(),
      commonjs(),
    ],
  },
  // The config for building the scrolly-video library and the docs site,
  // with a watcher in dev mode
  docsSite && {
    input: 'public/main.js',
    output: {
      sourcemap: !production,
      format: 'iife',
      file: 'build/docs.js',
      name: 'docs',
    },
    watch: {
      chokidar: {
        usePolling: true,
      },
    },
    plugins: [
      copy({
        targets: [
          // The public folder for development
          {
            src: ['static/**/*', 'static/.nojekyll', 'README.md'],
            dest: 'build',
          },
        ],
      }),

      svelte({
        preprocess: sveltePreprocess({
          sourceMap: !production,
        }),
        compilerOptions: {
          // enable run-time checks when not in production
          dev: !production,
        },
      }),

      // Takes out css into separate file
      css({ output: 'bundle.css' }),

      // If you have external dependencies installed from
      // npm, you'll most likely need these plugins. In
      // some cases you'll need additional configuration -
      // consult the documentation for details:
      // https://github.com/rollup/plugins/tree/master/packages/commonjs
      resolve({
        browser: true,
        dedupe: ['svelte'],
      }),
      commonjs(),

      // In dev mode, call `npm run start` once
      // the bundle has been generated
      watch && serve(),

      // Watch the `public` directory and refresh the
      // browser on changes when not in production
      watch && livereload({ watch: 'public', delay: 200 }),

      // If we're building for production (npm run build
      // instead of npm run dev), minify
      production &&
        terser({
          output: {
            comments: false,
          },
        }),
    ],
  },
].filter((d) => d);
