import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default tseslint.config(
  {
    ignores: ['**/node_modules/**', '**/.next/**', '**/dist/**', '**/.turbo/**', '**/coverage/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      'react/jsx-sort-props': ['warn', { callbacksLast: true, shorthandFirst: true }],
    },
  },
  {
    files: ['**/app/**/page.tsx', '**/app/**/layout.tsx', '**/app/**/loading.tsx', '**/app/**/error.tsx', '**/app/**/not-found.tsx', '**/*.config.*'],
    rules: {
      'import/no-default-export': 'off',
    },
  },
);
