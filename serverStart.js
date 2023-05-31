//функция для запуска БД и сервера
const express =  require('express');
const mongoose = require('mongoose');
const app = express();

async function start() {
    const uri = process.env.MONGODB_URI;
    console.log(uri)
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    app.listen(3000, () => {
        console.log('Сервер запущен на порту 3000');
    });
}

start();