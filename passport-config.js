const bcrypt = require('bcrypt')
const localStrategy = require('passport-local').Strategy

function initializePassport(passport, getUserByEmail){

    const authenticateUser = async (email, password, done) => {
        const user = await getUserByEmail(email);
        console.log(user);
        if(user == null){
            return done(null, false, {message: "No user with that email"})
        }
        try {
            if(await bcrypt.compare(password, user.password)){
                return done(null, user)
            }
            else{
                return done(null, false, {message: "Incorrect Password"})
            }
        }
        catch(e){
            return done(e)
        }
    }   
    passport.use(new localStrategy({ usernameField: 'email'}, authenticateUser));
    //NB: you need to specity passwordField to if the keyterm is different from password/passport
}

module.exports = initializePassport;