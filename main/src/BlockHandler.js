var Block = require("../models/Block.js")
// var levelup = require("level");
var levelup = require('levelup');
var leveldown = require('leveldown');
var db = levelup(leveldown('./data/block/'), {'valueEncoding': 'json'})
// var db = levelup("../data/block", {valueEncoding : 'json'});



module.exports = class BlockHandler {

	constructor(){
		//get current block from data/block here
	};

	createBlock(blk){
		this.block = new Block(blk);
		this.block.index = 0; //get index++ from latest block using Blockchain class
		this.block.parentHash = '000'; //get from blockchain class
		this.block.transactions ; //get validated transactions from transactin pool
		// ...
	};

	saveBlock(){
		db.put(this.block.index, this.block, function (err) {
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

	GenerateHash(){
		//Generate Hash and Add it to the block data.
	}

	GetLeafBlock(){
		//Get Last Block Here
	}

	GetBlocks(){
        var txns = [];
        db.createReadStream().on('data', (data)=>{
			txns.push(data);
			console.log(JSON.stringify(data));
            console.log('key: ', data.key.toString());
            console.log('value: ', JSON.stringify(data.value));
        });
        return txns;
	}

	get Block() {
		return this.block;
	}
	
	SetCoinBaseTransaction(){
		//Insert a new transaction into the block for reward.
	}

	ValidateBlock(){
		//Get Transction Validator Here
	}
}

/* TEMP
// hdlBlock = new BlockHandler();
// hdlBlock.createBlock();
// console.log(hdlBlock.block.getCurrentIndex());

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