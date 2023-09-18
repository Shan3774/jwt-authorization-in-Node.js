require('dotenv').config();

const express = require('express')
const app = express();

const passport = require('passport')
const methodOverRide = require('method-override')


app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// app.set('view-engine', 'ejs')
app.use(passport.initialize())
app.use(methodOverRide('_method'))

const jwt  = require('jsonwebtoken');

app.use(express.json())

const posts = [
    {
        name: "Abebe",
        age: 40
    }, 
    {
        name: "Kebede",
        age: 25
    }]

app.get('/posts', authenticateToken, (req, res) => {

    res.send(posts)
    //here req.user is our user
})


function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err, user)=> {
        if(err) res.sendStatus(403)
        else{
            req.user = user;
            next();
        }
    })

}

app.listen(3000, () => {
    console.log("server running on port 3000...")
})


