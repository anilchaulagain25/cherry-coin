const crypt = require('./Common/Crypt')
const level = require("level");
const crypto = require("crypto");
const logger = require("./../logger");
// const utxo = require('./UTXOhandler');
const fs = require('fs');
const ecdh = crypto.createECDH("secp256k1");

const db = level("././data/wallet/UTXOPool", {valueEncoding : "json"}, (err) => {
	if(err) console.log(err);
});

var peerdb;

var registerdb = ()=>{
	peerdb = level("././data/peers", {valueEncoding: "json"}, (err)=>{
		if (err) {
			logger.log("error", err, "Error connecting peers database");
			console.log(err);
			// peerdb.close();
			// registerdb();
		};
	});
}
registerdb();

peerdb.put(Date.now(), {"ip": "127.0.0.1", "port": 8000}, err => console.log(err));

peerdb.createValueStream().on('data', (peer) =>{
	console.log(peer);
})

/*//UTXO
var GenerateUtxoData = ()=>{
	for (var i = 0; i <= 50; i++) {
		ecdh.generateKeys();
		let privKey = ecdh.getPrivateKey('base64');
		let pubKey = ecdh.getPublicKey('base64');
		let amt = Math.random()*1000;
		utxo.SaveData(pubKey, amt);
		let acData = {privateKey : privKey, publicKey: pubKey, amount : amt} 
		console.log(acData);
		fs.writeFile('accounts.json', JSON.stringify(acData), (err) =>{
			if(err) console.log(err);
		})
	}
}

var StreamUtxoData = ()=>{
	utxo.GetUTXOList().then((data)=>{
		console.log(data);
	})
}

// FOR CALLBACK TEST
var key = "BHLJsGeYPl+LGwiV4SK2ffsD1Ncopbp6S7TZ6Vi0cvIVhlPkEtOPuoVnbacvWu83HBSXCrF+vetZcyX4zmCHOTo=";
db.get(key, (err, val)=>{

})


StreamUtxoData();
GenerateUtxoData();*/