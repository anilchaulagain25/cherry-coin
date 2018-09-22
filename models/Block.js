const Block = function(data){
	data = data || {};
	this.index = data.index || '';
	this.previousHash = data.previousHash || '';
	this.transactions = data.transactions || '';
	this.coinbase = data.coinbase || '';
	this.hash = data.hash || '';
	this.nonce = data.nonce || '';
	this.signature = data.signature || '';
}

module.exports = Block;


