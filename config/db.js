const mongoose = require("mongoose");
mongoose.set('strictQuery', true)
mongoose.connect("mongodb://127.0.0.1:27017/Secret").then(()=>{
    console.log("connected!");
}).catch(e=>{
    console.log(e)
});


module.exports = mongoose;