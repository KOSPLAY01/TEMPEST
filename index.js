import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config(); // Load API key from .env

const app = express();
const port = 3000;

app.use(express.static('public'));   
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', { city: null, temp: null, weather: null, icon: null, error: null });
});

app.post('/weather', async (req, res) => {
    const searchId = req.body.city;
    const apiKey = process.env.API_KEY;

    try {
        const result = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${searchId}&units=metric&appid=${apiKey}`);
        const searchCity = `${result.data.name}, ${result.data.sys.country}`;
        const searchTemp = `${result.data.main.temp}°C`;
        const searchWeather = result.data.weather[0].description;
        const searchIcon = `http://openweathermap.org/img/wn/${result.data.weather[0].icon}.png`;

        res.render("index", { city: searchCity, temp: searchTemp, weather: searchWeather, icon: searchIcon, error: null });
    } catch (error) {
        res.render("index", { city: null, temp: null, weather: null, icon: null, error: "City not found!" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
