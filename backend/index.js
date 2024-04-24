const express = require('express')
const app = express()
const port = 3000
const mongoDB = require("./db")
mongoDB();
const {initial_data_load, formatDate, generateDateList} = require("./util") //commented out, only used initially to load data into database
initial_data_load();
const weather = require("./models/weather")
const location = require("./models/location")

app.get('/', (req, res) => {
  initial_data_load();
  res.send('Welcome to the weather app')
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
    let unit = req.query.unit;
    if(unit!='C' && unit!='F'){
        return res.status(400).send('unit should either be C or F');
    }
    else{
      if(unit=='C'){
        unit = 'metric';
      } 
      else{
        unit = 'imperial'
      }
    }
    let prev = req.query.prev;
    if(prev){
      if(prev<0 || prev>7)
        return res.status(400).send('Previous number of days should be >=0 and <=7');
    }
    else{
      prev = 0;
    }
    let next = req.query.next;
    if(next){
      if(next<0 || next>7)
        return res.status(400).send('Next number of days should be >=0 and <=7');
    }
    else{
      next = 0;
    }
    const today = new Date();
    const date_range = generateDateList(formatDate(today),prev,next);
    const dataList = [];
    for(let i = 0; i < date_range.length; i++){
      //console.log(unit)
      const data = await weather.findOne({city:city, units:unit, date:date_range[i]});
      if(data){
        //console.log(data)
        dataList.push(data);
      }
    }
    res.json(dataList);
  });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})