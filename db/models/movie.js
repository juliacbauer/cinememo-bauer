import { Schema } from "mongoose";

const movieSchema = new Schema({
    imdbID: {
        type: String,
        unique: true,
        required: true
    },
    title: String,
    year: Number,
    poster: String
});

export default movieSchema;