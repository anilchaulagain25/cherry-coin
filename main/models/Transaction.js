class Transaction{
	constructor(data){
		data = data || {};
		this.timestamp 	= data.timestamp /*|| create new timestamp*/ ;
		this.sender		= data.sender ;
		this.receiver	= data.receiver;
		this.amount		= data.amount;
		this.hash
		this.signature
	}

	validateTransaction(){
		/*check for sender records in UTXO Pool
		and validate the amount of Transaction*/
	}

	generateHash(){
		//create SHA-256 key for transaction
	}

	generateSignature(senderPKey){
		/*
			generate signature of transaction taking senderPrivateKey as input
		*/
	}

	verifySignature(){
		/*
			verify Transaction;
			return true || false;
		*/
	}

}

module.exports = Transaction;
