const Websocket = require("ws");
const level = require("level");
const db = level("././data/peers", {valueEncoding: "json"}, (err)=>{
	console.error(err);
});

const PC_PORT = process.env.PC_PORT || 8000;

class Connection{
	constructor(){
		this.peers = [];
		this.connectedPeers = [];
	}

	listen(){
		const server = new Websocket.Server({port: PC_PORT});
		console.log(`Listening connections at port ${PC_PORT}`);
	}


	getMyPublicAddress(){
		var myip;

		http.get(murl, (req)=>{
			req.setEncoding('utf8'); 
			req.on('data',(data)=> myip = data );
		});
	}

	registerMyIp(){
		var ip = this.getMyPublicAddress();

		var address = ip + ':' + PC_PORT;
	}

	connectToPeers(){
		var peers = this.getAllPeers();

		peers.forEach((peer) => {
			var socket = new Websocket(peer);
			socket.on('open', ()=> this.connectedPeers.push(peers));
		})
	}

	getAllPeers(){
		var peers = [];
		var keys = db.createValueStream();
		keys.on('data', (data)=>{
			peers.push(data.ws_url);
		}).on('error', (err) => console.error(err));
		return peers;
	}

}