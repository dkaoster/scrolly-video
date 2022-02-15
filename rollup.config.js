import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import copy from 'rollup-plugin-copy';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import { spawn } from 'child_process';

const watch = process.env.ROLLUP_WATCH === 'true';
const production = !watch;

const serve = () => {
  let server;

  const toExit = () => { if (server) server.kill(0); };

  return {
    writeBundle() {
      if (server) return;

      server = spawn(
        'npm',
        ['run', 'start', '--', '--dev', '--port', 4000],
        { stdio: ['ignore', 'inherit', 'inherit'], shell: true },
      );

      process.on('SIGTERM', toExit);
      process.on('exit', toExit);
    },
  };
};

export default {
  input: 'src/index.js',
  output: {
    sourcemap: true,
    format: 'iife',
    file: 'dist/scrolly-video.js',
  },
  plugins: [
    !production && copy({
      targets: [
        // The public folder for development
        { src: 'public/**/*', dest: 'dist' },
      ],
    }),

    svelte({
      preprocess: sveltePreprocess({
        sourceMap: !production,
      }),
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
        customElement: true,
      },
    }),

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
    watch && livereload({ watch: 'dist', delay: 200 }),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser({
      output: {
        comments: false,
      },
    }),
  ],

  watch: {
    clearScreen: false,
  },
};
