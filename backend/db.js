const mongoose = require('mongoose');

const mongURI = 'mongodb+srv://weather_app:FFyaJkyRJ0w00jN0@cluster0.mi8fqj2.mongodb.net/weatherdata?retryWrites=true&w=majority&appName=Cluster0'
const mongoDB = async()=>{
    try{
        await mongoose.connect(mongURI);
        console.log("Connected to MongoDB Atlas")
        // console.log(cities)
        // const fetched_data = await mongoose.connection.db.collection("locations");
        // const data = await fetched_data.find({}).toArray();
        // //console.log(data[0]["city"])
        // global.locations = data;
        // const fetched_data_2 = await mongoose.connection.db.collection("temperature");
        // const data_2 = await fetched_data_2.find({}).toArray();
        // //console.log(data_2)
        // global.temperature_scales = data_2
    }
    catch(err){
        console.log("Error while connecting to MongoDB \n",err)
    }
}

module.exports = mongoDB;