const axios = require('axios');
const weather = require("../models/weather.model")
const location = require("../models/location.model")
const unit = require("../models/unit.model")
const {formatDate, generateDateList, constructDocument} = require("../util")

const baseUrl = 'https://api.openweathermap.org/data/3.0/onecall/day_summary';
const apikey = "945b1d705786f6cd9f5841bce40a3ddd"

// checks for inputs in the query and returns the fetched results from database
async function weather_service(req){
    const city = req.query.city;
    const resObj = {};
    if(!city){
        resObj.statusCode = 400;
        resObj.message = 'City parameter is required';
        return resObj;
    }
    const locations = await location.find({});
    const city_list = locations.map(data => data['city']);
    // checks if city is in the database
    if(city_list.indexOf(city)==-1){
        resObj.statusCode = 400;
        resObj.message = 'Only 4 cities allowed: New York, New Delhi, Istanbul, Paris';
        return resObj;
    }

    let unit = req.query.unit;
    if(!unit){
        unit = 'C'
    }
    if(unit!='C' && unit!='F'){
        resObj.statusCode = 400;
        resObj.message = 'Unit should either be C or F';
        return resObj;
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
      if(prev<0 || prev>7){
        resObj.statusCode = 400;
        resObj.message = 'Previous number of days should be >=0 and <=7';
        return resObj;
      }
    }
    else{
      prev = 0;
    }
    let next = req.query.next;
    if(next){
      if(next<0 || next>7){
        resObj.statusCode = 400;
        resObj.message = 'Next number of days should be >=0 and <=7';
        return resObj;
      }
    }
    else{
      next = 0;
    }
    const today = new Date();
    const date_range = generateDateList(formatDate(today),prev,next);
    const dataList = [];
    //makes output list
    for(let i = 0; i < date_range.length; i++){
      const data = await weather.findOne({city:city, units:unit, date:date_range[i]});
      if(data){
        dataList.push(data);
      }
    }
    if(dataList.length>0){
        resObj.statusCode = 200;
        resObj.message = dataList;
        return resObj;
    }
}


//this functions loads data into database if data for +/-7 days from today is not present 
async function initial_data_load(){
    try{
        const cities = await location.find({});
        const units = await unit.find({})
        const today = new Date();
        const todayString = formatDate(today);
        const dateList = generateDateList(todayString,7,7);
        
        for(let i = 0; i < cities.length; i++){
            for(let j = 0; j < units.length; j++){
                for(let k = 0; k < dateList.length; k++){
                    const already_exists = await weather.findOne({city:cities[i]["city"], units:units[j]["unit"], date:dateList[k]});
                    if(!already_exists){
                        const uri = `${baseUrl}?lat=${cities[i]["lat"]}&lon=${cities[i]["lon"]}&date=${dateList[k]}&units=${units[j]["unit"]}&appid=${apikey}`;
                        console.log(uri);
                        const response = await axios.get(uri);
                        const fetchedData = response.data;
                        const document = constructDocument(fetchedData);
                        document["city"] = cities[i]["city"];
                        await weather.create(document);
                        console.log('Data saved to database');
                    }  
                }
            }
        }

        
    }
    catch(err){
        console.log("Error occured \n",err)
    }
}

module.exports = {
    weather_service,
    initial_data_load
};