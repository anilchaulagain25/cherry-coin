

module.exports.controller = function(app) {
	app.get('/', function (req, res) {
		// res.write('hello');
		res.render('home/index');
		// res.send();
	});

	app.get('/home', function (req, res) {
		console.log(req.params);
		console.log(req.query);
		// res.write('hello');
		res.render('home/home', {param: req.query["param"]});
		// res.send();
	});

	app.post('/home', function(req,res){
		console.log(req.body);
		res.render('home/home', {param: req.body.name})
	})
}

