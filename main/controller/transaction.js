const Transaction = require('../models/Transaction');
// const TransactionPool = require("@src/TransactionPool");
const TransactionHandler = require("@src/TransactionHandler");

module.exports.controller = function (app) {
    txnHlr = new TransactionHandler();

    app.get("/Transaction", (req,res)=>{
        var transactions = txnHlr.GetTransactions();
        console.log(transactions);
        res.render("Transaction/index", {transactions});
    });

    app.get("/Transaction/manage", (req,res)=>{
        
        txnHlr.GetTransaction('1');
        
        res.render("Transaction/manage");
    });
    
    app.post("/Transaction/manage", (req,res)=>{
        var input = req.body;
        var tran = new Transaction(input);
        tran.timestamp = Date.now();
        console.log(req.body);
        console.log(tran);
        // txnHlr.SaveTransaction();

        res.render("Transaction/index");
    });
}