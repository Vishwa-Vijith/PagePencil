module.exports = {
  // Specify the environment to use the appropriate global variables
  env: {
    browser: true, // For browser-specific globals like `window`, `document`, etc.
    es2021: true, // Enable ECMAScript 2021 features (e.g., async/await, optional chaining)
    node: true, // For Node.js-specific globals (e.g., `process`, `module`)
  },

  // Extending recommended ESLint rules
  extends: [
    "eslint:recommended", // Basic recommended rules
    "plugin:prettier/recommended", // Integrate Prettier with ESLint for auto-formatting (optional but useful)
  ],

  // Define the parser for modern JavaScript
  parser: "babel-eslint", // This allows ESLint to support modern JavaScript syntax like async/await and class properties

  // Rules for your specific project
  rules: {
    // Basic settings
    indent: ["error", 2], // Enforce 2-space indentation
    quotes: ["error", "single"], // Enforce single quotes for strings
    semi: ["error", "always"], // Require semicolons at the end of statements

    // Allow the use of console in development (you can change this to "warn" or "error" based on your needs)
    "no-console": "warn", // Warns when `console.log` is used (useful to avoid cluttering the console in production)

    // Disallow debugger statements (helps to avoid leaving debugging code in production)
    "no-debugger": "warn", // Warn for `debugger` statements

    // Warn when variables are defined but not used
    "no-unused-vars": "warn", // Warn about unused variables, this helps to avoid dead code

    // Disallow the use of undeclared variables
    "no-undef": "error", // Catch variables that are being used without being declared

    // Disallow function declarations that are not used
    "no-empty-function": "warn", // Prevent the use of empty functions (unless intentional)

    // Additional custom rules can go here
    "prefer-const": "warn", // Suggest using `const` for variables that are never reassigned
    eqeqeq: ["error", "always"], // Enforce the use of `===` instead of `==` for comparison
  },

  // Plugins
  plugins: ["prettier"], // Enables the Prettier plugin to run formatting rules
};
