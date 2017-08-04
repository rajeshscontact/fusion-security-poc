var LocalStrategy   = require('passport-local').Strategy;
var User = require('./user');
var Users=require('./user-data');
var fileLocation='./user-data.json';
var fs=require('fs');
var bCrypt = require('bcrypt-nodejs');
var newUser = User;

module.exports = function(passport){

	passport.use('signup', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            fs.readFile(fileLocation, {encoding: 'utf8'}, function(err, data){
                if (err) throw err;
                var all_users_info = JSON.parse(data);
                console.log(all_users_info);

                console.log(Users.length);
                var i;

                //check if username exists
                for(i = 0; i < Users.length; i++) {
                    if(Users[i].username === username) {
                        console.log('Username Already Exists');
                        return done(null,false);
                    }
                }

                console.log(i);

                //create new user if username doesnot exist
                newUser = User;
                console.log(newUser);

                //set the user's local credentials
                newUser.id=(i+1)+'';
                newUser.username = username;
                newUser.password = password;
                newUser.email = req.param('email');
                newUser.firstName = req.param('firstName');
                newUser.lastName = req.param('lastName');
                all_users_info.push(newUser);

                //save the user
                fs.writeFile(fileLocation, JSON.stringify(all_users_info), {encoding: 'utf8'}, function(err) {
                    if (err) throw err;
                    console.log(JSON.stringify(all_users_info));
                    console.log(fileLocation);
                    console.log('User has been added!');
                });
            });

            return done(null, newUser);
            // Delay the execution of findOrCreateUser and execute the method
            // in the next tick of the event loop
            process.nextTick(findOrCreateUser);
        })
    );

    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

}
