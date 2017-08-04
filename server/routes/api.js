const express = require('express');
const router = express.Router();
const request = require('request');
var jwtDecode = require('jwt-decode');


var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	console.log('11111111111111111111111', req.isAuthenticated());
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect the user to the login page
	res.redirect('/login');
}

module.exports = function(passport, path){
  /* GET api listing. */
  router.get('/signin', function(req, res) {
      // Display the Login page with any flash message, if any
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });

	router.post('/authLogin',
		passport.authenticate('auth0', {}), function (req, res) {
		res.send(req.user);
	});

	/*router.post('/authLogin', (req, res, next) => {
		var formData = {
			client_id:'38NoKIXLLUIdeU7bZylys7I8aJu1cjho',
			username:'',
			password:'',
			connection:'Username-Password-Authentication',
			grant_type:'password',
			scope:'openid profile'
		}
		if(!(req.body.username && req.body.password)){
			res.send('Please enter username/password');
		}else{
			formData.username = req.body.username;
			formData.password = req.body.password;
			request.post({url:'https://rajesh.auth0.com/oauth/ro', form: formData}, (err, httpResponse, body) => {
				if (err) {
					return console.error('upload failed:', err);
				}
				if(JSON.parse(body).id_token){
					var responseToSend = {};
					responseToSend.tokens = JSON.parse(body)
					var decoded = jwtDecode(JSON.parse(body).id_token);
					responseToSend.userProfile = decoded;
					res.send(responseToSend);
				}else{
					res.status(400).send(JSON.parse(body));
				}
			});
		}
	});*/

	router.get('/callback',
		passport.authenticate('auth0', { failureRedirect: '/authLogin' }),function(req, res) {
	    if (!req.user) {
	      throw new Error('user null');
	    }
	  }
	);

  /* Handle Login POST */
  // router.post('/login', passport.authenticate('login', {
  //   successRedirect: '/',
  //   failureRedirect: '/signin'
  // }));

	router.post('/login', passport.authenticate('login'), function(req, res){
		res.send(req.user);
	  //console.log("passport user", req.user);
	});

  /* GET Registration Page */
  router.get('/register', function(req, res){
    res.render('register',{message: req.flash('message')});
  });

  /* Handle Registration POST */
  router.post('/register', passport.authenticate('register', {
    successRedirect: '/',
    failureRedirect: '/register'
  }));

  /* GET Home Page */
  router.get('/', isAuthenticated, function(req, res){
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });

	router.get('/accountSummary', isAuthenticated, function(req,res){
		var headers = {
			Authorization: 'Bearer '+req.user.tokens.id_token
		}
		request({
			method: 'GET',
			url: 'https://accountSummaryInteg.mybluemix.net/account/summary/accountSummarys',
			headers: headers
		}, function(error, response, body) {
			if (error) {
				res.status(500).send(error);
			} else {
				body = JSON.parse(body);
				res.send(body);
			}
		});
	})

  /* Handle Logout */
  router.get('/signout', function(req, res) {
    req.logout();
		res.send('Logged Out Successfully');
    //res.redirect('/signin');
  });

  return router;
}
