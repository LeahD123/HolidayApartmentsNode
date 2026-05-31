import jwt from "jsonwebtoken"
import Category from "./models/category.js"
import dotenv from "dotenv"
import axios from "axios"
import Apartment from "./models/apartment.js"

export const checkEmail = (req, res, next) => {
    const { email} = req.body
    if (email && email.includes('@')) {
        return next()
    }
    res.status(400).send({ error: 'invalid email!' })
}

export const categoryExists = (req, res, next) => {

    const { category } = req.body

    if (!category && req.method == 'PATCH') {
        return next()
    }

    Category.findById(category)
        .then(category => {
            if (!category) {
                return res.status(404).send({ error: `catgory not found!` })
            }
            next()
        })
        .catch(error => {
            res.status(500).send({ error: error.message })
        })
}

// בדיקה האם נשלח טוקן והאם הוא תקין ותקף
export const checkToken = (req, res, next) => {
    if (prosses.env.TOKEN) {
        // אין הרשאה
        return res.status(401).send({ error: 'Authorization failed!' })
    }

    const token = prosses.env.TOKEN
    if (!token) {
        return res.status(401).send({ error: 'Authorization failed!' })
    }

    // decoded - פיענוח
    jwt.verify(token, process.env.SECRET, (error, decoded) => {
        if (error || !decoded) {
            // האימות נכשל
            return res.status(401).send({ error: 'Authentication failed!' })
        }
        if (decoded) {
            // האובייקט יכיל את הנתונים של המשתמש לפיהם נוצר הטוקן
            // באם יהיה צורך נוכל לשמור אותם באובייקט הבקשה ואז להשתמש בפונקציות הבאות
            next()
        }
    })

}
export const getWeather = async (req, res, next) => {
    try {
       const apartmentId = req.params.id;

        // שליפת הדירה
        const newApartment = await Apartment.findById(apartmentId).populate('cityName');
        console.log(newApartment);

        // const city = newApartment.city.name; // הנחה שהעיר מאוחסנת בשדה 'name' של האובייקט city
        // console.log(city);

        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather`,
            {
                params: {
                    q: newApartment.cityName,
                    appid: process.env.WEATHER_API_KEY
                }
            }
        );

        const weather = response.data;
        const temp = kelvinToCelsius(weather.main.temp);

        req.weather = { temp, c: weather.name };

        next();

    } catch (err) {
        next(err);
    }
};

export const checkAuth = (req, res,next) => {
    const token = process.env.TOKEN;

    // בדוק אם הטוקן קיים
    if (!token) {
        return res.status(401).send({ error: 'Authorization is null!' });
    }

    // אימות הטוקן
    decode = jwt.verify(token, process.env.SECRET, (error, decoded) => {
        if (error || !decoded) {
            console.log(error.message);

            console.log(decoded)
            return res.status(401).send({ error: error.message });
        }
        
        // כאן תוכל להחזיר תגובה אחרת אם הטוקן תקין
        // return res.status(200).send({ message: 'Token is valid!' });
        next()
    });
}

export const kelvinToCelsius = (kelvin) => {
    return kelvin - 273.15;
}