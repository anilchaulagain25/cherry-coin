const level = require("level");

const PRIVATE_KEY = "xx"; --replace


const db = level("././data/wallet/TransactionPool", {valueEncoding : "json"}, (err) => {
    if(err) console.log(err);
});

const txn = {
    "sender" : "abc",
    "receiver" : "xyz",
    "amount" : "100",
    "timestamp": "85207419630",
    "signature" : "g89jkdfoghj678hj"
};


module.exports = class TransactionHandler{

    constructor(){

    }

    SaveTransaction(tran){
        db.put(tran.timestamp, tran, (err)=>{
            if (err) console.log("error is ", err);
        });
        console.log("Success ");
    }

    GetTransaction(key){
        db.get(key, (err, data) =>{
            if(err) 
            console.log(data);
        });
    }

    GetTransactions(){
        var transactions = [];
        db.createReadStream().on("data", (data) => {
            console.log(data);
            transactions.push(data);
        }).on("error", (err)=>{ console.log(err); 
        }).on("close", (data) => { console.log(data) 
        });
            return transactions;
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
