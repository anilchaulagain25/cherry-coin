const net = require('net');

const PacketModel = function(data){
	data = data || {};
	this.method = data.method || ""; //req:request, res:response
	this.action = data.action || "";
	this.packetType = data.packetType || ""; //T : transaction, B: block, I: Initial
	this.data = data.data || "";

}

let peer = {
	port : 5003,
	ip: "127.0.0.1"
}

var data = new PacketModel();
data.packetType = "P";
data.action = "RegisterNode"
data.data = {"ip":"192.168.1.108", "port": 8005};

let socket = new net.Socket();
try{
	socket.connect(peer.port, peer.ip, ()=>{
		socket.write(JSON.stringify(data));
	});
}catch(ex){
	console.log("warning", ex, "Error while boradcasting data", peer);
}