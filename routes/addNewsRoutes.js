const express =  require('express');
const router = express.Router();
const News = require('../models/newsModel');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs')
const path = require('path');

router.get('/add-news', async (req, res) => {
    res.render('add-news', { session: req.session });
});

//Хроанилище для загруженных изображений
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const filename = file.fieldname + '-' + Date.now() + ext;
      cb(null, filename);
    }
  });
  
  //Создание объекта middleware с настройками multer
  const upload = multer({
      storage: storage,
      fileFilter: (req, file, cb) => {
          const filetypes = /jpeg|jpg|png/;
          const mimetype = filetypes.test(file.mimetype);
          const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
          if (mimetype && extname) {
              return cb(null, true);
          } else {
              cb('Error: Images only!');
          }
      }
  })


router.post('/add-news', upload.single('poster'), async (req, res) => {
     const { title, category, description } = req.body;
    const poster = req.file.filename;

    try{
        const count = await News.countDocuments();
        const postId = `post${count + 1}`;

        const news = new News({ title, category, description, poster, postId});
        await news.save();

        console.log(news)

        res.redirect(`/news/${postId}`); //?
    } catch (err) {
        res.send(err)
        // res.redirect('/add-news');
    }
})

module.exports = router;