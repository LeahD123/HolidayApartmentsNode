import mongoose from "mongoose";
// עיר:  שם עיר, מערך דירות
const citySchema = mongoose.Schema({
    cityname: {
        type: String,
        require: true,
    },
    apartments: [{
        type: mongoose.Types.ObjectId,
        ref: 'Apartment'
    }]
})

export default mongoose.model('City', citySchema)