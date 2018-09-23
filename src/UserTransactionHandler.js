const level = require("level");
const crypt = require('./Common/Crypt');
const TransactionHandler = require('./TransactionHandler');
// const {TransactionModel, TransactionHashModel} = require('././models/Transaction');
// const TransactionModel = require('././models/Transaction.js');

const PRIVATE_KEY = "xx"; //replace
const FEE = 0.0;


const db = level("././data/wallet/TransactionPool", {valueEncoding : "json"}, (err) => {
    if(err) console.log(err);
});

const TransactionModel = function(data){
    data = data || {};
    this.timestamp = data.timestamp || '';
    this.sender = data.sender || '';
    this.receiver = data.receiver || '';
    this.amount = data.amount || '';
    this.fee = data.fee || '';
    this.hash = data.hash || '';
    this.signature = this.signature || '';
}

const TransactionHashModel = function(data){
    data = data || {};
    this.timestamp = data.timestamp || '';
    this.sender = data.sender || '';
    this.receiver = data.receiver || '';
    this.amount = data.amount || '';
    this.fee = data.fee || '';
}


class UserTransactionHandler{

    constructor(){

    }

    ValidateBeforeSave(receiver, amount){
        let success = false;
        let msg;
        if (isNaN(amount)) {
            msg = "Invalid Amount";
        } else if(!receiver) {
            msg = "Invalid Receiver Address"
        } else {
            success = true;
        }

        return {success , msg};
        //UTXO
    }

    SaveTransaction(txn){
        db.put(txn.timestamp, txn, (err)=>{
            if (err) console.log("error is ", err);
        });
        console.log("Success ");
    }

    GetTransaction(key){
        return new Promise((resolve, reject) =>{
            db.get(key, (err, data) =>{
                if(err) reject(err);
                else resolve(data);
            });
        })
    }

    GetTransactions(){
        var txns = [];
        var stream = db.createReadStream();

        return new Promise((resolve,reject) => {
            stream.on('data', (data)=>{
                txns.push(data);
            })
            .on('error', ()=> reject)
            .on('end', ()=> resolve(txns));
        });
    }

    DeleteTransaction(key){
        db.del(key, (err)=> {
            if(err) console.log(err)
        });
    }


    ValidateTransaction(){
        //TODO : Validate Transaction Data Here
        // Use userUTXOPool for amount validation
        return true;
    }

    GenerateTransactionSet(txn){
        txn.sender = crypt.pubKey;
        txn.fee = FEE;
        let txnHashData = new TransactionHashModel(txn);
        console.log("Initial Hash Data");
        console.log(txnHashData);
        txn.hash = crypt.GenerateHash(JSON.stringify(txnHashData));
        txn.signature = crypt.GenerateSignature(txn.hash);
        return txn;
    }



    ApproveTransaction(txn){
        console.log("approve")
        if (crypt.ValidateSignature(txn)) {
            console.log('Verified : ', true);
            //TODO XX: PUBLISH transaction
            var response = new TransactionHandler().AddTransaction(txn);
            if (response.success) {
                this.DeleteTransaction(txn.timestamp);
            }else{
                console.error(response.msg);
            }

        }
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

module.exports = new UserTransactionHandler();