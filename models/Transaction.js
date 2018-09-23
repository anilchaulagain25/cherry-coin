const TransactionModel = function(data){
	data = data || {};
	this.timestamp = data.timestamp || '';
	this.sender = data.sender || '';
	this.receiver = data.receiver || '';
	this.amount = data.amount || '';
	this.fee = data.fee || '0';
	this.hash = data.hash || '';
	this.signature = this.signature || '';
}

const TransactionHashModel = function(data){
	data = data || {};
	this.timestamp = data.timestamp || '';
	this.sender = data.sender || '';
	this.receiver = data.receiver || '';
	this.amount = data.amount || '';
	this.fee = data.fee || '0';
}


// module.exports = new TransactionModel();

module.exports = {TransactionModel, TransactionHashModel};