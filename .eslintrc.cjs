module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    "prettier",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  plugins: ["prettier", "react-refresh"],
  rules: {
    "prettier/prettier": "warn",
    "no-console": "warn",
    "react-refresh/only-export-components": "warn",
  },
};
