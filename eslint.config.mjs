import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // Override specific rules for TypeScript
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",  // Treat `any` as a warning
    },
  },
];

export default eslintConfig;
