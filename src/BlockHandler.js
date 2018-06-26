var Block = require("../models/Block.js")
var levelup = require("level");

var db = levelup("../data/block", {valueEncoding : 'json'});



class BlockHandler {

	constructor(){
		//get current block from data/block here
	};

	createBlock(){
		this.block = new Block();
		this.block.index = 0; //get index++ from latest block using Blockchain class
		this.block.parentHash = '000'; //get from blockchain class
		this.block.transactions ; //get validated transactions from transactin pool
		// ...
	};

	saveBlock(){
		db.put(this.index, this.block, function (err) {
			console.log('Save Error : ' + err);
		});
	};

	clearMinedBlock(){
		var keystream = db.createKeyStream();
		keystream.on('data', function(key){
			db.del(key, function (err) {
				console.log('Delete Error : ' + err);
			})
		});
	}
}

hdlBlock = new BlockHandler();
hdlBlock.createBlock();
console.log(hdlBlock.block.getCurrentIndex());
