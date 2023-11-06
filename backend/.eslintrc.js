module.exports = {
    ignorePatterns: ['src/database/datasource.ts'],
    plugins: ['@typescript-eslint', 'prettier', 'jest'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'plugin:jest/recommended',
    ],
    env: {
        node: true,
    },
    rules: {
        'prettier/prettier': [
            'error',
            { semi: false, singleQuote: true, tabWidth: 4, trailingComma: 'es5', printWidth: 100 },
        ],
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-unused-vars': [
            'error',
            {
                argsIgnorePattern: '^_',
            },
        ],
        'jest/prefer-lowercase-title': [
            'error',
            {
                ignore: ['describe'],
            },
        ],
        'jest/expect-expect': [
            'error',
            {
                'assertFunctionNames': ['expect', 'request.**.expect'],
                'additionalTestBlockFunctions': []
            }
        ],
        'no-restricted-imports': [
            'error',
            {
                patterns: ['./*', '../*'],
            },
        ],
        'object-shorthand': ['error', 'always'],
    },
    overrides: [],
}
