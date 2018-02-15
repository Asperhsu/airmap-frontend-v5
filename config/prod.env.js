const merge = require('webpack-merge')
const env = require('./env')

module.exports = merge(env, {
  NODE_ENV: '"production"'
})