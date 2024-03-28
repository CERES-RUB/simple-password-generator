import postcssPresetEnv from "postcss-preset-env";
import atImport from "postcss-import";
import importUrl from "postcss-import-url";
import cssnano from "cssnano";
import url from "postcss-url";


const isProduction = process.env.NODE_ENV === 'production'


let config = {};
if (isProduction) {
    config = {
        plugins: [
            importUrl(),
            atImport({
                root: "src"
            }),
            postcssPresetEnv({
                stage: 0,
            }),
            cssnano({
                preset: "default",
            }),
            url({
                url: "copy",
                assetsPath: ".",
            }),
        ],
    };
} else {
    config = {
        plugins: [
            importUrl(),
            atImport(),
            postcssPresetEnv({
                stage: 0,
            }),
            url({
                url: "copy",
                assetsPath: ".",
            }),
        ],
    };
}

export default config;