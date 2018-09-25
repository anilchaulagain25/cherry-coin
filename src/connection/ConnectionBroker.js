var logger = require('./../../logger.js');
const net = require('net');
const http = require('http');
const level = require("level");
const publicIp = require('public-ip');
const os = require('os');
const TransactionHandler = require('./../TransactionHandler');

const {PacketModel, NodeModel} = require("./../../models/Network");

const PORT_NUMBER = process.env.PORT_NUMBER || 8000;
const USE_LOCAL_ADDRESS = process.env.USE_LOCAL_ADDRESS || false;
const IP_ADDRESS = process.env.STATIC_IP_ADDRESS;

class ConnectionBroker{
	constructor(){
		this.peers = [];
		this.connectedPeers = [];
		this.myAddress = IP_ADDRESS;
		this.db = level("././data/peers", {valueEncoding: "json"}, (err)=>{
			if (err) logger.log("error", err, "Error connecting peers database");
		});

		// this.myAddress = USE_LOCAL_ADDRESS ? this.getMyPrivateAddress() : this.getMyPublicAddress();
		// if (USE_LOCAL_ADDRESS) {
		// 	this.getMyPrivateAddress();
		// }else{
		// 	this.getMyPublicAddress();
		// }
	}

	listen(){
		this.getMyPrivateAddress().then((data)=>{
			this.address = data;
			console.log('Listening on ' ,this.myAddress, ':', PORT_NUMBER);
		const server = net.createServer((socket) =>{
			console.log(`Connected From: ${socket.remoteAddress} : ${socket.remotePort}`);  //xx
			console.log(`Me : ${socket.localAddress} : ${socket.localPort}`); //xx
			socket.write(this.broadcastMyIp());
			this.registerNode();
			socket.on('data',(data)=>{
				console.log("NETWORK DATA :");
				console.log(data.toString('utf8'));
				this.responseHandler(JSON.parse(data.toString('utf8')));
			});
		})
		server.listen(PORT_NUMBER, this.myAddress).on('error', (err) =>{ if(err) logger.log("error", err, "Error while creating server")});	
		})
		
	}


	getMyPublicAddress(){
		// var murl = "http://api.ipify.org/";
		// http.get(murl, (req)=>{
		// 	req.setEncoding('utf8'); 
		// 	req.on('data',(data)=> {
		// 		return data;
		// 		console.log(data);
		// 	});
		// });
		return new Promise((resolve, reject)=>{
			publicIp.v4().then(ip => {
				this.myAddress = ip;
				resolve(ip);
			}).catch((err)=>{
				logger.log("error", err, "Error while getting public ip address");
				reject(err);
			});
		})
	}

	getMyPrivateAddress(){
		var ifaces = require('os').networkInterfaces();

		return new Promise((resolve, reject) =>{
			Object.keys(ifaces).forEach(function (ifname) {
				var alias = 0;

				ifaces[ifname].forEach(function (iface) {
					if ('IPv4' !== iface.family || iface.internal !== false) {
      				// skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      				return;
      			}

      			if (alias >= 1) {
	  				    // this single interface has multiple ipv4 addresses
	  				    // console.log(ifname + ':' + alias, iface.address);
	  				    // return iface.address;
	  				    this.myAddress = iface.address;
	  				    resolve(iface.address);
	  				} else {
	  				    // this interface has only one ipv4 adress
	  				    // console.log(ifname, iface.address);
	  				    // return iface.address;
	  				    this.myAddress = iface.address;
	  				    resolve(iface.address);
	  				}
	  				++alias;
	  			});
			});
		})
	}

	responseHandler(data){
		console.log("Response Handler On Work");
		var data = new PacketModel(data);
		switch (data.packetType){
			case "P":
			if (data.action = "RegisterNode") {
				console.log("Register Node Action Point")
				this.registerNode(data.data);
			}
			break;
			case "T":
			if (data.action = "AddTransaction") {
				console.log("Network Add Transaction");
				this.ProcessTransaction(data.data);
			}
			break;
			case "B":
			if (data.action = "AddBlock") {
				console.log("Network Add Block");
				this.ProcessBlock(data.data);
			}
			break;
			default:
			logger.log("info", JSON.stringify(data), "Invalid Response");
			break;
		}
	}

	broadcastData(type, action, data){
		var packet = new PacketModel();
		packet.packetType = type;
		packet.action = action;
		packet.data = data;

		this.db.createValueStream().on('data', (peer) =>{
			let socket = new net.Socket();
			try{
				socket.setEncoding('utf8');
				socket.on('data', (data)=>{
					console.log("NETWORK SOCKET DATA :");
					console.log(data.toString('utf8'));
					this.responseHandler(JSON.parse(data.toString('utf8')));
				});
				socket.connect(peer.port, peer.ip, ()=>{
					socket.write(data);

				}).on('error', (err) =>{
					logger.log("warning", err, "Error while broadcasting data to peers", peer);
				});
			}catch(ex){
				logger.log("warning", ex, "Error while connecting to peers for broadcasting", peer);
			}
		}).on('end', ()=>{
			db.close();
		}).on('error', (err)=>{
			logger.log("warning", err, "Error while streaming peers for broadcasting", peer);
			db.close();
		})
	}

	// send 
	broadcastMyIp(){
		//var ip = this.getMyPublicAddress();

		var node = new NodeModel({'ip': this.myAddress, 'port' : PORT_NUMBER});
		var packet = new PacketModel({'packetType': "P", 'action' : "RegisterNode", 'data': node});
		return packet;
	}

	// Register peers to local peers list
	registerNode(data){
		console.log("Registering Node");
		var data = new NodeModel(data);
		if (data.ip && data.port) {
			this.db.put(Date.now(), data, (err) =>{
				if (err) logger.log("error", err, "Error while registering Node");
				else logger.log("success", JSON.stringify(data), "Successfully registered node");
				db.close();
			});
		}
	}

	ProcessTransaction(data){
		var response = new TransactionHandler().ProcessPeerTxn(data); 
		console.log(JSON.stringify(response));
		return response;
	}

	ProcessBlock(data){
		console.log("Process Incoming Block");
	}







	// connectToPeers(){
	// 	var peers = this.getAllPeers();

	// 	peers.forEach((peer) => {
	// 		var socket = new Websocket(peer);
	// 		socket.on('open', ()=> this.connectedPeers.push(peers));
	// 	})
	// }

	// getAllPeers(){
	// 	return new Promise((resolve, reject) =>{

	// 	})
	// 	var peers = [];
	// 	var keys = db.createValueStream();
	// 	keys.on('data', (data)=>{
	// 		peers.push(data.ws_url);
	// 	}).on('error', (err) => console.error(err));
	// 	return peers;
	// }

}


// var cb = new Connection();
// cb.listen();
// var data = new PacketModel();
// data.packetType = "P";
// data.action = "RegisterNode"
// data.data = {"ip":"192.168.1.108", "port": 8005};
// cb.broadcastData(data);

module.exports = ConnectionBroker;
// module.exports = new ConnectionBroker();