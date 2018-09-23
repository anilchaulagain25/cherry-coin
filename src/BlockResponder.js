const BlockHandler = require("@src/BlockHandler");

var GenerateBlock = (event, arg) =>{
	var blkHlr = new BlockHandler();
	console.log("Block Responder");
	blkHlr.GenerateNewBlock().then((data)=>{
		event.sender.send('generated-block', JSON.stringify(data));
	}).catch((err)=>{
		console.log(err);
	})


}

var MineBlock = (event, arg) => {

	event.sender.send('mined-block', "Block Mining in Process");
}


module.exports = {GenerateBlock}