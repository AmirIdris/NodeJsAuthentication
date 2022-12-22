require('dotenv').config()
const mongoose = require("mongoose")
// const encrypt = require("mongoose-encryption");
const db = require("../config/db")
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    active: Boolean
});
userSchema.plugin(passportLocalMongoose)

// const secret = process.env.SECRET
// userSchema.plugin(encrypt, {secret:secret, encryptedFields: ["password"]});

module.exports = mongoose.model("User", userSchema);
