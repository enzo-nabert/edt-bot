module.exports = {
    root: true,
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true
        }
    },
    settings: {
        'import/resolver': {
            alias: {
                extensions: ['.js'],
                map: [['@', './']]
            }
        }
    },
    env: {
        browser: true,
        amd: true,
        node: true
    },
    extends: ['eslint:recommended', 'plugin:prettier/recommended'],
    plugins: ['simple-import-sort', 'import'],
    rules: {
        'prettier/prettier': ['error', {}, { usePrettierrc: true }],
        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',
        'no-unused-vars': 'off',
        'prefer-const': [
            'error',
            {
                destructuring: 'any',
                ignoreReadBeforeAssign: false
            }
        ]
    }
};
