// model - מקביל לתיקייה שמכילה את כל המחלקות שנוצרו מהחיבור למסד
// code first - מחלקות שמגדירות את האובייקטים באוספים (טבלאות) במסד

import mongoose from "mongoose";

// schema - הגדרה של כל אובייקט באוסף
// model - הגדרה של האוסף

const userSchema = mongoose.Schema({
    username: {
        type : String,
        require : true
    },
    email: {
     //לעשות את הבדיקה של הייחודי במהלך הכנסת EMAIL חדש
     type: String,
        // not null
        require: true
    },
    password: 
    {type : String,
        require :true
    },
    phone: {
        type: String,
        require: true
    },
    anotherPhone: {
        type : String, 
    },
        // הגרת מערך שיכיל את כל הקודים של הדירות שמשוייכות לקטגוריה
    // מקובל במונגו אפילו שזה תופס מקום נוסף במסד הנתונים
    apartments: [{
            type: mongoose.Types.ObjectId,
            ref: 'Apartment'
        }]
})

// פרמטרים:
// שם המודל
// הסכמה שמגדירה את האובייקטים באוסף
export default mongoose.model('user', userSchema)