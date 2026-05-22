// from TMDB on the web, you get the API key which can be used
import axios from 'axios';
import Movie from '../models/Movie.js';

// API to get now playing movies from the TMDB  API
export const getNowPlayingMovies = async (req, res) => {
    try {
        const {data} = await axios.get("https://api.themoviedb.org/3/movie/now_playing", {headers: {Authorization: `Bearer ${process.env.TMDB_API_KEY}`}})

        const movies = data.results;
        res.json({success: true, movies})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

// API to add new show to the database
export const addShow = async (req, res) => {
    try {
        const {movieId, showsInput, showPrice} = req.body;
        let movie = await Movie.findById(movieId);

        if(!movie) {
            // fetch movie details and credits from TMDB API
        }

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}