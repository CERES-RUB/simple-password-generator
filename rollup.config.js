import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
// import { nodeResolve } from "@rollup/plugin-node-resolve";
import multiInput from "rollup-plugin-multi-input";
// import commonjs from "@rollup/plugin-commonjs";
// import json from "@rollup/plugin-json";

const isProduction = process.env.NODE_ENV === "production";

const dev = {
    input: ["./src/**/*.ts"],
    output: {
        dir: "dev_build/",
        format: "esm",
        entryFileNames: "[name].js",
        sourcemap: "inline",
    },
    plugins: [
        multiInput.default({
            relative: "src/",
        }),
        typescript(),
        // nodeResolve({ preferBuiltins: true }),
        // commonjs(),
        // json(),
    ],
    watch: {
        exclude: ["node_modules/**"],
    },
};

const prod = {
    input: ["./src/**/*.ts"],
    output: {
        dir: "prod_build/",
        format: "esm",
        sourcemap: false,
        compact: true,
        minifyInternalExports: true,
        entryFileNames: "[name].js",
    },
    plugins: [
        multiInput.default({
            relative: "src/",
        }),
        typescript({
            inlineSourceMap: false,
        }),
        terser(),
        // nodeResolve({ preferBuiltins: true }),
        // commonjs(),
        // json(),
    ],
};

export default isProduction ? prod : dev;
