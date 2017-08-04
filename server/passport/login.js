var LocalStrategy   = require('passport-local').Strategy;
var Auth0Strategy = require('passport-auth0');
var User = require('./user');
var Secret = require('./secret');
var Users=require('./user-data');
var bCrypt = require('bcrypt-nodejs');
var request = require('request');
var jwtDecode = require('jwt-decode');

module.exports = function(passport) {

	passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) {
            var i;
            // iterate through the user file
            for(i = 0; i < Users.length; i++) {
              //check if username exists
              if(Users[i].username === username) {
                //check if entered password is same as the one on system
                if(Users[i].password === password) {
                  // if user authenticated
                  //Generate token as user authenticated
                  var secret = Secret;
                  secret.secretToken = Users[i].username;
                  Users[i].token=Users[i].username;
                  return done(null, Users[i], secret);
                } else {

                  // if wrong password
                  return done(null, false);
                }
              }
            }

            // if wrong username
            return done(null, false);

        })
    );

    passport.use('auth0', new LocalStrategy({
      passReqToCallback:true
    }, (req, username, password, done) => {
			var formData = {
			 client_id:'38NoKIXLLUIdeU7bZylys7I8aJu1cjho',
			 username:'',
			 password:'',
			 connection:'Username-Password-Authentication',
			 grant_type:'password',
			 scope:'openid profile'
		 }
		 if(!(username && password)){
			 return done(null, false);
		 }else{
			 formData.username = username;
			 formData.password = password;
			 request.post({url:'https://rajesh.auth0.com/oauth/ro', form: formData}, (err, httpResponse, body) => {
				 if (err) {
					 return done(null, false);
				 }
				 if(JSON.parse(body).id_token){
					 var responseToSend = {};
					 responseToSend.tokens = JSON.parse(body)
					 var decoded = jwtDecode(JSON.parse(body).id_token);
					 responseToSend.userProfile = decoded;
					 //res.send(responseToSend);
					 return done(null, responseToSend);
				 }else{
					 return done(null, false);
				 }
			 });
		 }
		}))

	/*passport.use('auth0', new Auth0Strategy({
		domain:       'rajesh.auth0.com',
		clientID:     'AFbwIQkTIQ456GROD97sNmvTG48S0RKQ',
		clientSecret: 'dxX7zyjiWwtiJpvb1LRYbCNIJRT0DWEqre_LS3oKgo4ajaj6qwOVyufEKd4FIn6_',
		audience: 'https://rajesh.auth0.com/oauth/ro',
		username: 'rajeshscontact@gmail.com',
		password: 'Rajarani1',
		grant_type: 'password',
		scope: 'openid profile',
		callbackURL:  '/api/callback'
	}, function(accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
		console.log('+++++++++++++++++++++++++', accessToken, refreshToken, extraParams, profile);
    return done(null, profile);
  }))*/


    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    }

}
