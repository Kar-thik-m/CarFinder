import mongoose from "mongoose";

const carDetailSchema = new mongoose.Schema({
    make: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    variant: {
        type: String,
    },
    safetyRating: {
        type: Number,
        min: 0,
        max: 5
    },
    price: {
        type: Number,
        required: true
    },
    mileage: {
        type: Number,
    },
    reviewscore: {
        type: Number,
    },
    fueltype: {
        type: String,
    },
    bodytype: {
        type: String,
    }
}, { timestamps: true });

const Car = mongoose.model("CarDetail", carDetailSchema);
export default Car;