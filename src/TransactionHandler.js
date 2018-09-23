const level = require("level");
const crypt = require('./Common/Crypt');
const utxo = require('./UTXOhandler');
const {TransactionModel, TransactionHashModel} = require('./../models/Transaction');
const remote = require('electron').remote;
// var connection = remote.getGlobal('APP_NAME');
const ConnectionBroker = require('./connection/ConnectionBroker'); 
// const {ConnectionBroker} = require('./LoginHandler');


const PRIVATE_KEY = "xx"; //replace
const FEE = 0.0;


// const db = level("././data/transactions", {valueEncoding : "json"}, (err) => {
//     if(err) console.log(err);
// });


const Response = function () {
    this.success = false;
    this.data;
    this.msg;
}


class TransactionHandler{

    constructor(){
        this.db = level("././data/transactions", {valueEncoding : "json"}, (err) => {
            if(err) console.log(err);
        });
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
            if(this.db.isClosed()) this.db.open();
            this.db.put(txn.timestamp, txn, (err)=>{
                if (err) {
                    response.msg = "Error while adding txn to verified list.";
                }else  {
                    this.BroadcastTransaction(txn);
                    response.success = true;
                }
                 this.db.close();
            });
        }else{
            response.msg =  validationResponse.msg ||  "The transaction is corrupted or invalid";
        }

        return response;
    }

    BroadcastTransaction(txn){
        let connection = new ConnectionBroker();
        connection.broadcastData(txn);
    }

    GetTransaction(key){
        return new Promise((resolve, reject) =>{
            if(this.db.isClosed()) this.db.open();
            this.db.get(key, (err, data) =>{
                if(err) reject(err);
                else resolve(data);
                this.db.close();
            });
        })
    }

    GetTransactions(){
        var txns = [];

            if(this.db.isClosed()) this.db.open();
        return new Promise((resolve,reject) => {
            var stream = this.db.createReadStream();
            stream.on('data', (data)=>{
                txns.push(data);
            })
            .on('error', (error)=> {
                this.db.close();
                reject(error);
            })
            .on('end', ()=> {
                this.db.close();
                resolve(txns);
            });
        });
    }

    DeleteTransaction(key){
        if(this.db.isClosed()) this.db.open();
        db.del(key, (err)=> {
            if(err) console.log(err);
            this.db.close();

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

// module.exports = new TransactionHandler();
module.exports = TransactionHandler;