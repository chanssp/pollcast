/* This file acts as the server of PollCast */

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/data'));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

app.set('view engine', 'ejs');

app.use(express.static('static'));
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

require('./routes.js')(app);

/* run server at port 80 */
var server = app.listen (8080, function() {
	console.log ("Server running at http://localhost:8080");
})