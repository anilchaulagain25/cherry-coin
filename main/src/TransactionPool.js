var Block = require("../models/Block.js")
var Transaction = require("../models/Transaction.js");
var levelup = require("level");
var db = levelup("@data/wallet/userTransactionPool", {valueEncoding : 'json'});

module.exports = class TransactionPool{
    constructor(){
        //constructor
    };

    SaveTransaction(tran){
        db.open();
        db.put(tran.timestamp, tran, (err) => {
			console.log('Save Error : ' + err);
            db.close();
        });
    }

    GetTransactions(){
        var txns = [];
        db.createReadStream().on('data', (data)=>{
            txns.push(data);
            console.log('key: ', data.key);
            console.log('value: ', data.value);
        });
        return txns;
    }

    ValidateTransaction(){
        this.CheckSignature();
        //TODO : Validate Transaction Data Here
        // Use userUTXOPool for amount validation
    }

    ApproveTransaction(){
        this.GenerateSignature();
        //Generate Transction Hash, Signature using Sender Private Key
        //Add User Transaction to Pending Transaction List
    }

    PublishTransaction(){
        //Send transactions to all peers
    }

    GenerateSignature(){

    }

    CheckSignature(){

    }
}