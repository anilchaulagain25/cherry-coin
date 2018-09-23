const logger = require('@root/logger.js');
const level = require('level');
const rimraf = require('rimraf');

class ChainUtxoHandler{
	constructor(){
		this.sdb = "";
		this.ddb = "";
	}

	ChainPool(){
		return level("./../data/utxoPool", {valueEncoding : "json"}, (err) => {
			if(err) {
				logger.log("error", err, "Error while opening chain utxoPool");
			};
		});
	}

	WalletPool(){
		return level("./../data/wallet/utxoPool", {valueEncoding : "json"}, (err) => {
			if(err) {
				logger.log("error", err, "Error while opening wallet utxoPool");
			};
		});	
	}

	AssignUtxo(chainPool, walletPool){
		if (chainPool) {
			this.sdb = this.ChainPool();
		}
		if (walletPool) {
			this.ddb = this.WalletPool();
		}
	}


	CleanUtxo(){
		rimraf('./../data/wallet/utxoPool', (data)=>{
			console.log(data);
			console.log("utxoPool clean complete");
			logger.log('info', data, "utxoPool clean complete");
		})
	};


	//Returns a promise
	ReplicateUtxoPool(){
		return new Promise((resolve, reject) =>{

			let reader = this.sdb.createReadStream();
			reader.on('data', (data) =>{
				this.ddb.put(data.key, data.data, (error)=>{
					if (err) {
						logger.log("error", err, "Error while replicating utxoPool");
						this.db.close();
						reject(false);
					}
				});
			});
			reader.on('end', ()=>{
				this.db.close();
				resolve(true);
			})
			reader.on('error', (error)=>{
				if (error) {
					logger.log("error", error, "Error while replicating utxoPool");
					this.db.close();
					reject(false);
				}
			});
		})
	}

	CheckUtxo(key, amount){
		return new Promise((resolve, reject)=>{
			if (this.ddb.isClosed()) {this.ddb.open();}
			this.ddb.get(key).then((balance)=>{
				if (balance >= data) {
					var remain = balance - data;
					this.ddb.put(key, remain).then((data)=>{
						resolve(true);
					}).catch((error)=>{
						logger.log(error.type, error, "Error while updating Utxo");
						this.ddb.close();		
					});
				}else{
					reject(false);
				}
				this.ddb.close();
			}).catch((error)=>{
				logger.log(error.type, error, "Error while checking Utxo");
				this.ddb.close();
				reject(false);
			});
		});
	}

	UpdateChainUtxo(){

	}




}


module.exports = ChainUtxoHandler;