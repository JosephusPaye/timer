import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

export default [
    {
        input: 'index.ts',
        plugins: [typescript(), nodeResolve(), terser()],
        output: [
            { file: pkg.browser, format: 'umd', name: 'timer' },
            { file: pkg.main, format: 'cjs' },
            { file: pkg.module, format: 'es' },
        ],
    }
];
