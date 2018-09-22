

module.exports.controller = function(app) {
	app.get('/', function (req, res) {
		// res.write('hello');
		res.render('Home/index');
		// res.send();
	});

	app.get('/Home', function (req, res) {
		console.log(req.params);
		console.log(req.query);
		// res.write('hello');
		res.render('Home/home', {param: req.query["param"]});
		// res.send();
	});

	app.post('/Home', function(req,res){
		console.log(req.body);
		res.render('Home/home', {param: req.body.name})
	})
}

