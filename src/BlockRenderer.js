const ipc = require("electron").ipcRenderer;
const $ = require('jquery');

const {remote} = require('electron');
const app = remote.app;

var resp;

$('#btnGenerateBlock').on('click', ()=>{
	console.log('renderer hit')
	ipc.send('generate-block'); //, (event, args)
	ipc.on('generated-block', (event, response)=>{
		resp = response;
		$("#btnMineBlock").attr("disabled", false);

		console.log("Block Generation Request");
		console.log(response);
	});
})

$('#btnMineBlock').on('click', ()=>{
	ipc.send('mine-block'); //, (event, args)
	ipc.on('mined-block', (event, response)=>{
		resp = response;
		console.log("Block Mine Request");
		console.log(response);
	});
})