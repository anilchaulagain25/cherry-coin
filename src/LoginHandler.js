var crypto = require('crypto');
var dbUsers = require('./db');

// var level = require('level');
// var logger = require('./../logger');
// const dbUsers = level('././data/users', {
//     valueEncoding: 'json'
// }, (err) => logger.logException(err));

class LoginHandler {
    constructor(username, pwd, EVENT) {

        username = username || '';
        pwd = pwd || '';

        var md5sum = crypto.createHash('md5');
        md5sum.update(pwd);
        pwd = md5sum.digest('base64');

        dbUsers.get(username, (err, data) => {
            if (err) {
                if (err.type === "ReadError") {
                    EVENT.sender.send('login-response', JSON.stringify({
                        success: false,
                        msg: 'login failed'
                    }));
                    return;
                }
                EVENT.sender.send('login-response', JSON.stringify({
                    success: false,
                    msg: 'incorrect username'
                }));
                return;
            }
            if (data.pwd !== pwd) {
                EVENT.sender.send('login-response', JSON.stringify({
                    success: false,
                    msg: 'incorrect password'
                }));
                return;
            } else {
                EVENT.sender.send('login-response', JSON.stringify({
                    success: true,
                    msg: 'successfully logged in',
                    msg: {
                        data: data
                    }
                }));
                return;
            }
        });

    }
}
module.exports = LoginHandler;