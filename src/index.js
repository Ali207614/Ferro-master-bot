
const fs = require("fs").promises
const path = require('path')
const { bot, personalChatId, conn_params, connectDB, resetAllModels } = require("./config");
const botController = require("./controllers/botController");
const hanaClient = require("@sap/hana-client");
require('dotenv').config();
let tls = require('tls');
const { sendMessageHelper } = require("./helpers");
const cron = require('node-cron');


const start = async () => {
    try {
        bot.setMyCommands([
            { command: "/start", description: "start" },
            { command: "/logout", description: "chiqish" },
        ]);
        connectDB();

        const connection = hanaClient.createConnection();
        connection.connect(conn_params, async (err) => {
            if (err) {
                bot.sendMessage(personalChatId, `Connection error ${err}`);
            } else {
                bot.on("text", async (msg) => {
                    try {
                        let chat_id = msg.chat.id;
                        await botController.text(msg, chat_id)
                    } catch (err) {
                        bot.sendMessage(personalChatId, `${err} err text`);
                    }
                });

                bot.on("callback_query", async (msg) => {
                    try {
                        let chat_id = msg.message.chat.id;
                        let data = msg.data.split("#");
                        await botController.callback_query(msg, data, chat_id)
                    } catch (err) {
                        bot.sendMessage(personalChatId, `${err} err callback`);
                    }
                });


                bot.on("contact", async (msg) => {
                    try {
                        let chat_id = msg.chat.id;
                        await botController.contact(msg, chat_id)
                    } catch (err) {
                        bot.sendMessage(personalChatId, `${err} err contact`);
                    }
                });

                bot.on("photo", async (msg) => {
                    try {
                        let chat_id = msg.chat.id;
                        await botController.photo(msg, chat_id)
                    } catch (err) {
                        sendMessageHelper(personalChatId, `${err} err file`);
                    }
                });
            }
        });
        global.connection = connection;

    } catch (err) {
        bot.sendMessage(personalChatId, `${err} katta`);
    }
};

start();


cron.schedule('0 0 * * *', async () => {
    try {
        resetAllModels()
    } catch (error) {
        console.error('Elementlarni o\'chirishda xatolik:', error);
    }
});



