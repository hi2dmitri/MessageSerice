import globals from 'globals'
import pluginJs from '@eslint/js'
import prettier from 'eslint-plugin-prettier'
import configPrettier from 'eslint-config-prettier'

export default [
  // Basic configuration for JS files
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: globals.node, // Use Node.js globals
    },
    rules: {
      'prettier/prettier': 'error', // Prettier integration
    },
  },
  // Prettier plugin and config
  pluginJs.configs.recommended,
  {
    files: ['**/*.js'],
    plugins: {
      prettier: prettier,
    },
    rules: {
      ...configPrettier.rules, // Disable ESLint rules that conflict with Prettier
    },
  },
]
