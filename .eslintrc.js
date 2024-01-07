module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir : __dirname, 
    sourceType: 'module',
  },
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  plugins: [
    "@typescript-eslint",
    '@typescript-eslint/eslint-plugin',
    "prettier"
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    "prettier/prettier": ["error", {
      "printWidth": 70,
      "tabWidth": 2,
      "singleQuote": true,
      "trailingComma": "all",
      "arrowParens": "always",
      "semi": false
    }],
    '@typescript-eslint/interface-name-prefix'
    : 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
