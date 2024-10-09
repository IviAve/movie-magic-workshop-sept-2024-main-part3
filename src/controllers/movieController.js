import { Router } from "express";
import movieService from "../services/movieService.js";
import castService from "../services/castService.js";
import { isAuth } from "../middlewares/userMiddleware.js";
import { getErrorMessage } from "../utils/errorUtil.js";

const router = Router();

router.get('/create', isAuth, (req, res) => {
    res.render('movie/create')
});

router.post('/create',isAuth, async (req, res) => {
    const movieData = req.body;
    const ownerId = req.user?._id;

    try{
        await movieService.create(movieData, ownerId);
    } catch (err) {
        const errorMessage = getErrorMessage(err);

        return res.render('movie/create', { error: errorMessage, movie: movieData });
    }
    

    res.redirect('/');
});

router.get('/search', async (req, res) => {
    const query = req.query; //in papzov demo query == filter
    const movies = await movieService.getAll(query).sort({ year: "desc" }).lean();
    //const movies = await movieService.getAll(query).lean(); Papazov demo

    res.render('home', { isSearch: true, movies, query });
});

router.get('/:movieId/details', async (req, res) => {
    const movieId = req.params.movieId;
    const movie = await movieService.getById(movieId).lean();

    const isOwner = movie.owner && movie.owner.toString() === req.user?._id;

    res.render('movie/details', { movie, isOwner })
});

router.get('/:movieId/attach',isAuth, async (req, res) => {
   const movieId = req.params.movieId;
    const movie = await movieService.getById(movieId).lean();
    const casts = await castService.getAllWithout(movie.casts).lean();

    res.render('movie/attach', { movie, casts });
});

router.post('/:movieId/attach',isAuth, async (req, res) => {
    const movieId = req.params.movieId;

    // in Tsvetan code
    
    const movie = await movieService.getById(movieId).lean();
    const casts = await castService.getAllWithout(movie.casts).lean();

    const castId = req.body.cast;
    const characterName = req.body.charName;

    try{
        await movieService.attach(movieId, castId, characterName);
    }catch (err){
        const errMsg = getErrorMessage(err);

        return res.render('movie/attach', {error: errMsg,movie, casts,characterName})
    }
    

    res.redirect(`/movies/${movieId}/details`);

});

router.get('/:movieId/delete', isAuth, async (req, res) => {
    const movieId = req.params.movieId;

    const movie = await movieService.remove(movieId).lean();
if(movie.owner?.toString() !== req.user._id) {
     // return res.render('movies/details', { movie, isOwner: false, error: 'You cannot delete this movie!' });
     res.setError('You cannot delete this movie!');
     return res.redirect('/404');
}

await movieService.remove(movieId);

    res.redirect('/');
});

router.get('/:movieId/edit', isAuth, async (req, res) => {
    const movieId = req.params.movieId;
    const movie = await movieService.getById(movieId).lean();

    res.render('movie/edit', { movie });
});

router.post('/:movieId/edit', isAuth, async (req, res) => {
    const movieData = req.body;
    const movieId = req.params.movieId;

    try{
        await movieService.edit(movieId, movieData);
    }catch (err){
        const errMsg = getErrorMessage(err)

        return res.render('movie/edit', { error: errMsg, movie: movieData})
    }
    

    res.redirect(`/movies/${movieId}/details`);
});


// Deprecated  form papazov demo
// function toArray(documents) {
//     return documents.map(document => document.toObject());
// }


export default router;