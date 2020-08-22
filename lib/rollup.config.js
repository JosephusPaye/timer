import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

export default [
    {
        // Base timer
        input: 'timer.ts',
        plugins: [typescript(), nodeResolve(), terser()],
        output: [
            { file: pkg.browser, format: 'umd', name: 'timer' },
            { file: pkg.main, format: 'cjs' },
            { file: pkg.module, format: 'es' },
        ],
    },
    {
        // Timer utilities
        input: 'timer-util.ts',
        plugins: [typescript(), nodeResolve(), terser()],
        output: [
            {
                file: 'dist/timer-util.umd.js',
                format: 'umd',
                name: 'timerUtil',
            },
            { file: 'dist/timer-util.cjs.js', format: 'cjs' },
            { file: 'dist/timer-util.esm.js', format: 'es' },
        ],
    },
    {
        // Timer Vue component
        input: 'TimerVue.ts',
        plugins: [typescript(), nodeResolve(), terser()],
        output: [
            { file: 'dist/TimerVue.umd.js', format: 'umd', name: 'TimerVue' },
            { file: 'dist/TimerVue.cjs.js', format: 'cjs', exports: 'default' },
            { file: 'dist/TimerVue.esm.js', format: 'es' },
        ],
    },
];
