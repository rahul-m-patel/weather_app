const { weather_service } = require('../src/services/weather.service');
const location = require('../src/models/location.model.js'); 
const weather = require('../src/models/weather.model.js'); 
location.find = jest.fn();
weather.findOne = jest.fn();

describe('weather_service function', () => {
  test('All parameter absent', async()=>{
    const req = { query: {} };
    const data = await weather_service(req);
    expect(data.statusCode).toBe(400);
    expect(data.message).toBe('City parameter is required');
  });
  test('Invalid City name', async()=>{
    const req = { query: {city: 'London'} };
    location.find.mockResolvedValue([{ city: 'New York' }, {city: 'New Delhi'}, {city: 'Istanbul'}, {city: 'Paris'}]);
    const data = await weather_service(req);
    expect(data.statusCode).toBe(400);
    expect(data.message).toBe('Only 4 cities allowed: New York, New Delhi, Istanbul, Paris');
  });
  test('Valid City name', async()=>{
    const req = { query: {city: 'Istanbul'} };
    location.find.mockResolvedValue([{ city: 'New York' }, {city: 'New Delhi'}, {city: 'Istanbul'}, {city: 'Paris'}]);
    weather.findOne.mockResolvedValue({ city: 'Istanbul'})
    const data = await weather_service(req);
    expect(data.statusCode).toBe(200);
  });
  test('Invalid Unit', async () => {
    const req = { query: { city: 'New York', unit: 'K' } };
    location.find.mockResolvedValue([{ city: 'New York' }, {city: 'New Delhi'}, {city: 'Istanbul'}, {city: 'Paris'}]);
    const data = await weather_service(req);
    expect(data.statusCode).toBe(400);
    expect(data.message).toBe('Unit should either be C or F');
  });
  test('Valid City and Unit', async()=>{
    const req = { query: {city: 'Istanbul', unit:'C'} };
    location.find.mockResolvedValue([{ city: 'New York' }, {city: 'New Delhi'}, {city: 'Istanbul'}, {city: 'Paris'}]);
    weather.findOne.mockResolvedValue({ city: 'Istanbul'})
    const data = await weather_service(req);
    expect(data.statusCode).toBe(200);
  });
  test('Invalid Previous Day positive', async () => {
    const req = { query: { city: 'New York', unit: 'C' , prev:8} };
    location.find.mockResolvedValue([{ city: 'New York' }, {city: 'New Delhi'}, {city: 'Istanbul'}, {city: 'Paris'}]);
    const data = await weather_service(req);
    expect(data.statusCode).toBe(400);
    expect(data.message).toBe('Previous number of days should be >=0 and <=7');
  });
  test('Invalid Previous Day negative', async () => {
    const req = { query: { city: 'New York', unit: 'C' , prev:-1} };
    location.find.mockResolvedValue([{ city: 'New York' }, {city: 'New Delhi'}, {city: 'Istanbul'}, {city: 'Paris'}]);
    const data = await weather_service(req);
    expect(data.statusCode).toBe(400);
    expect(data.message).toBe('Previous number of days should be >=0 and <=7');
  });
  test('Valid Previous, Invalid Next Day positive', async () => {
    const req = { query: { city: 'New York', unit: 'C' , prev:3, next:10} };
    location.find.mockResolvedValue([{ city: 'New York' }, {city: 'New Delhi'}, {city: 'Istanbul'}, {city: 'Paris'}]);
    const data = await weather_service(req);
    expect(data.statusCode).toBe(400);
    expect(data.message).toBe('Next number of days should be >=0 and <=7');
  });
  test('Valid Previous, Invalid Next Day negative', async () => {
    const req = { query: { city: 'New York', unit: 'C' , prev:3, next:-3} };
    location.find.mockResolvedValue([{ city: 'New York' }, {city: 'New Delhi'}, {city: 'Istanbul'}, {city: 'Paris'}]);
    const data = await weather_service(req);
    expect(data.statusCode).toBe(400);
    expect(data.message).toBe('Next number of days should be >=0 and <=7');
  });
  test('Valid Input', async()=>{
    const req = { query: {city: 'Istanbul', unit:'C', prev:3, next:2} };
    location.find.mockResolvedValue([{ city: 'New York' }, {city: 'New Delhi'}, {city: 'Istanbul'}, {city: 'Paris'}]);
    weather.findOne.mockResolvedValue({ city: 'Istanbul'})
    const data = await weather_service(req);
    expect(data.statusCode).toBe(200);
  });
});
