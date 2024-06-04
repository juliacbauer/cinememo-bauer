import { Schema } from "mongoose";

const movieSchema = new Schema({
    imdbID: {
        type: String,
        unique: true,
        required: true
    },
    title: String,
    year: Number,
    poster: String,
    filmType: String,
    genres: String,
    runtime: String,
    actors: String,
    plot: String,
    rated: String,
    directors: String,
    ratings: [{
        source: String,
        value: String
    }],
});

export default movieSchema;