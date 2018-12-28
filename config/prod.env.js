const merge = require('webpack-merge')
let prodDev = {};

try {
  prodDev = require('./env.prod');
} catch (ex) {}

module.exports = merge(prodDev, {
  NODE_ENV: '"production"'
})