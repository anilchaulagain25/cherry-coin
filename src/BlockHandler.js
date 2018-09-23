var logger = require('./../logger.js');
var level = require('level');
var crypt = require('./Common/Crypt');
const Block = require("./../models/Block")
const {TransactionModel, TransactionHashModel} = require('./../models/Transaction');

var TransactionHandler = require('./TransactionHandler');
// const TransactionHandler = require("@src/TransactionHandler.js")
// const UTXOHandler = require("@src/UTXOHandler.js")


var index = {
	idb : level('./data/global/', (err) =>{
		if (err) {logger.log("error", err, false)}
	}),
	setValue : function (key, value) {
		index.idb.put(key, value, (err)=>{
			if (err) {
				logger.log("error", err, false, "blockHandler", "leveldb : global");
			}
		});
	},
	getValue : function (key) {
		return new Promise((resolve, request) => {
			index.idb.get(key, (err, data) =>{
				if (err) {
					logger.log("error", err,supress = false, "blockHandler", "leveldb : global")
					reject(0);
				}
				else resolve(data);
			});
		})
	}
}


class BlockHandler {

	constructor(blk){
		this.block = new Block(blk);
		this.db = level('./data/block/', {'valueEncoding': 'json'}, (err) =>{
			if (err) {logger.log("error", err, false)}
		});

	};

	// get Block() {
	// 	return this.block;
	// }

	GenerateGenesisBlock(){
		//Not Implemented
	}

	GenerateNewBlock(){
		console.log("CB TRAN"); //xx
		// index.setValue("lastHash", 0);
		// index.setValue("blockHeight", 0);
		// index.setValue("coinbaseReward", 11);
		
		return Promise.all(
			[
			index.getValue("lastHash"), 
			index.getValue("blockHeight"), 
			this.GetVerifiedTransactions(),
			index.getValue("coinbaseReward")
			])
		.then((data) =>{
			this.block.previousHash = data[0];
			this.block.index = ++data[1];
			this.block.transactions = data[2];
			this.block.coinbase = new TransactionModel({sender: "", receiver: crypt.pubKey, amount : data[3]});
			this.SaveBlock();
			return this.block;
		})
		.catch((err) => {
			console.log(err);
			logger.log("error", err);
		});
	}

	GetVerifiedTransactions(){
		//Add Transactions
		return new TransactionHandler().GetTransactions();
	}

	GenerateMerkleRoot(){
		for (const iterator of this.block.transactions) {
			
		}
	}

/* 	GetCoinBaseTransaction(){
		//Insert a new transaction into the block for reward.
		index.getValue("coinbaseReward").then((rewardAmt) =>{
			return new TransactionModel({sender: "", receiver: crypt.pubKey, amount : rewardAmt});	
		})

		// var coinbaseAmount = index.getValue("coinbaseReward") || 10;
		// this.block.coinbase = new TransactionModel({sender: "", receiver: crypt.pubKey, amount : coinbaseAmount})
	} */

	SaveBlock(){
		if(this.db.isClosed()) this.db.open();
		this.db.put(this.block.index, this.block, (err)=> {
			if (err) {
				logger.log("error", err, false, "Error Occured while saving block.")
			}
			this.db.close();
		});
	};

	ValidateBlock(){
		//Get Transction Validator Here
	}

	GenerateHash(){
		//Generate Hash and Add it to the block data.
	}

	GenerateSignature(){

	}

	ClearMinedBlock(){
		if(this.db.isClosed()) this.db.open();
		var keystream = this.db.createKeyStream();
		keystream.on('data', function(key){
			this.db.del(key, function (err) {
				console.log('Delete Error : ' + err);
			})
		}).on("error", (err) => {
			logger.log("error", err, false, "BlockHandler", "ClearMinedBlock");
			this.db.close();
		}).on('end', ()=>{
			this.db.close();
		});
	}

	

	
	
	

	
}


module.exports = BlockHandler;

// var blkHlr = new BlockHandler();

// 	blkHlr.GenerateNewBlock().then('data', (data)=>{
// 		console.log(data);
// 	}).catch((err)=>{
// 		console.log(err);
// 	});


/* TEMP
hdlBlock = new BlockHandler();
hdlBlock.createBlock();
console.log(hdlBlock.block.getCurrentIndex());

var levelup = require('levelup');
var leveldown = require('leveldown');
var db = levelup(leveldown('./data/chain/'), {'valueEncoding': 'json'})

// db.put('1',{'db':'leveldb', 'backend':'node'}, function (err){
// 	if(err) return console.log('Oops!',err);
// })

// db.get('1', function(err,value, {sync: true}){
// 	if(err) return console.log('Oops!',err);
// 	// console.log(JSON.stringify(value));
// 	console.log('oh', value);
// })

// db.createReadStream().on('2', function(data){
// 	const buf = Buffer.from(data.value);
// 	const json = JSON.stringify(buf);
// 	console.log(json);

// 	const copy = JSON.parse(json, (key, value) =>{
// 		return value && value.type === 'Buffer' ? Buffer.from(value.data) : value;
// 	});
// 	console.log(data.key, '=', copy)
// })
// .on('error', function (err) {
//     console.log('Oh my!', err)
//   })
//   .on('close', function () {
//     console.log('Stream closed')
//   })
//   .on('end', function () {
//     console.log('Stream closed')
//   })

var stream = db.createReadStream();
stream.on('data', function(data){
  console.log(JSON.stringify(data))
})
stream.on('end', function () {
  console.log('end here')
})

// console.log(db.isOpen());
// db.close();

*/