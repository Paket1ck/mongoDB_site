//Регистрация пользователя
const bcrypt = require('bcryptjs')
const User = require('../models/users'); //модель пользователя

async function register (req, res) {
    const { email, password } = req.body;

    //Проверка заполнения поля
    if (!email || !password) {
        return res.status(400).send('Введите email и пароль');
    }

    //Проверка что пользователь не зарегистрирован
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).send('Пользователь с таким email уже зарегистрирован');
    }

    //хешируем пароль
    const hashedPassword = bcrypt.hashSync(password, 10);

    //создание нового пользователя
    const user = new User({
        email,
        password: hashedPassword,
    });

    //сохранения нового пользователя в базу данных
    try{
        await user.save();
        res.send('Вы успешно зарегистрировались');
    } catch (err) {
        res.status(500).send('Ошибка при сохранении пользователя в базе данных');
    }
}

module.exports = {
    register
};