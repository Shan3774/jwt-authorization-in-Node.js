require('dotenv').config();

const express = require('express')
const app = express();
const jwt  = require('jsonwebtoken');

const bcrypt = require('bcrypt')
const passport = require('passport')
const methodOverride = require('method-override')
const initializePassport = require('./passport-config')

///////### change the functions above to suit you 

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(passport.initialize())
app.use(methodOverride('_method'))

let refreshTokens = [];

users =  [];

initializePassport(
    passport,
    email => users.find(user => user.email === email)
)

app.post('/register', async(req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
          id: Date.now().toString(),
          userName: req.body.userName,
          email: req.body.email,
          password: hashedPassword
        })
        console.log(users)
        res.redirect('/login')
      } catch {
        res.redirect('/register')
      }
})


app.post('/login', passport.authenticate('local', {
    session: false,
    failureRedirect: '/register',
}), 
(req, res) => {
    //Authenticate user : identify his identity as a user of yours -done using passport 
    //authorize user : permit this user to access certain routes in a limited fashion - done using sessions or jwt
    const email  = req.body.email;
    const user = { email : email}
    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken)

    res.json({ accessToken: accessToken, refreshToken: refreshToken })

})


app.post('/token', (req, res) => {

    const refreshToken = req.body.token;
    
    if(refreshToken == null) res.sendStatus(401)
    else if(!refreshTokens.includes(refreshToken)) res.sendStatus(403)
    else jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user)=> {
        if(err) res.sendStatus(403)
        accessToken = generateAccessToken({ name: user.name});
        res.json({accessToken: accessToken})
    })

})

app.delete('/logOut', (req, res) => {
    refreshTokens = refreshTokens.filter(refreshToken => refreshToken !== req.body.token)
    res.sendStatus(204);
})

function generateAccessToken(user){
    return accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s'});
}

app.listen(4000, () => {
    console.log("server running on port 4000...")
})
