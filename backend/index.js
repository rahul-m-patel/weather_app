const express = require('express')
const app = express()
const port = 3000
const mongoDB = require("./db")
mongoDB();

const { weather_service, initial_data_load} = require("./src/services/weather.service")

app.get('/', (req, res) => {
  initial_data_load();
  res.send('Welcome to the weather app')
})

app.get('/api/weather', async (req, res) => {
  try{
    const resobj = await weather_service(req,res);
    res.status(resobj.statusCode).send(resobj.message)
    //res.json(dataList)
  }
  catch(error){
    res.status(400).send(error)
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})