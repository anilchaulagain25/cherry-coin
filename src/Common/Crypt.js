const secp256k1 = require("secp256k1");
const crypto = require("crypto");
const {TransactionModel, TransactionHashModel} = require('./../../models/Transaction');
const ecdh = crypto.createECDH("secp256k1");

// ecdh.generateKeys();
// ecdh.getPrivateKey();
// ecdh.getPublicKey();

// const TransactionModel = function(data){
//     data = data || {};
//     this.timestamp = data.timestamp || '';
//     this.sender = data.sender || '';
//     this.receiver = data.receiver || '';
//     this.amount = data.amount || '';
//     this.fee = data.fee || '';
//     this.hash = data.hash || '';
//     this.signature = this.signature || '';
// }

// const TransactionHashModel = function(data){
//     data = data || {};
//     this.timestamp = data.timestamp || '';
//     this.sender = data.sender || '';
//     this.receiver = data.receiver || '';
//     this.amount = data.amount || '';
//     this.fee = data.fee || '';
// }

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

    /* Input a string parameter*/
    GenerateHash(data){
        //TODO: check for valid data
        var sha = crypto.createHash("SHA256");
        var hash = sha.update(data).digest('base64');
        return hash;
    }
    //For Transaction Level Only
    ValidateSignature(txn){
        console.log('going for validation');
        console.log(txn);
        let txnHashData = new TransactionHashModel(txn);
        console.log("validate hash data");
        let hash = this.GenerateHash(JSON.stringify(txnHashData));
        var response = secp256k1.verify(Buffer.from(hash, 'base64'), Buffer.from(txn.signature, 'base64'), Buffer.from(txn.sender, 'base64'));
        console.log('validate : ', response);
        return response;
    }
}

module.exports = new Crypt();