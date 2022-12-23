const express = require("express");
const bodyParser = require("body-parser");
// session middleware
const session = require('express-session');
// authentication middleware
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require("./Model/userModel");
const ejs = require("ejs");
const db = require("./config/db");
// const md5 = require("md5");
const bcrypt = require("bcrypt")
const saltRounds = 10;
const app = express();
app.use(session({
    secret: "Our Little secret",
    name: "test",
    resave: false,
    saveUninitialized: false

}));
app.use(bodyParser.urlencoded(extended=true));
app.use(passport.initialize());
app.use(passport.session());
app.set("view engine", "ejs");
app.use(express.static("public"));

// passport Local Strategy
passport.use(User.createStrategy())
// To Use with Session
passport.serializeUser(function(user, done) {
    done(null, user);
  });
passport.deserializeUser((id, done)=>{
    User.findById(id, (err, user)=>{
        done(err, user);

    });
});
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRETE,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
        console.log(profile)
      return cb(err, user);
    });
  }
));

app.get('', (req,res)=>{
    console.log(req.session)

    res.render('home')

});

app.get('/auth/google',passport.authenticate('google', { scope: ["profile"] }));

app.get('/auth/google/secrets', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/secrets');
  });


app.get('/login', (req,res)=>{

    res.render('login')
});
// app.post('/login', (req, res)=>{
//     // email = req.body.email;
//     // password = req.body.password;
//     // console.log(email)
//     // User.findOne({email:email}).then(result=>{
//     //     bcrypt.compare(password, result.password, function(err, tableResult) {
//     //         if (tableResult === true){
//     //             res.render("secrets")
//     //         }
//     //     });

//     // }
//     // ).catch(e=>{
//     //     console.log(e)
//     // })

//     // User.findOne({email: email}, (err, userFound)=>{
//     //     if (err){
//     //         console.log("Hello Something is going wrong!")
//     //     }
//     //     else{
//     //         console.log(userFound)
//     //     }
//     // })

//     const user = new User({
//        username: req.body.username,
//        password:  req.body.password
//         })

//     req.login(user, (err)=>{
        
//         if (err){
//             console.log(err);
//         }
//         else{
//             console.log("tobe authenticated")
//             passport.authenticate("local")(req, res, ()=>{
//                 res.redirect('/secrets');
//             })
           
            
//         }
        
//     });
// });

app.post('/login', passport.authenticate('local', {failureRedirect: '/login', failureMessage:true}), (req, res)=>{
    console.log(req.user);
    console.log(req.session.failureMessage)
    res.redirect('/secrets')

});

app.get('/register', (req,res)=>{
    res.render('register')
});

app.get('/secrets', (req,res)=>{
    if (req.isAuthenticated()){
        res.render('secrets');
    }
    else{
        res.redirect("/login")
    }
});

app.post('/register', (req, res)=>{

    // bcrypt.hash(req.body.password, saltRounds, function(err, hash){
    //     email = req.body.username;
    //     // password = req.body.password;
    
    //     const user = User({
    //         email: email,
    //         password: hash
    //     });
    //     user.save((err)=>{
    //         if(err){
    //             console.log(err)
    //         }
    //         else{
    //          res.render('secrets');
    //         }
    //     });
    // })

    User.register({username: req.body.username, active: false}, req.body.password, (err, user)=>{
        if (err){
            console.log(err)
            res.redirect('/login')
        }
        else{
            passport.authenticate("local")(req, res, function(){
                console.log(req.user)
                res.redirect('/secrets');
            });
        }
    });
});




app.get('/logout', (req,res)=>{
    req.logout((err)=>{
        if(err){
            console.log(err)
        }
        else{
    res.render('login');
        }

    });
});

app.get('/cdn', (req, res)=>{
    res.render("cdn")

});


app.listen(3000, ()=>{
    console.log("Server is listening on port 5000");
});
