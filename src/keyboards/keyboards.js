const { get } = require("lodash");
const User = require("../models/User");

const option = {
    parse_mode: "Markdown",
    reply_markup: {
        resize_keyboard: true,
        keyboard: [
            [
                {
                    text: "Telefon raqam jo'natish",
                    request_contact: true,
                },
            ],
            ["Bekor qilish"],
        ],
    },
};


const adminBtn = {
    parse_mode: "Markdown",
    reply_markup: {
        resize_keyboard: true,
        keyboard: [
            [
                {
                    text: "Foydalanuvchilar",
                },
                {
                    text: "Testlar",
                },
            ],
            [
                {
                    text: "Foydalanuvchini izlash",
                },

                {
                    text: "Tasdiqlash login",
                },
            ],
        ],
    },
};

const masterBtn = {
    parse_mode: "Markdown",
    reply_markup: {
        resize_keyboard: true,
        keyboard: [
            [
                {
                    text: "Master shifu",
                },
            ],
        ],
    },
};

const userBtn = {
    parse_mode: "Markdown",
    reply_markup: {
        resize_keyboard: true,
        keyboard: [
            [
                {
                    text: "User",
                },
            ],
        ],
    },
};

let rolesKeyboard = {
    'Admin': adminBtn,
    'Master': masterBtn,
    'User': userBtn,
}



const mainMenuByRoles = async ({ chat_id }) => {
    const user = await User.findOne({ chat_id });
    return rolesKeyboard[get(user, 'job_title')]
}



module.exports = { option, mainMenuByRoles }