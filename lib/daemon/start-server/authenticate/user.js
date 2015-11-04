var async = require('async')
var Boom = require('boom')
var operations = require('../../../operations')

module.exports = function authenticateUser (name, fingerprint, callback) {
  async.waterfall([
    operations.findUserFingerprint.bind(null, name),
    function (userFingerprint, next) {
      if (userFingerprint !== fingerprint) {
        return next(Boom.unauthorized('Invalid certificate', 'certificate'))
      }

      operations.findUserDetails(null, name, next)
    },
    function (user, next) {
      var error

      if (user) {
        user.scope = ['user']

        if (user.name === 'root') {
          user.scope.push('admin')
        }
      } else {
        error = Boom.unauthorized('No process found', 'cerficiate')
      }

      next(error, user)
    }
  ], callback)
}