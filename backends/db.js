const mongoose = require('mongoose');

//suppose agar kl kheen aur deploy krna hoga to bas connection string change krne h , vaise abhe to yeh local database ke string h
const mongoURI = "mongodb://localhost:27017/inotebook?directConnection=true"
const conectToMongo = ()=>{
    mongoose.connect(mongoURI,()=>{
        console.log("connected to mongo succesfully");
    })
}

module.exports = conectToMongo;