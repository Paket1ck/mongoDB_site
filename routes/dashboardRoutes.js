const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const UserDetails = require('../models/UserDetails');
const User = require('../models/users');
const multer = require('multer');
const path = require('path');
const { escape } = require('querystring');
const fs = require('fs');

function checkAuth(req, res, next) {
  if (!req.session.user || (req.session.user.role !== 'admin' && req.session.user.role !== 'user')) {
    return res.redirect('/login');
  }
  next();
}

router.get('/', (req, res) => {

  res.render('dashboard', { session: req.session });
});



// router.get('/user-data', (req, res) => {
//     if (req.session.user.role !== 'admin') {
//         return res.redirect('/dashboard');
//     }

//     res.render('userDataForm', {session: req.session, userDetails: UserDetails });
// });

router.get('/user-data', checkAuth, async (req, res) => {

  let userDetails = await UserDetails.findOne({ user: req.session.user._id });
  if (!userDetails) {

    userDetails = new UserDetails({
      user: req.session.user._id,
      nickname: '',
      about: '',
      avatarUrl: ''
    });
    await userDetails.save();
  }

  res.render('userDataForm', { session: req.session, userDetails: userDetails });
});

router.get('/profile/:id', checkAuth, async (req, res) => {
  const userDetails = await UserDetails.findOne({ user: req.params.id }).populate('user');
  if (!userDetails) {
    return res.redirect('/dashboard');
  }

  res.render('userProfile', { session: req.session, userDetails });
});

router.get('/edit-news', (req, res) => {
  // Логика обработки GET-запроса для страницы "edit-news"
  // Возвращаем нужный HTML-шаблон или выполняем необходимые действия
  res.render('edit-news');
});

//Хроанилище для загруженных изображений
// создаем хранилище для загруженных изображений
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/avatars');
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
}).single('avatar');

// const fs = require('fs');

router.post('/user-data', checkAuth, async (req, res) => {


  // обрабатываем загруженный файл
  upload(req, res, async (err) => {
    if (err) {
      return res.render('userDataForm', { session: req.session, error: err });
    }

    // объявляем переменную userDetails
    let userDetails;

    // Ищем запись о пользователе
    userDetails = await UserDetails.findOne({ user: req.session.user._id });

    // Если запись уже существует, то обновляем ее поля
    if (userDetails) {
      userDetails.nickname = req.body.nickname;
      userDetails.about = req.body.about;

      // проверяем, был ли загружен новый файл
      if (req.file) {
        const oldAvatarPath = userDetails.avatarUrl ? path.join(__dirname, '..', 'public', userDetails.avatarUrl) : null;

        userDetails.avatarUrl = '/img/avatars/' + req.file.filename;

        // удаляем старый файл, если он есть
        if (oldAvatarPath && fs.existsSync(oldAvatarPath)) {
          fs.unlinkSync(oldAvatarPath);
        }
      }

      await userDetails.save();
    } else {
      // Если записи не существует, то создаем ее
      userDetails = new UserDetails({
        user: req.body.user,
        nickname: req.body.nickname,
        about: req.body.about,
        avatarUrl: req.file ? '/img/avatars/' + req.file.filename : null,
        user: req.session.user._id,
      });
      await userDetails.save();
    }

    // Перенаправляем пользователя на страницу с данными всех пользователей
    res.redirect('/dashboard');
  });
});

router.post('/profile/:id/delete-avatar', async (req, res) => {
  const userDetails = await UserDetails.findOne({ user: req.params.id });

  if (!userDetails) {
    return res.redirect('/dashboard');
  }

  if (userDetails.avatarUrl) {
    const filePath = path.join(__dirname, '..', 'public', userDetails.avatarUrl);
  }

  userDetails.avatarUrl = null;
  await userDetails.save();
//http://localhost:3000/dashboard/profile/6461ee14761401141a8c317d
//http://localhost:3000/dashboard/profile/6461ee14761401141a8c317d
//http://localhost:3000/dashboard/profile/$%7Breq.params.id%7D
  console.log('test'+ (3+5));
  console.log(`test ${3+5}`)
  res.redirect(`/dashboard/profile/${req.params.id}`);
});


// const deleteForm = document.querySelector('#delete-avatar-form');
// deleteForm.addEventListener('submit', (even) => {
//     const confirmDelete = confirm('Are you sure you want to delete the avatar?');
//     if (!confirmDelete) {
//         event.preventDefault();
//     }
// });

module.exports = router;
