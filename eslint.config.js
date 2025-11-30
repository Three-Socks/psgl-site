import { fileURLToPath } from "node:url";
import { includeIgnoreFile } from "@eslint/compat";
import js from "@eslint/js";
import svelte from "eslint-plugin-svelte";
import { defineConfig } from "eslint/config";
import globals from "globals";
import ts from "typescript-eslint";
import svelteConfig from "./svelte.config.js";
import stylistic from "@stylistic/eslint-plugin";

const gitignorePath = fileURLToPath(new URL("./.gitignore", import.meta.url));

export default defineConfig(
    includeIgnoreFile(gitignorePath),
    js.configs.recommended,
    ...ts.configs.recommended,
    ...svelte.configs["flat/recommended"],
    {
        plugins: {
            "@stylistic": stylistic
        },
        languageOptions: {
            globals: { ...globals.browser, ...globals.node }
        },
        rules: {
            "no-undef": "off",
            "eqeqeq": ["error", "always"],
            "no-debugger": "error",
            "no-console": "warn",
            "@stylistic/quotes": ["error", "double"],
            "@stylistic/semi": "error",
            "@stylistic/brace-style": ["error", "1tbs"],
            "@stylistic/indent": ["error", 4],
        }
    },
    {
        files: [
            "**/*.svelte",
            "**/*.svelte.ts",
            "**/*.svelte.js"
        ],
        languageOptions: {
            parserOptions: {
                projectService: true,
                extraFileExtensions: [".svelte"],
                parser: ts.parser,
                svelteConfig
            }
        }
    }
);
