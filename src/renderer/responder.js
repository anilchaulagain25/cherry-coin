require('module-alias/register');
const Global = require('@common/Global');
const User = require('@common/User');



var GetGlobalValues = (event, arg)=>{
	console.log("responder");
	var gbl = new Global();
	gbl.getAllValues().then((data)=>{
		event.sender.send('GetGlobalValues', JSON.stringify(data));
	});
}

var GetUserParameters = (event, arg)=>{
	console.log("responder");
	var gbl = new User();
	gbl.getAllValues().then((data)=>{
		event.sender.send('RGetUserParameters', JSON.stringify(data));
	})

}

var GotBalance = (event, arg)=>{
	console.log("responder");
	var gbl = new User();
	gbl.getAllValues().then((data)=>{
		event.sender.send('RGotBalance', JSON.stringify(data));
	})

}


module.exports = {GetGlobalValues, GetUserParameters, GotBalance};