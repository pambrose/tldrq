import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Scratch files written by the Remember plugin.
    ".remember/**",
  ]),
  {
    // Bookmark thumbnails come from arbitrary user-submitted domains
    // (YouTube, Twitter OG, GitHub avatars, scraped OG tags), so next/image
    // would need a wildcard remote pattern to cover them.
    rules: {
      "@next/next/no-img-element": "off",
    },
  },
  {
    // The Electron main process runs as CommonJS and relies on __dirname.
    files: ["electron/**/*.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
]);

export default eslintConfig;
