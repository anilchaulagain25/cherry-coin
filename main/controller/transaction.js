const Transaction = require('../models/Transaction');
const TransactionPool = require("@src/TransactionPool")

module.exports.controller = function (app) {
    app.get("/transactions", (req,res)=>{
        res.render("transaction/index");
    });

    app.get("/transactions/addNew", (req,res)=>{
        res.render("transaction/manage");
    });

    app.post("/transactions/addNew", (req,res)=>{
        var input = req.body;
        var tran = new Transaction(input);
        tran.timestamp = Date.now();
        console.log(req.body);
        console.log(tran);

        txn = new TransactionPool();
        txn.SaveTransaction(tran);
        txn.GetTransactions();

        res.render("transaction/index");
    });
}