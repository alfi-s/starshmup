import resolve from '@rollup/plugin-node-resolve';
import compiler from '@ampproject/rollup-plugin-closure-compiler';
import size from 'rollup-plugin-filesize';

export default {
    input: 'src/index.js',
    output: {
        file: 'build/main.js',
        format: 'iife',
    },
    plugins: [
        resolve(),
        compiler({
            compilation_level: "ADVANCED"
        }),
        size()
    ]
}