import path from 'path';

import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';

import { nodeExternals } from 'rollup-plugin-node-externals';
import typescript from '@rollup/plugin-typescript';
import globImport from 'rollup-plugin-glob-import';
import { preserveDirectives } from 'rollup-plugin-preserve-directives';

export const esmLibraryPresets = [
  '@babel/preset-typescript',
  [
    '@babel/env',
    {
      modules: false,
      loose: true,
      targets: {
        browsers: '> 1%, node 20, last 1 versions, Firefox ESR, not IE > 0, not IE_Mob > 0, not dead'
      }
    }
  ],
  [
    '@babel/preset-react',
    {
      runtime: 'automatic'
    }
  ]
];

export const basePlugins = [
  [
    '@babel/plugin-transform-runtime',
    {
      useESModules: true
    }
  ],
  [
    'module-resolver',
    {
      root: ['./', './src']
    }
  ]
];

export const stylePlugins = [
  [
    'babel-plugin-styled-components',
    {
      ssr: true,
      displayName: true,
      fileName: false,
      pure: true
    }
  ]
];

export const reactCompilerPlugins = [['babel-plugin-react-compiler', {
  target: '19'
}]];

const SRC_DIR = path.resolve(import.meta.dirname, 'src');
const INCLUDE_DIR = path.resolve(import.meta.dirname, '../../', 'types/**/*');
const SRC_FILE = path.resolve(SRC_DIR, 'index.ts');

export default {
  input: SRC_FILE,
  output: {
    sourcemap: true,
    dir: './.dist',
    format: 'esm',
    preserveModules: true
  },
  cache: true,
  plugins: [
    nodeExternals({ deps: true }),
    nodeResolve({
      moduleDirectories: ['node_modules', 'src'],
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.es', '.es6', '.mjs']
    }),
    typescript({
      include: ['node_modules/@types/*', INCLUDE_DIR, '{,**/}*.(cts|mts|ts|tsx)'],
      noForceEmit: true
    }),
    babel({
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      babelHelpers: 'runtime',
      exclude: /node_modules/,
      presets: [...esmLibraryPresets],
      plugins: [...reactCompilerPlugins, ...basePlugins, ...stylePlugins]
    }),
    globImport({
      format: 'default'
    }),
    preserveDirectives({ suppressPreserveModulesWarning: true, exclude: ['**/*.scss', '**/*.css'] })
  ],
  onwarn(warning, warn) {
    if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;

    warn(warning);
  }
}
