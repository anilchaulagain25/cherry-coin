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


module.exports = {PacketModel, NodeModel};