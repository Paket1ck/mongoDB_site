const express =  require('express');
const mongoose = require('mongoose');
const app = express();
const User = require('../models/users')
const bcrypt = require('bcryptjs')
//Вход в систему
async function login (req, res) {
    const { email, password} = req.body;

    //проверка заполниности обоих полей
    if (!email || !password) {
        return res.status(400).send('Введите email и пароль');
    }

    //поиск пользователя по email
    const user = await User.findOne({ email });

    //проверка подлинности пароля
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
        return res.status(400).send('неверный email или пароль');
    }

    //добавление информации об авторизации пользователя в сессию
    req.session.isAuthenticated = true;
    req.session.user = {
        _id: user._id,
        email: user.email,
        role: user.role
    };

    //перенаправление на главную страницу
    res.redirect('/');
};

module.exports = {
    login
};