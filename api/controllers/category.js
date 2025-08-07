// controller - dal + bll - כל הלוגיקה כולל גישה לנתונים

import Category from "../models/category.js"

export const getAll = (req, res) => {
    Category.find()
        .then(data => {
            res.status(200).send(data)
        })
        .catch(err => {
            res.status(500).send({ error: err.message })
        })
}


export const create = (req, res) => {

    const { title} = req.body

    // יצירת אובייקט חדש
    const c = new Category({
        title
        // ניתן להגדיר את המערך
        // אולם אין צורך - כיון שבמודל כבר הגדרנו את המאפיין שהוא מערך
        // articles:[]
    })
    c.save()
        .then(c => {
            res.status(200).send(c)
        })
        .catch(err => {
            res.status(500).send({ error: err.message })
        })
}
