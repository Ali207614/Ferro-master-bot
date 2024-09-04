const fs = require("fs");
const { get } = require("lodash");
const path = require("path");
const { bot } = require("../config");
const User = require("../models/User");
const moment = require('moment');



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










async function infoUser({ chat_id }) {
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


async function updateUser(chat_id, userData) {
    let user = await User.findOne({ chat_id })
    Object.assign(user, userData)
    await user.save({ validateBeforeSave: false })
}

async function updateCustom(chat_id, data) {
    let user = await User.findOne({ chat_id })
    Object.assign(user, { custom: { ...get(user, 'custom', {}), ...data } })
    await user.save({ validateBeforeSave: false })
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


function validatePositiveInteger(input) {
    const isValid = /^[1-9]\d*$/.test(input);

    if (isValid) {
        return true;
    } else {
        return false;
    }
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
    validatePositiveInteger
}