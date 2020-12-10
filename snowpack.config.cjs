"use strict";

module.exports = {
    mount: {
        src: "/",
    },
    plugins: [
        "@snowpack/plugin-typescript",
        ["@snowpack/plugin-optimize", {
            minifyJS: true,
            minifyHTML: true,
            minifyCSS: true,
            preloadModules: true,
        }],
    ],
    installOptions: {
        installTypes: true,
        sourceMap: true,
    },
    buildOptions: {
        // clean: true,
        out: "./web/",
        sourceMaps: true,
        webModulesUrl: "/packages",
    },
};
