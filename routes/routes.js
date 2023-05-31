const express =  require('express');
const router = express.Router();
const User = require('../models/users');
const bcrypt = require('bcryptjs');

const dashboardRoutes = require('./dashboardRoutes');
const indexRoutes = require('./indexRoutes');
const loginRoutes = require('./loginRoutes');
const logoutRoutes = require('./logoutRoutes');
const registerRoutes = require('./registerRoutes');
const addNewsRoutes = require('./addNewsRoutes');
const editNewsRoutes = require('./editRoutes');

router.use('/', indexRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/login', loginRoutes);
router.use('/logout', logoutRoutes);
router.use('/register', registerRoutes);
router.use('/dashboard', addNewsRoutes);
// router.use('/dashboard', editNewsRoutes);

module.exports = router;