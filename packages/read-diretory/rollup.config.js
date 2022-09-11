
import convertCjs2Es6 from '@rollup/plugin-commonjs';
import loadNodeModule from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import buble from '@rollup/plugin-buble';

//import peerDepsExternal from 'rollup-plugin-peer-deps-external';
// import copy from 'rollup-plugin-copy';
import { terser } from 'rollup-plugin-terser';
//import postcss from 'rollup-plugin-postcss';

export default [
  {
    input: 'src/index.js',
    output: {
      file: 'dist/index.js',
      format: 'umd',
      name: 'readDiretory'
    },
    plugins: [
      //peerDepsExternal({includeDependencies: true}),
      convertCjs2Es6(),
      loadNodeModule(), 
      babel({ babelHelpers: 'bundled' }),
      buble(),
      //terser(),
      //postcss()
    ]
  },
  {
    input: 'src/index.js',
      output: {
      file: 'dist/index.esm.js',
      format: 'esm',
    },
    plugins: [
      //peerDepsExternal({includeDependencies: true}),
      convertCjs2Es6(),
      loadNodeModule(), 
      //babel({ babelHelpers: 'bundled' }),
      //buble(),
      //terser(),
      //postcss()
    ]
  },  
];
