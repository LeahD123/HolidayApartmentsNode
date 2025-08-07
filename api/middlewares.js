import jwt from "jsonwebtoken"
import Category from "./models/category.js"

// מידלוור כללי
// אין לו הגדרת ניתוב
// בהגדרת קריאת שרת שתרצה להשתמש בו - נשלח אליו
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
    if (!req.headers.authorization) {
        // אין הרשאה
        return res.status(401).send({ error: 'Authorization failed!' })
    }

    const token = req.headers.authorization.split(' ')[1]

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
 export const getWeather = (c) => {
     console.log(c[0]);
     return new Promise((resolve, reject) => {        
         axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${c},&appid=${process.env.WEATHER_API_KEY}`)
             .then((response) => {
                const weather = response.data;
                let temp = kelvinToCelsius(weather.main.temp);
                resolve({ temp, c: weather.name });
     })
             .catch((err) => {
                reject(err);
            });
    });
}

export const checkAuth = (req, res, next) => {
    // req.headers.authorization.split(' ')[1]
    if (!req.headers.authorization) {
        // authorization - הרשאה
        return res.status(401).send({ error: 'Authorization failed!' })
    }
    const arr = req.headers.authorization.split(' ')

    if (arr.length == 1) {
        return res.status(401).send({ error: 'Authorization failed!' })
    }

    // עד כאן בדיקה שהטוקן קיים

    const [x, token] = arr

    // jwt.verify - אימות
    // בדיקה שהטוקן תקין ותקף
    // callback בפונקציית ה 
    // 1. שגיאה
    // 2. אובייקט מפוענח - מכיל את הנתןנים ששמרנו על המשתמש
    jwt.verify(token, process.env.SECRET, (error, decoded) => {
        if (error || !decoded) {
            // Authentication - אימות
            console.log(error.message);

            // return res.status(401).send({ error: 'Authentication failed!' })
            return res.status(401).send({ error: error.message })
        }
        // יתכן שנרצה כאן לשמור נתונים באובייקט הבקשה
        next()
    })

}