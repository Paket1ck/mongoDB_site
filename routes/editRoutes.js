const express =  require('express');
const router = express.Router();
const News = require('../models/newsModel');

router.get('/edit-news', async (req, res) => {
    try {
            const news = await News.find();
            res.render('edit-news', { news });
    } catch (err) {
        console.error(err);
        res.redirect('/dashboard');
    }
});

const fs = require('fs');

router.post('/delete-news/:id', async (req, res) => {
    const newsId = req.params.id;
    try {
        const news = await News.findById(newsId);
        const posterPath = `public/uploads/${news.poster}`;
        fs.unlinkSync(posterPath);
        await News.findByIdAndDelete(newsId);
        res.redirect('/dashboard/edit-news');
    } catch (err) {
        console.error(err);
        res.render('error');
    }
});

module.exports = router;

// router.post('/delete-news/:id', async (req, res) => {
//     try {
//         const deleteNews = await News.findByIdAndDelete(req.params.id);
//         if (!deleteNews) {
//             return res.status(404).send('News not found');
//         }
//         res.redirect('/dashboard');
//     } catch(err) {
//         console.error(err);
//         res.status(500).send('Server Error');
//     }
// });
