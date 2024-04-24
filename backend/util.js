const axios = require('axios');
const location = require("./models/location")
const unit = require("./models/unit")
const weather = require("./models/weather")

const baseUrl = 'https://api.openweathermap.org/data/3.0/onecall/day_summary';


function generateDateList(startDate){
    const dateList = [];
    const currentDate = new Date(startDate);

    // Generate previous 7 dates
    for (let i = 6; i >= 0; i--) {
      const prevDate = new Date(currentDate);
      prevDate.setDate(prevDate.getDate() - i);
      dateList.push(formatDate(prevDate));
    }
    
    // Generate coming 7 dates
    for (let i = 1; i <= 7; i++) {
      const nextDate = new Date(currentDate);
      nextDate.setDate(nextDate.getDate() + i);
      dateList.push(formatDate(nextDate));
    }
  
    return dateList;
}
  
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function constructDocument(data) {
    const document = {};
    
    Object.keys(data).forEach(key => {
        if (typeof data[key] === 'object') {
            document[key] = constructDocument(data[key]);
        } 
        else {
            document[key] = data[key];
        }
    });
    return document;
}

const initial_data_load = async()=>{
    try{
        const cities = await location.find({});
        const units = await unit.find({})
        const today = new Date();
        const todayString = formatDate(today);
        const dateList = generateDateList(todayString);
        const apikey = "945b1d705786f6cd9f5841bce40a3ddd"
        for(let i = 0; i < cities.length; i++){
            for(let j = 0; j < units.length; j++){
                for(let k = 0; k < dateList.length; k++){
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
    catch(err){
        console.log("Error occured \n",err)
    }
}

module.exports = initial_data_load;