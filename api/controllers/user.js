// controller - dal + bll - כל הלוגיקה כולל גישה לנתונים

// import jwt from 'jsonwebtoken'
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import axios from "axios"
import fs from 'fs'
import path from 'path';
import dotenv from 'dotenv'
import bcrypt from "bcrypt";

dotenv.config();

const envFilePath = path.join(process.cwd(), '.env');

export const getAllUsers = (req, res) => {
    User.find()
        .then(users => {
            res.status(200).send(users)
        }
        )
        .catch(err => {
            res.status(500).send({ error: err.message })
        })
}


export const updateUserByEmail = async (req, res) => {
    try {
        const response = await axios.put(`https://localhost:3000/users`, {
            email: email,
            ...updatedData
        });
        console.log('User updated successfully:', response.data);
    } catch (error) {
        console.error('Error updating user:', error);
    }
};

export const login = async (req, res) => {

    // באובייקט ג'סון השליפה לפי מפתחות
    const { email, password } = req.body

    // רק בהשוואה where במקום find ניתן להשתמש ב 
    User.findOne({ email })
        .then(async (user) => {
            // users - כל המשתמשים שהמייל שלהם שווה למה שנשלח
            if (!user) {
                return res.status(404).send({ error: 'user not found!' })
            }
            //אובייקט בוליאני, מחזיר TRUE אם הסיסמאות תואמות ו-FALSE אם לא
            const valid = await bcrypt.compare(password, user.password);

            if (!valid) {
                return res.status(401).send("Wrong password");
            }

            // create token
            // jwt.sign - יצירת טוקן
            // 1. נתונים של המשתמש - מחרוזת או ג'סון
            // 2. מחרוזת יחודית למערכת
            // 3. אובייקט אפשרויות - לא חובה
            // ניתן להגדיר באובייקט תוקף לטוקן
            const token = jwt.sign(
                { email: user.email, password: user.password },
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
            // process.env.TOKEN = token;
            updateToken(token)

            res.status(200).send({ user, token })
        })
        .catch(err => {
            res.status(500).send({ error: err.message })
        })
}

function updateToken(newToken) {
    // קריאת הקובץ
    fs.readFile(envFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading .env file:', err);
            return;
        }

        // עדכון ה-TOKEN
        const updatedData = data.replace(/TOKEN=.*/, `TOKEN=${newToken}`);

        // כתיבה חזרה לקובץ
        fs.writeFile(envFilePath, updatedData, 'utf8', (err) => {
            if (err) {
                console.error('Error writing to .env file:', err);
                return;
            }
            console.log('TOKEN updated successfully!');
        });
    });
}
const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

export const register = async (req, res) => {

    const { username, email, password, phone, anotherPhone } = req.body


    // יצירת אובייקט חדש
    const user = new User({
        username,
        email,
        password: await hashPassword(password),
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
                        {
                            id: user._id,
                            email: user.email
                        },
                        process.env.SECRET,
                        {
                            expiresIn: '1h'
                        }
                    )

                    let transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: process.env.EMAIL,
                            pass: process.env.PASSWORDGMAIL
                        }
                    });
                    let mailOptions = {
                        from: 'lea.dachkov@gmail.com',
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
    const { name } = req.body
    User.findOne({ username: name })
        .populate('apartments')
        .then(user => {
            if (!user) {
                return res.status(404).send({ error: 'user not found!' })
            }
            res.status(200).send(user.apartments)
        })
        .catch(err => {
            res.status(500).send({ error: err.message })
        })

}