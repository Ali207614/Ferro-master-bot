const TelegramAPi = require("node-telegram-bot-api");
const mongoose = require('mongoose');
require('dotenv').config();


let token = process.env.token
// let token = process.env.test_token
const conn_params = {
    // serverNode: process.env.server_node,
    serverNode: process.env.server_node_local,
    uid: process.env.uid,
    pwd: process.env.password,
};

const db = process.env.db

let bot = new TelegramAPi(token, {
    polling: true,
});


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.mongo_url_local);
        // await mongoose.connect(process.env.mongo_url);

        console.log('MongoDBga ulanish muvaffaqiyatli amalga oshirildi');
    } catch (err) {
        console.error('MongoDBga ulanishda xatolik yuz berdi:', err);
        process.exit(1);
    }
};

let personalChatId = '561932032'


let rolesList = ['Admin', 'Master', 'User']
let emojiWithName = {
    'Admin': `🗝️ Admin`,
    'Master': `🛠️ Master`,
    'User': `👤 User`
}
let emoji = {
    'Admin': `🗝️`,
    'Master': `🛠️`,
    'User': `👤`
}

// let uncategorizedProduct = [1003947, 1002442]
let uncategorizedProduct = []

module.exports = { bot, personalChatId, conn_params, db, connectDB, rolesList, emojiWithName, emoji, uncategorizedProduct }


// mongo db ga ulanish

// mongosh  => connect uchun
// show dbs => databaselarni ko'rish uchun
// use Ferro_master => basa ulanish
