require('module-alias/register');
const path = require('path');
const level = require("level");
const Crypt = require('@common/Crypt');
const User = require('@common/User');
const Global = require('@common/Global');

const TransactionHandler = require('@src/TransactionHandler');
const {TransactionModel, TransactionHashModel} = require('@models/Transaction');
// const TransactionModel = require('././models/Transaction.js');

const PRIVATE_KEY = "xx"; //replace
const FEE = 0.0;


const db = level(path.resolve("././data/wallet/TransactionPool"), {valueEncoding : "json"}, (err) => {
    if(err) console.log(err);
});



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
        let crypt = new Crypt();
        let gbl = new Global();
        let user = new User();
        return Promise.all([
            gbl.getTransactionFee(),
            user.getPublicKey(),
            user.getPrivateKey()
            ]).then((data)=>{
                let txn = new TransactionModel(txn);
                txn.fee = data[0];
                txn.sender = data[1];
                txn.hash = crypt.GenerateHash(JSON.stringify(new TransactionHashModel(txn)));
                txn.signature = crypt.GenerateSignature(txn.hash, data[2]);
            })
            new User().getPrivateKey().then((data)=>{
                txn.signature = crypt.GenerateSignature(txn.hash, data);
                return txn;
            });
        }



        ApproveTransaction(txn){
            let crypt = new Crypt();

            var htx = new TransactionHashModel(txn);
            if (crypt.ValidateSignature(htx, txn.sender, txn.signature)) {
                console.log('Verified : ', true);
            //TODO XX: PUBLISH transaction
            var response = new TransactionHandler().AddTransaction(txn);
            console.log('Save Response : ',  JSON.stringify(response));
            if (response.success) {
                this.DeleteTransaction(txn.timestamp);
            }else{
                console.error(response.msg);
            }

        }
        //Generate Transction Hash, Signature using Sender Private Key
        //Add User Transaction to Pending Transaction List
    }

}

module.exports = new UserTransactionHandler();