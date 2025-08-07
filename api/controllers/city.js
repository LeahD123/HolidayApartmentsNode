// controller - dal + bll - כל הלוגיקה כולל גישה לנתונים

import City from "../models/city.js"
import kelvinToCelsius from "kelvin-to-celsius"
import axios from "axios"
import { response } from "express"

export const getAll = (req, res) => {
    // שליפה של כל הערים
    // find - ToList
    City.find()
        .then(city => {
            res.status(200).send(city)
        })
        // הפרמטר שמתקבל - אובייקט שגיאה
        .catch(err => {
            res.status(500).send({ error: err.message })
        })
}

export const create = (req, res) => {
    const { cityname } = req.body;

    const newCity = new City({ cityname: cityname }); // העברת אובייקט עם המאפיינים הנדרשים

        newCity.save()
            .then(savedCity => res.status(201).send(savedCity)) // מחזירים את העיר שנשמרה
            .catch(err => res.status(500).send({ error: err.message })); // טיפול בשגיאות
};

