const mongoose = require('mongoose');

const mongURI = 'mongodb+srv://weather_app:FFyaJkyRJ0w00jN0@cluster0.mi8fqj2.mongodb.net/weatherdata?retryWrites=true&w=majority&appName=Cluster0'
const mongoDB = async()=>{
    try{
        await mongoose.connect(mongURI);
        console.log("Connected to MongoDB Atlas")
    }
    catch(err){
        console.log("Error while connecting to MongoDB \n",err)
    }
}

module.exports = mongoDB;