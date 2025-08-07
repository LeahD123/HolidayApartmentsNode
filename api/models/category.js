import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    // הגרת מערך שיכיל את כל הקודים של המאמרים שמשוייכים לקטגוריה
    // מקובל במונגו אפילו שזה תופס מקום נוסף במסד הנתונים
    apartments: [{
        type: mongoose.Types.ObjectId,
        ref: 'Apartment'
    }]
})

export default mongoose.model('Category', categorySchema)
    // // הגרת מערך שיכיל את כל הקודים של המאמרים שמשוייכים לקטגוריה
    // // מקובל במונגו אפילו שזה תופס מקום נוסף במסד הנתונים
    // articles: [{
    //     type: mongoose.Types.ObjectId,
    //     ref: 'Article'
    // }]