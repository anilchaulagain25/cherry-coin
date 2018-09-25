const logger = require('@root/logger.js');
const level = require('level');
const Crypt = require('@common/Crypt');

const DbGlobal = require('@common/Global');
const User = require('@common/User');

const BlockModel = require("@models/Block")
const {TransactionModel, TransactionHashModel} = require('@models/Transaction');
const {Response} = require('@models/Common');

const ConnectionBroker = require('@connection/ConnectionBroker'); 
const ChainHandler = require('@src/ChainHandler');
const TransactionHandler = require('@src/TransactionHandler');
const ChainUtxoHandler = require('@src/ChainUtxoHandler');
// const UTXOHandler = require("@src/UTXOHandler.js")



class BlockHandler {

	constructor(blk){
		this.block = new BlockModel(blk);
		this.mypubkey = ""; //todo xx
		this.db = level('./data/block/', {'valueEncoding': 'json'}, (err) =>{
			if (err) {logger.log("error", err, false)}
		});
		this.blockBodyHash = "";

	};

	// get Block() {
	// 	return this.block;
	// }

	//Create the very first block 
	GenerateGenesisBlock(){
		return new Promise((resolve, reject)=>{
			new TransactionHandler()
			.GetCoinbaseTxn(this.mypubkey)
			.then((coinbaseTxn)=>{
				this.block.coinbase = coinbaseTxn;
				this.block.index = 0;
				this.block.previousHash = '';
				this.block.data = [];
				resolve(this.block);
			}).catch((error)=>{
				logger.log("error", error, "Error while generating Genesis Block");
				reject(error);
			})

		});	
	}

	//New Block Generator
	GenerateNewBlock(){
		var dbGlobal = new DbGlobal();
		var response = new Response();
		dbGlobal.getBlockIndex().then((blockIndex)=>{
			if (blockIndex === 0) {
				return GenerateGenesisBlock().then((data, error)=>{
					if (error) {
						response.msg = error;
					}else{
						this.SaveBlock();
						response.success = true;
						response.data = data;
					}
					return response;
				})
			}else{
				return Promise.all(
					[
					dbGlobal.getLatestBlockHash(),
					this.GetVerifiedTransactions(),
					new TransactionHandler().GetCoinbaseTxn(this.mypubkey)
					])
				.then((data, error) =>{
					if (error) {
						response.msg = error;
					}else{
						this.block.index = ++blockIndex;
						this.block.previousHash = data[0];
						this.block.transactions = data[1];
						this.block.coinbase = data[2];
						this.SaveBlock();
						response.success = true;
						response.data = this.block;
					}
					return response;
					
				})
				.catch((err) => {
					logger.log("error", err, "Error while generating new block");
					response.msg = err;
					return response;
				});
			}
		});
	}

	//Get List of All Verified Transactions to be inserted into new Block 
	GetVerifiedTransactions(){
		//Add Transactions
		return new TransactionHandler().GetTxnsForBlock();
	}

	//Get Merkle Hash of The Added Transactions
	GenerateMerkleRoot(){
		let crypt = new Crypt();
		let hashes = [];
		for (const txn of this.block.transactions) {
			let thash = crypt.GenerateHash(JSON.stringify(new TransactionHashModel(txn)));
			hashes.push(thash);
		}
		let merkle = crypt.GenerateHash(hashes.toString());

		return merkle;
	}

	//Generate Hash of the Block using Merkle Root, Coinbase Hash and Previous Hash
	GenerateBlockDataHash(){
		var merkle = this.GenerateMerkleRoot();
		var coinbaseHash = this.block.coinbase.hash;
		var previousHash = this.block.previousHash;

		var blockHash = new Crypt().GenerateHash([merkle,coinbaseHash,previousHash].toString());
		this.blockBodyHash = blockHash;
		return blockHash; 
	}

	//Generate Block Signature
	GenerateBlockSignature(){
		new User().getPrivateKey().then((privateKey)=>{
			var blockHash = this.GenerateBlockDataHash();
			var signature = new Crypt().GenerateSignature(blockHash, privateKey);
			this.block.signature = signature;
			return signature;
		}).catch((error)=>{
			logger.log("error", error, "Error while getting User Private Key");
		})
	}


	//Mine Block Hash
	MineBlock(){
		var dbGlobal = new DbGlobal();
		new dbGlobal().getBlockDifficulty().then((data)=>{
			var crypt = new Crypt();
			var minedHash = "";
			var hashInitials = "0".repeat(data);
			while(!minedHash.startsWith(hashInitials)){
				this.block.nonce++;
				minedHash = crypt.GenerateHash([this.blockBodyHash, this.block.nonce].toString());
				console.log(`Nonce:  ${this.block.nonce}`);
			}
			this.block.hash = minedHash;
		});
	}

	//ADD MINED BLOCK TO OWN CHAIN AND BROADCAST TO PEERS
	PublishBlock(){
		this.AcceptBlock();		
		new ConnectionBroker().broadcastData("B", "AddBlock", this.block);
		new UTXOHandler().UpdateChainUtxo();
	}

	AcceptBlock(){
		new ChainHandler().PublishToChain(this.block);
		new TransactionHandler().DeletePublishedTxns(this.block.transactions);
	}



	//Validate and Manage Input Block
	ProcessInputBlock(block){
		var dbGlobal = new DbGlobal();
		this.block = block;
		var response = new Response();
		Promise.all([
			dbGlobal.getBlockIndex(),
			dbGlobal.getLatestBlockHash(),
			dbGlobal.getCoinbaseAmount(),
			dbGlobal.getBlockDifficulty()
			]).then((data,error)=>{
				if (error) {
					logger.log("error", error, "Error while validating Block");
				}else{
					if(block.index !== ++data[0]){
						response.msg = "Warning ! - Block Index Mismatch...!!!";
						return response;
					}else if (data[1] !== block.previousHash) {
						response.msg = "Warning ! - Invalid Parent Hash...!!!";
						return response;
					}else if(data[2] !== block.coinbase.amount){
						response.msg = "Warning ! - Invalid Coinbase Amount...!!!";
						return response;
					}else if(!this.VerifyBlockHash()){
						response.msg = "Warning ! - Invalid Hash...!!!";
						return response;
					}
					var utxo = new ChainUtxoHandler(true,true);
					// utxo.AssignUtxo(true,true);
					utxo.ReplicateUtxoPool().then(()=>{
						for (let txn of this.block.transactions){
							utxo.CheckUtxo(txn.sender, txn.amount).then((data, error)=>{
								if (error) {
									response.msg = `Warning ! - ${error}...!!!`;
									return response;
								}
							})
						}
					})
				}
			}).then((data)=>{
				if (data.success) {
					this.AcceptBlock();
				}
			}).catch((error)=>{
				response.msg = `Warning ! - ${error}...!!!`;
				return response;
			});
		/*dbGlobal.getCurrentIndex().then((index)=>{
			if(block.index !== ++index){
				response.msg = "Warning ! - Block Index Mismatch...!!!";
			}else if (true) {}
		})*/

	}


	VerifyBlockHash(){
		let dataHash = this.GenerateBlockDataHash();
		let nonce = this.block.nonce;
		let hash = new Crypt().GenerateHash([dataHash,nonce].toString());
		return hash === this.block.hash;
	}


	SaveBlock(){
		if(this.db.isClosed()) this.db.open();
		this.db.put(this.block.index, this.block, (err)=> {
			if (err) {
				logger.log("error", err, "Error Occured while saving block.")
			}
			this.db.close();
		});
	};

	ValidateBlock(block){
		var block = new BlockModel(block);
		//Get Transction Validator Here
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



/* 	GetCoinBaseTransaction(){
		//Insert a new transaction into the block for reward.
		index.getValue("coinbaseReward").then((rewardAmt) =>{
			return new TransactionModel({sender: "", receiver: crypt.pubKey, amount : rewardAmt});	
		})

		// var coinbaseAmount = index.getValue("coinbaseReward") || 10;
		// this.block.coinbase = new TransactionModel({sender: "", receiver: crypt.pubKey, amount : coinbaseAmount})
	} */





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