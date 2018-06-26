const crypto = require('crypto');

class Block{
	constructor(data){
		data = data || [];
		this.index = data.index;
		this.parentHash = data.parentHash;
		this.hash = data.hash;
		this.transactions = data.transactions;
		this.coinbase = data.coinbase;
		this.nonce = data.nonce;
	}

	addTransaction(){
		//function to add transactions to block here
	}

	validateTransaction(){
		//function to validate transactions from UTXO and signature check here
	}

	SetCoinbaseTransaction(){
		//function to set the owner of generated coin here
	}

	validateBlock(){
		//function to check the validation of block here
	}

	generateHash(){
		//function to mine the block here
	}

	proofOfWork(){
		//mining of block
	}

	getCurrentIndex(){
		console.log('Block Index : ' + this.index);
	}

}
	// export default Block







// var data = {
// 	index : 5, 
// 	parentHash : '0088djfasd7fa67', 
// 	hash : '0088yhek48fj48r4tu',
// 	// transactions: {a: 1, b: 2},
// 	transactions: [ {"timestamp": "09876567", "sender":"1450632410296","receiver":"008898itr4ijt4y","amount":"76.36731", "signature": "9iuasdf897hsadf8"},
// 					{"timestamp": "09876567", "sender":"1450632410296","receiver":"008898itr4ijt4y","amount":"78.15431", "signature": "9iuasdf897hsadf8"}
// 				],
// 	coinbase: {sender: 'sikka', receiver: '0088ujta', amount: '12'},
// 	nonce: '5565'
// }
// var block = new Block(data);
// console.log(block);

module.exports = Block;