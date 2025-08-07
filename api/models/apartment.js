import mongoose from "mongoose";
// דירה:  שם – לא חובה, תיאור, תמונה, קוד קטגוריה, קוד עיר, כתובת, מס' מיטות, תוספים (רצוי מערך), מחיר, קוד מפרסם
const apartmentSchema = mongoose.Schema({
    name : 
    {type :String,
    require : false 
    },
    description: {
        type: String,
        require: true
    },
    image: String,
    category: {
        // סוג - מפתח ראשי של מודל
        type: mongoose.Types.ObjectId,
        // ref - reference - לאיזה מודל אני מצביע
        // שם המודל כמו שייצאנו אותו
        ref: 'Category'
    } ,
    city: {
        // סוג - מפתח ראשי של מודל
        type: mongoose.Types.ObjectId,
        // ref - reference - לאיזה מודל אני מצביע
        // שם המודל כמו שייצאנו אותו
        ref: 'City'
    } ,
    user : {
        type: mongoose.Types.ObjectId,
        ref : 'User'
    },
    username : String,
    adress : String,
    numOfBeds : Number,

    price: {
        type: Number,
        require: true
    },
    addes  :[{}],
    cityName : {
        type : String
    },
    categoryName : {
        type : String
    }
})
//always added 's' 
export default mongoose.model('apartment', apartmentSchema)