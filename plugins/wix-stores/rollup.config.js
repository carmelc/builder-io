import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';
import camelCase from 'lodash.camelcase';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import serve from 'rollup-plugin-serve';
import nodePolyfills from 'rollup-plugin-node-polyfills';

const SERVE = process.env.SERVE === 'true';

const pkg = require('./package.json');

const libraryName = 'plugin';

export default {
  input: `src/${libraryName}.tsx`,
  // Important! We need to have shared references to 'react' and '@builder.io/sdk'
  // for builder plugins to run properly
  // Do not change these! If you install new dependenies, that is ok, they should be
  // left out of this list
  external: [
    'react',
    '@builder.io/react',
    '@builder.io/app-context',
    '@material-ui/core',
    '@emotion/core',
    '@emotion/styled',
    'mobx',
    'react-dom',
    'mobx-react',
  ],
  output: [
    {
      file: pkg.main,
      name: camelCase(libraryName),
      format: 'umd',
      sourcemap: true,
    },
    { file: pkg.module, format: 'es', sourcemap: true },
    { file: pkg.unpkg, format: 'system', sourcemap: true },
  ],
  watch: {
    include: 'src/**',
  },
  plugins: [
    nodeResolve(),
    typescript({ useTsconfigDeclarationDir: true }),
    // Allow json resolution
    json(),
    // Compile TypeScript files
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage

    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs({
      extensions: ['.js', '.ts', '.tsx'],
    }),

    // Resolve source maps to the original source
    sourceMaps(),
    nodePolyfills(),
    ...(SERVE
      ? [
          serve({
            contentBase: 'dist',
            // @ts-ignore
            port: 1268,
            headers: {
              // @ts-ignore
              'Access-Control-Allow-Origin': '*',
              // https://developer.chrome.com/blog/private-network-access-preflight/#new-in-pna
              'Access-Control-Allow-Private-Network': 'true',
            },
          }),
        ]
      : []),
  ],
};
