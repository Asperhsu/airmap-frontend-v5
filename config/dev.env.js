'use strict'

const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const env = require('./env')

module.exports = merge(prodEnv, env, {
  NODE_ENV: '"development"'
})
