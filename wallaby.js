'use strict';
var path = require('path');
var wallabyWebpack = require('wallaby-webpack');
var webpackPostprocessor = wallabyWebpack({
    module: {
        loaders: [{ test: /\.json$/, loader: 'json' }]
    }
});

module.exports = function (wallaby) {

    return {
        files: [
            { pattern: 'node_modules/chai/chai.js', instrument: false },
            { pattern: 'node_modules/chai-spies/chai-spies.js', instrument: false },
            { pattern: 'node_modules/sinon/pkg/sinon.js', instrument: false },

            { pattern: 'markup/static/js/main.js', load: false },
            { pattern: 'markup/components/**/*.js', load: false },
            { pattern: 'markup/helpers/**/*.js', load: false }
        ],

        tests: [
            { pattern: 'test/**/*Spec.js', load: false }
        ],

        compilers: {
            '**/*.js': wallaby.compilers.babel()
        },

        postprocessor: webpackPostprocessor,

        testFramework: 'mocha',

        setup: function () {
            window.__moduleBundler.loadTests();
            window.expect = chai.expect;
        },

        debug: true
    };

};
