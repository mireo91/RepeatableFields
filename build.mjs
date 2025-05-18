import esbuild from "esbuild";
import extensibilityMap from "@neos-project/neos-ui-extensibility/extensibilityMap.json" with { type: "json" };
import { cssModules } from "esbuild-plugin-lightningcss-modules";


/** @type {import("esbuild").BuildOptions} */
const options = {
    logLevel: "info",
    bundle: true,
    minify: process.argv.includes("--production"),
    sourcemap: true,
    target: "es2020",
    format: "iife",
    legalComments: "eof",
    entryPoints: { Plugin: "Resources/Private/Editor/manifest.js" },
    loader: {
        ".js": "jsx"
    },
    outdir: "Resources/Public",
    alias: extensibilityMap,
    plugins: [
        cssModules({
            targets: {
                chrome: 80, // aligns somewhat to es2020
            },
            cssModules: {
                pattern: "mireo91-repeatablefields-[hash]-[local]",
            },
        }),
    ],
};

if (process.argv.includes("--watch")) {
    esbuild.context(options).then((ctx) => ctx.watch());
} else {
    esbuild.build(options);
}
