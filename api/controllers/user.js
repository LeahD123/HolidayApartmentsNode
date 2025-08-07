// controller - dal + bll - כל הלוגיקה כולל גישה לנתונים

// import jwt from 'jsonwebtoken'
// import nodemailer from 'nodemailer'
import User from '../models/user.js' 
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

export const login = (req, res) => {

    // באובייקט ג'סון השליפה לפי מפתחות
    const { email, password } = req.body

    // רק בהשוואה where במקום find ניתן להשתמש ב 
    User.find({ email })
        .then(users => {
            // users - כל המשתמשים שהמייל שלהם שווה למה שנשלח
            if (users.length == 0) {
                return res.status(404).send({ error: 'user not found!' })
            }
            // במערך - השליפה לפי מיקום
            //שולף את האובייקט הראשון שלנו, כיוון שאמור להיות רק אובייקט אחד -אז זה בסדר
            let [user] = users

            if(user.password != password) {
                return res.status(404).send({ error: 'user not found!' })
            }

            // if(user.email === email && user.email === email ){
            //     return user.username;
            // }

            // create token
            // jwt.sign - יצירת טוקן
            // 1. נתונים של המשתמש - מחרוזת או ג'סון
            // 2. מחרוזת יחודית למערכת
            // 3. אובייקט אפשרויות - לא חובה
            // ניתן להגדיר באובייקט תוקף לטוקן
            const token = jwt.sign(
                { email: user.email, password : user.password },
                // גישה למשתני סביבה
                // process.env.PARAMETER
                process.env.SECRET,
                {
                    expiresIn: '1hr',
                    // expiresIn: '10m',
                    // expiresIn: '7d',
                    // expiresIn: '20s'
                }
            )

            res.status(200).send({ user, token })
        })
        .catch(err => {
            res.status(500).send({ error: err.message })
        })
}


export const register = (req, res) => {

    const { username, email, password, phone, anotherPhone} = req.body

    // יצירת אובייקט חדש
    const user = new User({
        username,
        email,
        password,
        phone,
        anotherPhone
        //אפשר להגדיר מערך אבל אין צורך
    })

    User.find({ email })
        .then(users => { 
            console.log('save');

            // users - כל המשתמשים שהמייל שלהם שווה למה שנשלח
            if (users.length > 0) {
                return res.status(404).send({ error: 'email already exists' })
            }

            user.save()
                .then(async user => {
                    const token = jwt.sign(
                        { email: user.email, password : user.password },
                        process.env.SECRET,
                        {
                            expiresIn: '1hr',
                            // expiresIn: '10m',
                            // expiresIn: '7d'
                        }
                    )

                    let transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: process.env.EMAIL,
                            // סיסמת אפליקציה
                            // סיסמת אפליקציה היא סיסמה מיוחדת שנוצרת על ידי שירותי אבטחה כמו Google,
                            //  כדי לאפשר לאפליקציות צד שלישי לגשת לחשבון שלך מבלי לחשוף את הסיסמה הראשית שלך.
                            //  היא משמשת כאשר האימות הדו-שלבי מופעל, ומאפשרת לאפליקציות שאינן תומכות באימות דו-שלבי להתחבר לחשבון שלך.
                            pass: process.env.PASSWORD

                            // בחשבון גוגל api ליצור מפתח
                            // ולאפשר גישה לאפליקציות צד שלישי
                            // API_KEY
                        }
                    });
                    let mailOptions = {
                        from: 'Lea.dachkov@gmail.com',
                        to: user.email,
                        subject: 'Hi, ' + user.username,
                        // text: 'Wellcome to our organization!\n You are administrator.'
                        html: '<h1>Wellcome to our application!\n We are so happy to see you!.</h1>'
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        }
                        else {
                            console.log('Email sent: ' + info.response);
                        }
                    });

                    res.status(200).send({ user, token })
                })
        })
        .catch(err => {
            res.status(500).send({ error: err.message })
        })
}

export const getApartmentsFromArr = (req, res) => {
    const {id} = req.headers.authorization;
    
}