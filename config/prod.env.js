const merge = require('webpack-merge')
const env = require('./env')
let prodDev = {};

try {
  prodDev = require('./env.prod');
} catch (ex) {}

module.exports = merge(env, prodDev, {
  NODE_ENV: '"production"'
})