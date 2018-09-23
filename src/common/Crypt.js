const secp256k1 = require("secp256k1");
const crypto = require("crypto");
const {TransactionModel, TransactionHashModel} = require('@models/Transaction');



const privKey = Buffer.from('TA9HtaPlG602sI9e96jMuQWA5oYy7DPnSFVop/Nr7zg=', "base64");
// const pubKey = Buffer.from('BPw+yUPGcTk1pFYrOwqWKAi79oGp6W6qgUEUpgP1mD8r18ewNPSLlNlNZkojVWtsD1F6m/kmUEwfh/TB/wmYVdg=', 'base64');

class Crypt{
    constructor(){
        this.pubKey = 'BM09qzxp0DimjPyvb1OldbOB+qtNwaIgdEx9PJZhWjLg2oXL9SLgjNJ/vF/PrAtQWY2rWAN6UL15kaBS6DWHR78=';
    }


    GenerateSignature(hash){
        let hashBuffer = Buffer.from(hash, 'base64');
        var res = secp256k1.sign(hashBuffer, privKey);

        return res.signature.toString('base64');
    }


    //Generate Signature taking in hash and private Key
    GenerateSignature(hash, privKey){
        let hashBuffer = Buffer.from(hash, 'base64');
        let privateKeyBuffer = Buffer.from(privateKey, 'base64');
        var res = secp256k1.sign(hashBuffer, privateKeyBuffer);

        return res.signature.toString('base64');
    }


    /* Input a string parameter*/
    GenerateHash(data){
        //TODO: check for valid data
        let sha = crypto.createHash("SHA256");
        let hash = sha.update(data).digest('base64');
        return hash;
    }


    //Validation Signature of Objects
    ValidateSignature(hashData, key, signature){
        console.log('going for validation');
        let hash = this.GenerateHash(JSON.stringify(hashData));
        var response = secp256k1.verify(Buffer.from(hash, 'base64'), Buffer.from(signature, 'base64'), Buffer.from(key, 'base64'));
        console.log('validate : ', response);
        return response;
    }


    //Generate Unique Private Public Key for User
    CreateKeyPair(){
        const ecdh = crypto.createECDH("secp256k1");
        ecdh.generateKeys();
        var privKey = ecdh.getPrivateKey('base64');
        var pubKey = ecdh.getPublicKey('base64');

        return {'privateKey': privKey, 'publicKey': pubKey};
    }

    //Generate Public Key from its corresponding Private Key
    GetPublicKey(privKey){
        const ecdh = crypto.createECDH("secp256k1");
        ecdh.setPrivateKey(privKey, 'base64');
        var pubKey = ecdh.getPublicKey('base64');

        return pubKey;
    }

}

module.exports = Crypt;