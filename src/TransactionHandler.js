const level = require("level");
const crypt = require('./Common/Crypt');
const utxo = require('./UTXOhandler');
const {TransactionModel, TransactionHashModel} = require('./../models/Transaction');

const PRIVATE_KEY = "xx"; //replace
const FEE = 0.0;


const db = level("././data/transactions", {valueEncoding : "json"}, (err) => {
    if(err) console.log(err);
});


const Response = function () {
    this.success = false;
    this.data;
    this.msg;
}


class TransactionHandler{

    constructor(){

    }


    ValidateTransaction(tx){
        var response = new Response;
        let isValid = crypt.ValidateSignature(tx);
        let msg = "";
        if (!tx.receiver) {
            response.msg = "Invalid Receiver Address";
        }
        else if (!isValid) {
            response.msg = "The Transaction has invalid signature."
        }
        // let utxoResponse = utxo.CheckAvailableOutputSikka(tx.sender, tx.amount);
        // utxo.GetUTXO(tx.sender).then((blnc) =>{
        //     if(blnc < tx.amount){
        //         response.msg = "Insufficient Balance";
        //     }else{
        //         response.success = true;
        //     }
        //     return response;    
        // }).catch((err)=> alert(err));
        else{ //TODO : XX
            response.success = true;
        }
        return response;    
    }


    AddTransaction(txn){
        var response = new Response;
        var validationResponse = this.ValidateTransaction(txn);
        console.log(validationResponse);
        if (validationResponse.success) {
            db.put(txn.timestamp, txn, (err)=>{
                if (err) response.msg = "Error while adding txn to verified list.";
            });
            response.success = true;
        }else{
            response.msg =  validationResponse.msg ||  "The transaction is corrupted or invalid";
        }

        return response;
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

    // CheckAvailableOutputSikka(key, amount){
    //     var response = new Response;
    //     utxo.GetUTXO(key).then((blnc) => {
    //         if (blnc > amount) {
    //             response.success = true;
    //         }else{
    //             response.msg = "Insufficient Source Sikka(s)";
    //         }
    //         return response;
    //     }).catch((err) => {
    //         console.error(err);
    //         response.msg = err;
    //         return response;
    //     });
    // }



}

module.exports = new TransactionHandler();