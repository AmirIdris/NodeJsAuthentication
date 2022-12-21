const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs")
const mongoose = require("mongoose")
const db = require("./config/db");
const User = require("./Model/userModel");
const app = express();
app.use(bodyParser.urlencoded(extended=true));
app.set("view engine", "ejs");
app.use(express.static("public"));



// const user = User({
//     email:"amaedris1@gmail.com",
//     password:"amir1234"
// });

// user.save()



app.get('', (req,res)=>{
    res.render('home')
});

app.get('/login', (req,res)=>{
    res.render('login')
});


app.post('/login', (req, res)=>{
    email = req.body.email;
    password = req.body.password;
    console.log(email)
    User.findOne({email:email}).then(result=>{
        if (result.email === email){
            res.render("secrets")
        }

    }
    ).catch(e=>{
        console.log(e)
    })

    // User.findOne({email: email}, (err, userFound)=>{
    //     if (err){
    //         console.log("Hello Something is going wrong!")
    //     }
    //     else{
    //         console.log(userFound)
    //     }
    // })
});


app.get('/register', (req,res)=>{
    res.render('register')
});



app.post('/register', (req, res)=>{
    email = req.body.username;
    password = req.body.password;

    const user = User({
        email: email,
        password: password
    });
    user.save();

    res.render('secrets');
});


app.get('/logout', (req,res)=>{
    res.render('login')
});


app.listen(5000, ()=>{
    console.log("Server is listening on port 5000");
});
