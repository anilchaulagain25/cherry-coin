const ipc = require("electron").ipcRenderer;


$('#btnGetUserValues').on('click', ()=>{
	console.log("renderer");
	ipc.send('GetUserParameters');
	ipc.on('GotUserParameters', (event, response) =>{
		console.log("responded");
		resp = response;

		console.log(response);
	});
});

$('#btnGetGlobalValues').on('click', ()=>{
	console.log("renderer");
	ipc.send('GetGlobalValues');
	ipc.on('GetGlobalValues', (event, response) =>{
		console.log("responded");
		resp = response;

		console.log(response);
	});
});


$('#btnGetBalance').on('click', ()=>{
	console.log("renderer");
	ipc.send('GetBalance');
	ipc.on('GotBalance', (event, response) =>{
		console.log("responded");
		resp = response;
		console.log("Balance")
		console.log(response);
	});
});


ipc.send('GetBalance');
ipc.on('GotBalance', (event, response) =>{
	resp = response;
	console.log("Balance")
	console.log(response);
});
