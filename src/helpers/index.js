const fs = require("fs");
const { get } = require("lodash");
const path = require("path");
const { bot, uncategorizedProduct } = require("../config");
const User = require("../models/User");
const moment = require('moment');
const Question = require("../models/Question");
const { empDynamicBtn } = require("../keyboards/function_keyboards");
const { dataConfirmBtnEmp } = require("../keyboards/inline_keyboards");


function formatterCurrency(
    number = 0,
    currency = "UZS",
    locale = "ru",
    maximumSignificantDigits = 10
) {
    return number.toLocaleString(locale, {
        style: "currency",
        currency: currency,
        maximumSignificantDigits: maximumSignificantDigits,
    });
}










const infoUser = async ({ chat_id }) => {
    return await User.findOne({ chat_id })
}
async function deleteUser({ chat_id }) {
    return await User.deleteOne({ chat_id });
}


async function updateBack(chat_id, userData) {
    let user = await User.findOne({ chat_id })
    let last = user.back.slice(-1)[0]
    if (!last || (last.step != userData.step)) {
        user.back = [...user?.back, userData];
    }
    await user.save({ validateBeforeSave: false })
}



async function updateStep(chat_id = '', user_step = 1) {
    let user = await User.findOne({ chat_id })
    user.user_step = user_step
    await user.save({ validateBeforeSave: false })
}


const updateUser = async (chat_id, userData) => {
    let user = await User.findOne({ chat_id })
    Object.assign(user, userData)
    await user.save({ validateBeforeSave: false })
}

async function updateCustom(chat_id, data) {
    let user = await User.findOne({ chat_id })
    Object.assign(user, { custom: { ...get(user, 'custom', {}), ...data } })
    await user.save({ validateBeforeSave: false })
}

async function updateQuestion(id, data) {
    let question = await Question.findOne({ id })
    Object.assign(question, { ...data })
    await question.save({ validateBeforeSave: false })
}

function parseDate(dateStr) {
    const [year, month, day] = dateStr.split('.').map(Number);
    return new Date(Date.UTC(year, month - 1, day)); // Date.UTC yil, oy (0-indexed), kun
}

async function sendMessageHelper(...arg) {
    let file = arg.find(item => get(item, 'file'))
    if (file) {
        let [chat_id, text, btn] = arg.filter(item => !get(item, 'file'))
        return await bot.sendDocument(chat_id, get(file, 'file.document.file_id'), {
            caption: text,
            reply_markup: btn?.reply_markup
        })
    }

    return await bot.sendMessage(...arg)
}

function formatLocalDateToISOString(date) {
    const pad = (n) => (n < 10 ? '0' + n : n);

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    const milliseconds = date.getMilliseconds().toString().padStart(3, '0');

    // Get the timezone offset in hours and minutes
    const offset = -date.getTimezoneOffset();
    const offsetSign = offset >= 0 ? '+' : '-';
    const offsetHours = pad(Math.floor(Math.abs(offset) / 60));
    const offsetMinutes = pad(Math.abs(offset) % 60);

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${offsetSign}${offsetHours}:${offsetMinutes}`;
}

function saveTextToFile(text, fileName, folderPath) {
    const fullPath = path.join(folderPath, fileName);

    // Agar fayl mavjud bo'lsa, uni qayta yozmaymiz
    if (fs.existsSync(fullPath)) {
        console.log(`${fileName} fayli allaqachon mavjud.`);
        return fullPath;
    }

    // Papka mavjudligini tekshirish, agar mavjud bo'lmasa, yaratish
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }

    // Faylni yozish
    fs.writeFileSync(fullPath, text);
    console.log(`${fileName} fayli saqlandi.`);
    return fullPath;
}


let executeUpdateFn = (key) => {
    let obj = {
        "updatePicture": {
            step: 21,
            text: `Yangi rasmni yuboring 📸`,
        },
        "updateAnswerText": {
            step: 22,
            text: '✏️ Savolingizni kiriting',
            btn: empDynamicBtn()
        },
        "updateAnswerList": {
            step: 23,
            text: `Javoblar soni nechta bo'ladi?`,
            btn: empDynamicBtn()
        },
    }
    return obj[key]
}


function validatePositiveInteger(input) {
    const isValid = /^[1-9]\d*$/.test(input);

    if (isValid) {
        return true;
    } else {
        return false;
    }
}


let updateThenFn = async (id) => {
    let question = await Question.findOne({ id })
    let chat_id = get(question, "chat_id")
    let user = await User.findOne({ chat_id })
    if (user) {
        let categories = get(user, 'custom.categories', [])
        let productList = get(user, 'custom.product', [])
        let textCatalog = `*🛠️ Mahsulotni tanlang*\n\n` +
            `*🔍 Mahsulot joyi*: \`${get(categories, 'name.textUzLat', '')} > ${get(productList, '[0].category.name.textUzLat')}\`\n\n` +
            `Iltimos, quyidagi mahsulotlardan birini tanlang:`

        let productBtn = productList.filter(item => !item.isDisabled).map(item => {
            return { name: get(item, 'name.textUzLat', '-'), id: get(item, 'id') }
        })

        let btnCatalog = await dataConfirmBtnEmp(chat_id, productBtn, 2, 'productAdmin')
        if (uncategorizedProduct.includes(Number(get(productList, '[0].category.id', '0')))) {
            btnCatalog.reply_markup.inline_keyboard = [...btnCatalog.reply_markup.inline_keyboard.filter(item => item[0].callback_data != 'backToCategory'), [{
                text: `🔙 Katalogga qaytish`,
                callback_data: 'backToCatalog'
            }]]
        }

        sendMessageHelper(chat_id, textCatalog, { ...btnCatalog, parse_mode: 'MarkdownV2' })
    }

}
const sleepNow = (delay) =>
    new Promise((resolve) => setTimeout(resolve, delay));


function filterAndShuffleQuestions(questions, excludedIds = []) {
    excludedIds = excludedIds.map(item => Number(item))
    const filteredQuestions = questions.filter(q => !excludedIds.includes(q.id));

    // 2. Tasodifiy joylashtiramiz (shuffle)
    for (let i = filteredQuestions.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [filteredQuestions[i], filteredQuestions[randomIndex]] = [filteredQuestions[randomIndex], filteredQuestions[i]];
    }

    return filteredQuestions;
}




module.exports = {
    parseDate,
    formatLocalDateToISOString,
    formatterCurrency,
    sendMessageHelper,
    updateStep,
    infoUser,
    updateBack,
    updateUser,
    updateCustom,
    deleteUser,
    validatePositiveInteger,
    executeUpdateFn,
    updateQuestion,
    updateThenFn,
    sleepNow,
    filterAndShuffleQuestions,
    saveTextToFile,
}