const BlockHandler = require("./BlockHandler");

var GenerateBlock = (event, arg) =>{
	BlockHandler.GenerateNewBlock().then((data)=>{
		event.sender.send('generated-block', JSON.stringify(data));
	}).catch((err)=>{
		console.log(err);
	})


}

var MineBlock = (event, arg) => {

	event.sender.send('mined-block', "Block Mining in Process");
}


module.exports = {GenerateBlock}