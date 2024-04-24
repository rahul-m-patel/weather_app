# Weather App
A simple backend for weather app 

### Prerequisites
- The project uses NodeJs, ExpressJs and MongoDB Atlas. You just need NodeJs on your system

### Running the program
Run the program using the following command:
```bash
cd ./backend
npm install
nodemon ./index.js
```

### Unit tests

```bash
cd ./backend
npm test
```

### Overview

Once the backend is running, you can go to any browser or Postman/Thunderclient to test the APIs  
The program is designed keeping in mind that the frontend will be at localhost:3000  
Since, we only want to check the weather for +/-7 days, when we go to localhost:3000, it checks if we already have data for these days in our database. If not, it fetches the data from openweather.org and puts it into the database. If we already have +/-7 days of data, we don't fetch anything from the openweather.org  
This is done so that, by the time client inputs the data he/she wants, we already have the data in our database  

### API Usage

localhost:3000/api/weather  

The city name, unit and previous/next number of days can be inputted as the query parameters  
Generally, if we fetch these attributes from frontend, so they're passed as body parameters, but since this application does not have a frontend, for ease of use, they're used as query parameters  
  
Parameters:  
a. city(mandatory) - can take either of New York, New Delhi, Istanbul, Paris  
b. unit(optional) - can take either of C or F  
c. prev(optional) - can take any number in between 0 to 7 inclusive  
d. next(optional) - can take any number in between 0 to 7 inclusive  
  
example:  
http://localhost:3000/api/weather?city=Istanbul&unit=F&prev=1&next=2  
The above call will return weather for Istanbul with units in imperial format (Fahrenheit for temperature and meter/sec for wind speed) with previous 1 day, todays and next 2 days data
