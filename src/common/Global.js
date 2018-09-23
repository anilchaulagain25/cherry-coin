const logger = require('@root/logger.js');
const level = require("level");


class dbGlobal{
	constructor(){
		this.db = level('./data/global/', (err) =>{
			if (err) {logger.log("error", err, "Global DB connection error");}
		});
	}

	setValue(key,value){
		if(this.db.isClosed()) this.db.open();
		this.db.put(key, value, (err)=>{
			if (err) {
				logger.log("error", err, "Globaldb get value error")
			}
			this.db.close();
		});
	}

	getValue(key){
		return new Promise((resolve, request) => {
			if(this.db.isClosed()) this.db.open();
			this.db.get(key, (err, data) =>{
				if (err) {
					this.db.close();
					logger.log("error", err, "Globaldb get value error")
					reject(err);
				}
				else {
					this.db.close();
					resolve(data);
				}
			});
		})
	}

/*=========== GETTERS ======================== */


	getCoinbaseAmount(){
		return new Promise((resolve, request) => {
			if(this.db.isClosed()) this.db.open();
			this.db.get("coinbase", (err, data) =>{
				if (err) {
					this.db.close();
					if (err.type === "NotFoundError") {
						this.setCoinbaseAmount(0);
						return this.getCoinbaseAmount();
					}
					logger.log("error", err, "Globaldb >> getCoinbaseAmount")
					reject(0);
				}
				else {
					this.db.close();
					resolve(data);
				}
			});
		});
	};

	getBlockIndex(){
		return new Promise((resolve, request) => {
			if(this.db.isClosed()) this.db.open();
			this.db.get("blockIndex", (err, data) =>{
				if (err) {
					this.db.close();
					if (err.type === "NotFoundError") {
						this.setBlockIndex(0);
						return this.getBlockIndex();
					}
					logger.log("error", err, "Globaldb >> getBlockIndex")
					reject(0);
				}
				else {
					this.db.close();
					resolve(data);
				}
			});
		})
	}

	getLatestBlockHash(){
		return new Promise((resolve, request) => {
			if(this.db.isClosed()) this.db.open();
			this.db.get("blockHash", (err, data) =>{
				if (err) {
					this.db.close();
					if (err.type === "NotFoundError") {
						this.setLatestBlockHash("");
						return this.getLatestBlockHash();
					}
					logger.log("error", err, "Globaldb >> getLatestBlockHash")
					reject(0);
				}
				else {
					this.db.close();
					resolve(data);
				}
			});
		})
	}

	getBlockDifficulty(){
		return new Promise((resolve, request) => {
			if(this.db.isClosed()) this.db.open();
			this.db.get("blockDifficulty", (err, data) =>{
				if (err) {
					this.db.close();
					if (err.type === "NotFoundError") {
						this.setblockDifficulty(5);
						return this.getLatestBlockHash();
					}
					logger.log("error", err, "Globaldb >> getBlockDifficulty")
					reject(0);
				}
				else {
					this.db.close();
					resolve(data);
				}
			});
		})
	}




/*=========== SETTERS ======================== */

	setCoinbaseAmount(value){
		if(this.db.isClosed()) this.db.open();
		this.db.put("coinbase", value, (err)=>{
			if (err) {
				logger.log("error", err, "Globaldb set Coinbase error");
			}
			this.db.close();
		});
	}

	setBlockIndex(value){
		if(this.db.isClosed()) this.db.open();
		this.db.put("blockIndex", value, (err)=>{
			if (err) {
				logger.log("error", err, "Globaldb set Block Index error");
			}
			this.db.close();
		});
	}

	setLatestBlockHash(value){
		if(this.db.isClosed()) this.db.open();
		this.db.put("blockHash", value, (err)=>{
			if (err) {
				logger.log("error", err, "Globaldb  setLatestBlockHashx error");
			}
			this.db.close();
		});
	}

	setBlockDifficulty(value){
		if(this.db.isClosed()) this.db.open();
		this.db.put("blockDifficulty", value, (err)=>{
			if (err) {
				logger.log("error", err, "Globaldb  getBlockDifficulty error");
			}
			this.db.close();
		});
	}


}


module.exports = dbGlobal