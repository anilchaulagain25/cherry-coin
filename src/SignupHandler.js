var crypto = require('crypto');
var Signup = require('./../models/Signup');
var db = require('./db');

// var level = require('level');
// var logger = require('./../logger');
// const db = level('././data/users', {
//     valueEncoding: 'json'
// }, (err) => logger.logException(err));



class SignupHandler {
    constructor(username, pwd, EVENT) {

        var ecdh = crypto.createECDH("secp256k1");
        ecdh.generateKeys();
        var publicKey = ecdh.getPublicKey().toString('base64');
        var privateKey = ecdh.getPublicKey().toString('base64');
        var approvedBalance = 0;
        var unapprovedBalance = 0;
        username = username || '';
        pwd = pwd || '';
        
        var md5sum = crypto.createHash('md5');
        md5sum.update(pwd);
        pwd = md5sum.digest('base64');
        var signupModel = new Signup(publicKey, privateKey, unapprovedBalance, approvedBalance, username, pwd);
        
        console.log(signupModel);
        db.get(signupModel.username, (err, data) =>{
            if (err) {
                if (err.type === "ReadError") {
                    EVENT.sender.send('signup-response', JSON.stringify({
                        success: false,
                        msg: 'unable to create account'
                    }));
                    return;

                }
                db.put(signupModel.username, signupModel, (err) => {
                    if (err) {
                        EVENT.sender.send('signup-response', JSON.stringify({
                            success: false,
                            msg: 'unable to create account'
                        }));
                        return;
                    }
                    EVENT.sender.send('signup-response', JSON.stringify({
                        success: true,
                        msg: 'account successfully created',
                        data: {
                            privateKey: privateKey
                        }
                    }));
                    return;

                });
            }
            if (data) {
                EVENT.sender.send('signup-response', JSON.stringify({
                    success: false,
                    msg: 'username already exists'
                }));
                return;
            }
        });

        

    }
}
module.exports = SignupHandler;