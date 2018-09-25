const logger = require('@root/logger.js');
const level = require("level");
const Crypt = require('@common/Crypt');


class User{
	constructor(){
		this.db = level('./data/wallet/user', (err) =>{
			if (err) {logger.log("error", err, "User DB connection error");}
		});
	}

	setValue(key,value){
		if(this.db.isClosed()) this.db.open();
		this.db.put(key, value, (err)=>{
			if (err) {
				logger.log("error", err, "Userdb set value error");
			}
			this.db.close();
		});
	}

	getValue(key){
		return new Promise((resolve, reject) => {
			if(this.db.isClosed()) this.db.open();
			this.db.get(key, (err, data) =>{
				if (err) {
					this.db.close();
					logger.log("error", err, "Userdb get value error")
					reject(err);
				}
				else {
					this.db.close();
					resolve(data);
				}
			});
		})
	}

	getAllValues(){
		return new Promise((resolve, reject)=>{
  			console.log("Starting Promise");
			var list = [];
			if(this.db.isClosed()) this.db.open();
			let stream = this.db.createReadStream();
  			console.log("Starting stream");
			stream.on('data', (data)=>{
  			console.log(data);
				list.push(data);
			});
			stream.on('end', (data)=>{
  			console.log(list);
				this.db.close();
				resolve(list);
			});
			stream.on('error', (data)=>{
				logger.log("error", err, "User getAllValues")
				this.db.close();
				reject(data);
			});
		})
	}

	getPrivateKey(){
		return new Promise((resolve, reject) => {
			if(this.db.isClosed()) this.db.open();
			this.db.get("privateKey", (err, data) =>{
				if (err) {
					this.db.close();
					logger.log("error", err, "Userdb >> getPrivateKey")
					reject(0);
				}
				else {
					this.db.close();
					resolve(data);
				}
			});
		});
	};

	getPublicKey(){
		return new Promise((resolve, reject) => {
			if(this.db.isClosed()) this.db.open();
			this.db.get("publicKey", (err, data) =>{
				if (err) {
					this.db.close();
					logger.log("error", err, "Userdb >> getPublicKey")
					reject(0);
				}
				else {
					this.db.close();
					resolve(data);
				}
			});
		});
	};

	getUsername(){
		return new Promise((resolve, reject) => {
			if(this.db.isClosed()) this.db.open();
			this.db.get("username", (err, data) =>{
				if (err) {
					this.db.close();
					logger.log("error", err, "Userdb >> getUsername")
					reject(0);
				}
				else {
					this.db.close();
					resolve(data);
				}
			});
		});
	};

	getBalance(){
		return new Promise((resolve, reject) => {
			if(this.db.isClosed()) this.db.open();
			this.db.get("balance", (err, data) =>{
				if (err) {
					this.db.close();
					if (err.type === "NotFoundError") {
						this.setBalance(0);
						return this.getBalance();
					}
					logger.log("error", err, "Userdb >> getBalance");
					reject(0);
				}
				else {
					this.db.close();
					resolve(data);
				}
			});
		});
	};

	getUcBalance(){
		return new Promise((resolve, reject) => {
			if(this.db.isClosed()) this.db.open();
			this.db.get("ucBalance", (err, data) =>{
				if (err) {
					this.db.close();
					if (err.type === "NotFoundError") {
						this.setUcBalance(0);
						return this.getUcBalance();
					}
					logger.log("error", err, "Userdb >> getBalance");
					reject(0);
				}
				else {
					this.db.close();
					resolve(data);
				}
			});
		});
	};

	setPrivateKey(value){
		if(this.db.isClosed()) this.db.open();
		this.db.put("privateKey", value, (err)=>{
			if (err) {
				logger.log("error", err, "Userdb set privateKey error");
			}else{
				let publicKey = new Crypt().GetPublicKey(value);
				this.setPublicKey(publicKey);
			}
			this.db.close();
		});
	}

	setPublicKey(value){
		if(this.db.isClosed()) this.db.open();
		this.db.put("publicKey", value, (err)=>{
			if (err) {
				logger.log("error", err, "Userdb set public key error");
			}
			this.db.close();
		});
	}

	setUsername(value){
		if(this.db.isClosed()) this.db.open();
		this.db.put("username", value, (err)=>{
			if (err) {
				logger.log("error", err, "Userdb set username error");
			}
			this.db.close();
		});
	}

	setBalance(value){
		if(this.db.isClosed()) this.db.open();
		this.db.put("balance", value, (err)=>{
			if (err) {
				logger.log("error", err, "Userdb set balance error");
			}
			this.db.close();
		});
	}

	setUcBalance(value){
		if(this.db.isClosed()) this.db.open();
		this.db.put("ucBalance", value, (err)=>{
			if (err) {
				logger.log("error", err, "Userdb set ucBalance error");
			}
			this.db.close();
		});
	}

	//TO BE USED DURING WALLET SIGNUP OF EXISTING USER AFTER SETTING THE KEY PARAMETERS
	populateUtxoBalance(){

	}


}

module.exports = User