module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true }
  },
  plugins: ['@typescript-eslint', 'boundaries'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  settings: {
    'boundaries/elements': [
      { type: 'core-domain', pattern: 'src/core/domain/**' },
      { type: 'core-usecases', pattern: 'src/core/use-cases/**' },
      { type: 'core-infrastructure', pattern: 'src/core/infrastructure/**' },
      { type: 'core-di', pattern: 'src/core/di/**' },
      { type: 'core', pattern: 'src/core/**' },
      { type: 'presentation', pattern: 'src/presentation/**' },
      { type: 'routes', pattern: 'src/routes/**' }
    ]
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    'boundaries/dependencies': [
      'error',
      {
        default: 'allow',
        policies: [
          { from: { element: { type: 'core-domain' } }, disallow: { to: { element: { types: { anyOf: ['core-usecases', 'core-infrastructure', 'core-di', 'presentation', 'routes'] } } } } },
          { from: { element: { type: 'core-usecases' } }, disallow: { to: { element: { types: { anyOf: ['core-infrastructure', 'core-di', 'presentation', 'routes'] } } } } },
          { from: { element: { type: 'core-infrastructure' } }, disallow: { to: { element: { types: { anyOf: ['core-di', 'presentation', 'routes'] } } } } },
          { from: { element: { type: 'presentation' } }, disallow: { to: { element: { type: 'core-infrastructure' } } } },
          { from: { element: { type: 'routes' } }, disallow: { to: { element: { type: 'core-infrastructure' } } } }
        ]
      }
    ]
  }
};