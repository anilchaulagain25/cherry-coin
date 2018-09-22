const dotenv = require('dotenv').config();
var logger = require('./../../logger.js');
const net = require('net');
const http = require('http');
const level = require("level");
const publicIp = require('public-ip');
const os = require('os');

const db = level("././data/peers", {valueEncoding: "json"}, (err)=>{
	if (err) logger.log("error", err, "Error connecting peers database");
});


const PacketModel = function(data){
	data = data || {};
	this.method = data.method || ""; //req:request, res:response
	this.action = data.action || "";
	this.packetType = data.packetType || ""; //T : transaction, B: block, I: Initial
	this.data = data.data || "";

}

const NodeModel = function (data) {
	data = data || {};
	this.ip = data.ip || "";
	this.port = data.port || "";
	this.type = data.type || "U"; //U: User, M: Miner
}


const PORT_NUMBER = process.env.PORT_NUMBER || 8000;
const USE_LOCAL_ADDRESS = process.env.USE_LOCAL_ADDRESS || false;
const IP_ADDRESS = process.env.STATIC_IP_ADDRESS || this.getMyPrivateAddress();

class Connection{
	constructor(){
		this.peers = [];
		this.connectedPeers = [];
		// this.myAddress = USE_LOCAL_ADDRESS ? this.getMyPrivateAddress() : this.getMyPublicAddress();
		this.myAddress = IP_ADDRESS;
		// if (USE_LOCAL_ADDRESS) {
		// 	this.getMyPrivateAddress();
		// }else{
		// 	this.getMyPublicAddress();
		// }
	}

	listen(){
		console.log(this.myAddress, ':', PORT_NUMBER);
		const server = net.createServer((socket) =>{
			console.log(`Connected From: ${socket.remoteAddress} : ${socket.remotePort}`);  //xx
			console.log(`Me : ${socket.localAddress} : ${socket.localPort}`); //xx
			// socket.on('data', this.responseHandler);
			socket.on('data',(data)=>{
				console.log("DATA GOT");
				console.log(data.toString('utf8'));
				this.responseHandler(JSON.parse(data.toString('utf8')));
			});
		})
		server.listen(PORT_NUMBER, this.myAddress).on('error', (err) =>{ if(err) logger.log("error", err, "Error while creating server")});
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

		publicIp.v4().then(ip => {
			this.myAddress = ip;
		});
	}

	getMyPrivateAddress(){
		var ifaces = require('os').networkInterfaces();

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
	  				} else {
	  				    // this interface has only one ipv4 adress
	  				    // console.log(ifname, iface.address);
	  				    // return iface.address;
	  				    this.myAddress = iface.address;
	  				}
	  				++alias;
	  			});
		});
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
			break;
			case "B":
			break;
			default:
			logger.log("info", JSON.stringify(data), "Invalid Response");
			break;
		}
	}

	broadcastData(data){
		db.createValueStream().on('data', (peer) =>{
			let socket = new net.Socket();
			try{
				socket.connect(peer.port, peer.ip, ()=>{
					socket.write(data);
				});
			}catch(ex){
				logger.log("warning", ex, "Error while boradcasting data", peer);
			}
		})
	}

	registerMyIp(){
		var ip = this.getMyPublicAddress();

		var address = ip + ':' + PC_PORT;
	}

	registerNode(data){
		console.log("Registering Node");
		var data = new NodeModel(data);
		if (data.ip != "" && data.port != "") {
			db.put(Date.now(), data, (err) =>{
				if (err) logger.log("error", err, "Error while registering Node");
				else logger.log("success", JSON.stringify(data), "Successfully registered node");
			});
		}
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


var cb = new Connection();
cb.listen();
// var data = new PacketModel();
// data.packetType = "P";
// data.action = "RegisterNode"
// data.data = {"ip":"192.168.1.108", "port": 8005};
// cb.broadcastData(data);