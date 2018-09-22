var level = require('level');
var logger = require('./../logger');
module.exports = dbUsers = level('./data/users', {
    valueEncoding: 'json'
}, (err) => logger.logException(err));

// module.exports = {
//     dbUsers
// };