const Block = require("../models/Block.js")
const BlockHandler = require("@src/BlockHandler.js")
const TransactionHandler = require("@src/TransactionHandler.js")
const UTXOHandler = require("@src/UTXOHandler.js")

const level = require("level");
const db = level("@data/chain", {valueEncoding : "json"}, (err) => {
    if(err) console.log(err);
});


module.exports = class BlockHandler {

	constructor(){
		//get current block from data/block here
    };
    
    CreateGenesisBlock(block){
        db.put(block.timestamp, block, function (err) {
			console.log('Save Error : ' + err);
		});
    }

    ReadBlockChain(block){
        db.createValueStream().on('data', (data)=>{
			console.log(JSON.stringify(data));
        }).on("close", (data)=>{
            //close function
        });
    }

    CheckBlockExistance(blockHash){
        db.createValueStream().on('data', (data)=>{
			return data.hash === blockHash;
        }).on("close", (data)=>{
            //close function
        }).on("error", (data)=>{
            console.log("Error Occured ", data);
        });
    }

    ValidateChain(){
        db.createValueStream().on('data', (data)=>{
            blockHlr = new BlockHandler(data);
            blockHlr.ValidateBlock();
        }).on("close", (data)=>{
            //close function
        }).on("error", (data)=>{
            console.log("Error Occured ", data);
        });
    }
}
