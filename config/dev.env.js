'use strict'

const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
let envDev = {};

try {
  envDev = require('./env.dev');
} catch (ex) {}

module.exports = merge(prodEnv, envDev, {
  NODE_ENV: '"development"'
})
