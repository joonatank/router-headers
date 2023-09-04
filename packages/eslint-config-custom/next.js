const { resolve } = require("node:path");
 
const project = resolve(process.cwd(), "tsconfig.json");
 
module.exports = {
  plugins: ["prettier"],
  extends: [
    'next',
    'turbo',
    'prettier',
    // turborepo custom eslint configuration configures the following rules:
    //  - https://github.com/vercel/turbo/blob/main/packages/eslint-plugin-turbo/docs/rules/no-undeclared-env-vars.md
    "eslint-config-turbo",
  ],
  parserOptions: {
    project,
  },
  globals: {
    React: true,
    JSX: true,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: ["node_modules/", "dist/"],
  rules: {
    "import/no-default-export": "off",
    "prettier/prettier": "error"
  },
}
