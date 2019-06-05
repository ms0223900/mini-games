module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parser": 'babel-eslint',
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        // "linebreak-style": [
        //     "warn",
        //     "unix"
        // ],
        "quotes": [
            "warn",
            "single"
        ],
        "no-console": "off",
        "react/jsx-uses-vars": "error",
        "react/jsx-uses-react": "error",
    }
};