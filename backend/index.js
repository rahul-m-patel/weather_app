const express = require('express')
const app = express()
const port = 3000
const mongoDB = require("./db")
mongoDB();
// const initial_data_load = require("./util") //commented out, only used initially to load data into database
// initial_data_load();
const weather = require("./models/weather")
const location = require("./models/location")



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/weather', async (req, res) => {
    const city = req.query.city;
    if(!city){
        return res.status(400).send('City parameter is required');
    }
    const locations = await location.find({});
    const city_list = locations.map(data => data['city']);
    if(city_list.indexOf(city)==-1){
        return res.status(400).send('Only 4 cities allowed: New York, New Delhi, Istanbul, Paris');
    }
    //console.log(city_list)
    const unit = req.query.unit;
    if(unit!='C' && unit!='F'){
        return res.status(400).send('unit should either be C or F');
    }
    const startDate = req.query.startDate;
    if(!startDate){
        return res.status(400).send('Start Date parameter is required');
    }
    const endDate = req.query.endDate;

    res.send(`City: ${city}, Unit: ${unit}`);
  });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})