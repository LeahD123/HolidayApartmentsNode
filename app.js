import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors'
import apartmentRouter from './api/routers/apartment.js';
import userRouter from './api/routers/user.js'
import categoryRouter from './api/routers/category.js';
import cityRouter from './api/routers/city.js'
const app = express();
const port = 3000; // או כל פורט אחר שתרצה

// הוספת middleware לפירוש בקשות JSON
app.use(express.json());

// המנגנון מכיר את כל משתני הסביבה בכל הפרויקט
dotenv.config()

app.use(cors())
// פונקציה לחיבור למסד הנתונים
const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.LOCAL_URI)
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1); // יציאה מהתוכנית במקרה של שגיאה
    }
};

app.use(bodyParser.json())
// הפעלת החיבור למסד הנתונים
connectToDatabase().then(() => {
    // הגדרת מסלול לדוגמה
    app.use('/apartment', apartmentRouter);
    app.use('/user', userRouter);
    app.use('/category', categoryRouter);
    app.use('/city', cityRouter)

    // הפעלת השרת
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
    });
});
