import Apartment from "../models/apartment.js";
import Category from "../models/category.js";
import City from "../models/city.js";
import User from "../models/user.js"
import axios from 'axios';
import {wss} from '../../app.js'
import { getWeather } from '../middlewares.js'; // ייבוא הפונקציה של המידלוור
export const getAll = async (req, res) => {
    try {
        const data = await Apartment.find();
        res.status(200).send(data); // מחזירים את הנתונים
    } catch (err) {
        res.status(500).send({ error: err.message }); // מחזירים שגיאה אם יש
    }
};

export const print = (req, res) => {
    console.log(req.params);
};

export const getById = async (req, res) => {
    try {
        const weather = req.weather;

        const apartment = await Apartment.findById(req.params.id)
            .populate({
                path: 'user',
                select: ['email', 'phone', 'anotherPhone']
            }).populate('city')
            .populate('category');

        if (!apartment) {
            return res.status(404).send({ error: 'Apartment not found' });
        }

        res.status(200).send({
            apartment,
            weather
        });

    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};
//חיפוש דירות לפי קטגוריה
export const getByCategory = (req, res) => {
    const categoryName = req.params.category; // קבלת שם המשתמש מהפרמטרים של הבקשה

    apartment.findOne({ category: categoryName }) // חיפוש משתמש לפי שם
        .then(myCategory => {
            if (!myCategory) {
                return res.status(404).send({ message: 'category not found' });
            }
            return apartment.find({ category: myCategory._id }) // חיפוש פוסטים לפי המפתח הזר
                .populate('user').populate('city'); // למלא את המידע של המשתמש
        })
        //מתוך כך, קיבלנו רשימה של דירות נכנה אותן בשם APARTMENS
        .then(apartments => {
            res.status(200).send({ apartments });
        })
        .catch(err => {
            res.status(500).send({ error: err.message });
        });
}
//שליפת דירות לפי עיר

export const getByCity = (req, res) => {
    const cityName = req.params.cityName; // קבלת שם העיר מהפרמטרים של הבקשה

    Apartment.findOne({ city: cityName }) // חיפוש דירה לפי שם העיר
        .then(apartment => {
            if (!apartment) {
                return res.status(404).send({ message: 'Apartment by city not found!' });
            }
            const user = User.findById(apartment.user)
            const category = Category.findById(apartment.category).title;
            return apartment.find({ city: apartment.id }) // חיפוש דירות לפי המפתח הזר
                .populate(user).populate(category) // למלא את המידע של המשתמש
                .then(apartments => {
                    // כאן נקרא לפונקציה של מזג האוויר
                    return getWeather(cityName) // שליפת מזג האוויר
                        .then(weather => {
                            res.status(200).send({ apartments, weather }); // מחזיר את הדירות ואת מזג האוויר
                        });
                });
        })
        .catch(err => {
            res.status(500).send({ error: err.message });
        });
}


//שליפת דירות לפי מפרסם
export const getByUser = (req, res) => {
    const userName = req.params.user; // קבלת שם המשתמש מהפרמטרים של הבקשה

    apartment.findOne({ userName: userName }) // חיפוש משתמש לפי שם
        .then(myUser => {
            if (!myUser) {
                return res.status(404).send({ message: 'User not found' });
            }
            return apartment.find({ user: userName })
        })// חיפוש פוסטים לפי המפתח הזר 
        //מתוך כך, קיבלנו רשימה של דירות נכנה אותן בשם APARTMENS
        .then(apartments => {
            res.status(200).send({ apartments });
        })
        .catch(err => {
            res.status(500).send({ error: err.message });
        });
}

export const getByLessBeds = (req, res) => {
    const { numOfBeds } = req.body;
    apartment.find({ numOfBeds: { $lt: numOfBeds } })
        .then(apartments => {
            res.status(200).send(apartments)
        })
        .catch(err => {
            res.status(500).send({ error: err.message })
        })
}
export const getByGreatBeds = (req, res) => {
    const { numOfBeds } = req.body;
    apartment.find({ numOfBeds: { $gt: numOfBeds } })
        .then(apartments => {
            res.status(200).send(apartments)
        })
        .catch(err => {
            res.status(500).send({ error: err.message })
        })
}
export const getByEqeulBeds = (req, res) => {
    const { numOfBeds } = req.body;
    apartment.find({ numOfBeds: { $eq: numOfBeds } })
        .then(apartments => {
            res.status(200).send(apartments)
        })
        .catch(err => {
            res.status(500).send({ error: err.message })
        })
}
export const getByLess = (req, res) => {
    const { price } = req.body;
    apartment.find({ price: { $lt: price } })
        .then(apartments => {
            res.status(200).send(apartments)
        })
        .catch(err => {
            res.status(500).send({ error: err.message })
        })
}
export const getByGreat = (req, res) => {
    const { price } = req.body;
    apartment.find({ price: { $gt: price } })
        .then(apartments => {
            res.status(200).send(apartments)
        })
        .catch(err => {
            res.status(500).send({ error: err.message })
        })
}
export const getByEqeul = (req, res) => {
    const { price } = req.body;
    apartment.find({ price: { $eq: price } })
        .then(apartments => {
            res.status(200).send(apartments)
        })
        .catch(err => {
            res.status(500).send({ error: err.message })
        })
}



export const create = async (req, res) => {
    const { name, description, image, numOfBeds, price, adress, cityName, categoryName } = req.body;

    if (!name) {
        return res.status(400).send({ error: "Name is required" }); // בדיקת קלט
    }
    const user = wss.clients[0]; // נניח שיש רק לקוח אחד שמחובר
    const username = user.name ? user.username : "Unknown"; // קבלת שם המשתמש מהלקוח או הגדרת ברירת מחדל
    const phone = user.phone ? user.phone : "Unknown"; // קבלת מספר הטלפון מהלקוח או הגדרת ברירת מחדל
    const anotherPhone = user.anotherPhone ? user.anotherPhone : ""; // קבלת מספר הטלפון הנוסף מהלקוח או הגדרת ברירת מחדל
    const email = user.email ? user.email : "Unknown"; // קבלת האימייל מהלקוח או הגדרת ברירת מחדל

    const newApartment = new apartment({ name, description, image, adress, numOfBeds, price, username, phone, anotherPhone, email, cityName, categoryName });

    try {
        const savedApartment = await newApartment.save();
        let foundUser = await User.findOne({ username: username });
        let foundCity = await City.findOne({ cityname: cityName })
        let foundCategory = await Category.findOne({ title: categoryName })
        // let foundCity = await city.findOne ({cityname : cityName})
        if (!foundUser) {
            foundUser = foundUser = new User({ username: username, apartments: [] }); // צור משתמש חדש עם מערך דירות ריק
            await foundUser.save(); // שמור את המשתמש החדש
        }

        // אם המשתמש לא קיים, השתמש בפונקציה שלך ליצירת משתמש
        if (!foundCity) {
            foundCity = new City({ cityname: cityName, apartments: [] }); // צור משתמש חדש עם מערך דירות ריק
            await foundCity.save(); // שמור את המשתמש החדש
        }
        if (!foundCategory) {
            foundCategory = new Category({ title: categoryName, apartments: [] })
            foundCategory = await foundCategory.save(); // שמור את המשתמש החדש
        }
        await User.updateOne(
            { username: username }, // מצא את המשתמש לפי שם המשתמש
            { $push: { apartments: savedApartment._id } } // הוסף את ה-ID של הדירה החדשה למערך הדירות
        );
        await City.updateOne(
            { cityname: cityName }, // מצא את המשתמש לפי שם המשתמש
            { $push: { apartments: savedApartment._id } } // הוסף את ה-ID של הדירה החדשה למערך הדירות
        );
        await Category.updateOne(
            { title: categoryName }, // מצא את המשתמש לפי שם המשתמש
            { $push: { apartments: savedApartment._id } } // הוסף את ה-ID של הדירה החדשה למערך הדירות
        );
        res.status(201).send(savedApartment); // מחזירים את הדירה שנשמרה
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

export const remove = async (req, res) => {
    const { id } = req.params; // קבל את ה-ID של הדירה מהפרמטרים של הבקשה

    try {
        // מצא את הדירה לפי ה-ID
        const apartmentToDelete = await apartment.findById(id);
        if (!apartmentToDelete) {
            return res.status(404).send({ error: "Apartment not found" });
        }


        // עדכן את המערכים של המשתמש, העיר והקטגוריה
        await User.updateOne(
            { _id: apartmentToDelete.user }, // מצא את המשתמש לפי ה-ID שנשמר בדירה
            { $pull: { apartments: id } } // הסר את ה-ID של הדירה ממערך הדירות של המשתמש
        );

        await City.updateOne(
            { _id: apartmentToDelete.city }, // מצא את העיר לפי ה-ID שנשמר בדירה
            { $pull: { apartments: id } } // הסר את ה-ID של הדירה ממערך הדירות של העיר
        );

        await Category.updateOne(
            { _id: apartmentToDelete.category }, // מצא את הקטגוריה לפי ה-ID שנשמר בדירה
            { $pull: { apartments: id } } // הסר את ה-ID של הדירה ממערך הדירות של הקטגוריה
        );

        // מחק את הדירה
        await apartment.deleteOne({ _id: id });

        res.status(200).send({ message: "Apartment deleted successfully" });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};


export const update = async (req, res) => {
    const { id } = req.params; // מזהה הדירה לעדכון
    const { name, description, image, numOfBeds, price, username, address, cityName, categoryName } = req.body;

    if (!id) {
        return res.status(400).send({ error: "Apartment ID is required" }); // בדיקת קלט
    }

    try {
        // מצא את הדירה לפי ה-ID ועדכן את השדות
        const updatedApartment = await apartment.findByIdAndUpdate(id, { name, description, image, address, numOfBeds, price }, { new: true });

        if (!updatedApartment) {
            return res.status(404).send({ error: "Apartment not found" });
        }

        // עדכון הקשרים עם המשתמש, העיר והקטגוריה
        let foundCity = await City.findOne({ cityname: cityName });
        let foundCategory = await Category.findOne({ title: categoryName });


        // אם העיר לא קיימת, צור עיר חדשה
        if (!foundCity) {
            foundCity = new City({ cityname: cityName, apartments: [] });
            await foundCity.save();
        }

        // אם הקטגוריה לא קיימת, צור קטגוריה חדשה
        if (!foundCategory) {
            foundCategory = new Category({ title: categoryName, apartments: [] });
            await foundCategory.save();
        }

        // עדכון הקשרים;
        await City.updateOne(
            { cityname: cityName },
            { $addToSet: { apartments: updatedApartment._id } } // הוסף את ה-ID של הדירה למערך הדירות
        );
        await Category.updateOne(
            { title: categoryName },
            { $addToSet: { apartments: updatedApartment._id } } // הוסף את ה-ID של הדירה למערך הדירות
        );

        res.status(200).send(updatedApartment); // מחזירים את הדירה המעודכנת
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};
