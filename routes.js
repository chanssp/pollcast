/* acts as the router of PollCast */

module.exports = function(app) {
	app.get('/', function(req, res) {
		res.render('./main.ejs');
	});

	app.get('/about', function(req, res) {
		res.render('./about.ejs');
	});

	app.get('/developers', function(req, res) {
		res.render('./developers.ejs');
	});

	// app.get('/csstest', function(req, res) {
	// 	res.render('./csstest.ejs');
	// });
}