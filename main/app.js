require('module-alias/register'); //xx
const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const app = express();
const router = express.Router();
const HTTP_PORT = process.env.HTTP_PORT || 8085;

app.set('port', HTTP_PORT);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.urlencoded());
app.use(express.json());
app.use(express.static(__dirname + '/ui'));
app.use(express.static(__dirname + '/views/partials'));

// app.use(app.router);	

//Set global variables
app.locals = {
	app : {
		title: 'Patan Coin',
		version: '0.0.1'
	}
};

// Register all controllers
fs.readdirSync(__dirname + '/controller/').forEach(function (file){
	if (file.substr(-2) == 'js') {
		route = require(__dirname + '/controller/' + file);
		route.controller(app);
	}
});

//Application Level Middleware 
app.use((req, res, next)=>{
	//log all requests here if required
	console.log('Request Time : ', Date.now());
	next();
})

// app.get('/', function (req, res) {
// 	console.log(req.params);
// 	console.log(req.query);
// 	// res.write('hello');
// 	res.render('home/index');
// 	// res.send();
// });

//Create an http server and bind express application to it.
http.createServer(app).listen(app.get('port'), function () {
	console.log(`I'm listening on ${HTTP_PORT}. Let's talk`);
});