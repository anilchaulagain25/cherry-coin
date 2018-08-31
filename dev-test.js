const Block = require("./models/Block");

var txn_data = [{
    timestamp: "20180202" /*|| create new timestamp*/,
    sender: '53n93r',
    receiver: 'r3c31v3r',
    amount: 100,
    hash: "h45h",
    signature: '518n47ur3'
},
{
    timestamp: "20180203" /*|| create new timestamp*/,
    sender: '53n93r',
    receiver: 'r3c31v3r',
    amount: 100,
    hash: "h45h",
    signature: '518n47ur3'
}];
var blk_data = {
    index: '1',
    parentHash: '4a7h3rh45h',
    hash: 'h45h',
    transactions: txn_data,
    coinbase: 'w4ll37',
    nonce: 0,
};

var block = new Block(blk_data);
console.log(block);