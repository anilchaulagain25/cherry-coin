const logger = require('@root/logger.js');
const level = require("level");
const crypt = require('@common/Crypt');
const Globaldb = require('@common/Global'); 
const UTXOhandler = require('./UTXOhandler');
const {TransactionModel, TransactionHashModel} = require('@models/Transaction');
// const {PacketModel} = require('@models/Network');
const {Remote} = require('@models/Common');
const remote = require('electron').remote;
const ConnectionBroker = require('@connection/ConnectionBroker'); 


const PRIVATE_KEY = "xx"; //replace
const FEE = 0.0;



class TransactionHandler{

    constructor(){
        this.db = level("././data/transactions", {valueEncoding : "json"}, (err) => {
            if(err) console.log(err);
        });
    }

    SaveTransaction(txn){
        let response = new Response();
        if(this.db.isClosed()) this.db.open();
        this.db.put(txn.hash, txn, (err)=>{
            if (err) {
                response.msg = "Error while adding txn to verified list.";
                logger.log("error", err, response.msg, "TransactionHandler >> SaveTransaction");
            }else  {
                response.success = true;
            }
            this.db.close();
        });
        return response;
    }


    ValidateTransaction(tx){
        var response = new Response;
        var htx = new TransactionHashModel(tx);
        let isValid = crypt.ValidateSignature(htx, tx.sender, tx.signature);
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

    //Approve Transaction
    AddTransaction(txn){
        var response = new Response;
        var validationResponse = this.ValidateTransaction(txn);
        console.log(validationResponse);
        if (validationResponse.success) {
            if(this.db.isClosed()) this.db.open();
            this.db.put(txn.hash, txn, (err)=>{
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

    //Send Approved Transaction to All Peers
    BroadcastTransaction(txn){
        new ConnectionBroker().broadcastData("T", "AddTransaction", txn);
    }

    //Get A transaction using timestamp key
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

    //Get All Verified Transactions
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

    //Get Verified Transactions for Block Creation ; Returns Promise
    GetTxnsForBlock(){
        var txns = [];
        return new Promise((resolve, reject)=>{
            if(this.db.isClosed()) this.db.open();
            let stream = this.db.createValueStream();
            stream.on('data', (txn)=>{
                txns.push(txn);
            });
            stream.on('error', (err)=>{
                this.db.close();
                logger.log("err", err, "Error while streaming txn for Block");
                reject(err);
            });
            stream.on('end', ()=>{
                this.db.close();
                resolve(txns);
            });
        });
    }

    //Get Coinbase Transaction for Block Creation ; Returns Promise
    GetCoinbaseTxn(address){

        return new Promise((resolve, reject)=>{
            var crypt = new Crypt();
            var gbl = new Globaldb();
            var txn = new TransactionModel();
            txn.timestamp = Date.now();
            txn.sender = "Sikka";
            txn.receiver = address;
            gbl.getCoinbaseAmount().then((amt)=>{
                txn.amount = amt;
                var htx = new TransactionHashModel(txn);
                return crypt.GenerateHash(JSON.stringify(htx));
            }).then((hash)=>{
                txn.hash = hash;
                resolve(txn);
            }).catch((error)=>{
                logger.log("error", error, "Error generatin Coinbase txn", "TransactionHandler >> GetCoinbaseTxn");
                reject(error);
            });
        });
    }

    DeleteTransaction(key){
        if(this.db.isClosed()) this.db.open();
        this.db.del(key, (err)=> {
            if(err) console.log(err);
            this.db.close();

        });
    }

    // PROCESS PEER TRANSACTIONS AND SAVE TO DATABASE
    ProcessPeerTxn(txn){
        var response = new Response();
        if (!txn.receiver || !txn.sender) {
            response.msg = "Invalid Receiver/Sender Address";
            return response;
        } else if(isNaN(txn.amount) || txn.amount <= 0){
            response.msg = "Invalid Amount";
            return response;
        }
        var utxo = new UTXOhandler();
        var htx = new TransactionHashModel(txn);
        if (crypt.ValidateSignature(htx, txn.sender, txn.signature)) {
            return utxo.GetUTXO(txn.sender).then((balance)=>{
                if (balance >= txn.amount) {
                    var resp = this.SaveTransaction(txn);
                    if (resp.success) {
                        response.success = true;
                    }else{
                        response.msg = resp.msg;
                        return response;
                    }
                }else{
                    response.msg = "Insufficient Amount";
                    return response;
                }
            });
        }else{
            response.msg = "The transaction has invalid signature.";
            return response;
        }
    }


    //DELETE PUBLISHED TXNS
    //TO BE USED AFTER SUCCESSFUL BLOCK CREATION
    DeletePublishedTxns(txnList){
        if (this.db.isClosed()) this.db.open();
        let readStream = db.createKeyStream();
        readStream.on('data', (data) =>{
            if (txnList.some(x=> x.hash == data)) {
                db.del(data, (err)=>{
                    if (err) {
                        logger.log("error", err, "Error while deleting published transactions");
                    }
                });
            }
        });
        readStream.on('error', (error)=>{
            this.db.close();
            logger.log("error", err, "Error while deleting published transactions");
        });
        readStream.on('end', (error)=>{
            this.db.close();
            logger.log("error", err, "Error while deleting published transactions"); 
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