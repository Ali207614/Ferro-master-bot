const { get } = require("lodash");
let { bot, rolesList } = require("../config");
const { infoUser, sendMessageHelper, updateCustom, updateUser } = require("../helpers");
const { dataConfirmBtnEmp } = require("../keyboards/inline_keyboards");
const { option, mainMenuByRoles } = require("../keyboards/keyboards");
const { newUserInfo } = require("../keyboards/text");
const User = require("../models/User");
const { adminCallBack, adminTestManagement } = require("../modules/callback_query");
const { adminText } = require("../modules/step");
const { adminBtn } = require("../modules/text");
const b1Controller = require('./b1Controller')

class botConroller {
    async text(msg, chat_id) {
        try {
            let user = await infoUser({ chat_id });
            if (get(user, 'confirmed') === false) {
                sendMessageHelper(chat_id, "Tasdiqlash uchun Adminga jo'natilgan", option)
                return
            }
            let btnTree = {
                ...adminBtn,
            }
            let stepTree = {
                ...adminText
            }
            if (msg.text == "/start") {
                sendMessageHelper(
                    chat_id,
                    "Assalomu Aleykum",
                    get(user, 'confirmed') ? await mainMenuByRoles({ chat_id }) : option
                );
                return
            }
            else if (msg.text == '/info') {

            }
            else if (
                btnTree[msg.text] && get(user, "user_step", 0) >= 1
            ) {
                let btnTreeList = [
                    adminBtn
                ]
                let execute = btnTreeList.find(item => item[msg.text] && item[msg.text]?.middleware({ chat_id, msgText: msg.text }))
                execute = execute ? execute[msg.text] : {}
                if (await get(execute, 'middleware', () => { })({ chat_id, msgText: msg.text })) {
                    await execute?.selfExecuteFn ? await execute.selfExecuteFn({ chat_id }) : undefined
                    if (execute?.next) {
                        let textBot = await execute?.next?.text({ chat_id })
                        let btnBot = await execute?.next?.btn ? await execute?.next?.btn({ chat_id, msg }) : undefined
                        let botInfo = await execute?.next?.file ? bot.sendDocument(chat_id, await execute?.next?.file({ chat_id }), btnBot) :
                            sendMessageHelper(chat_id, textBot, btnBot)
                        let lastMessageId = await botInfo
                        updateUser(chat_id, { lastMessageId: lastMessageId?.message_id })
                    }
                }
            }
            else if (
                stepTree[get(user, 'user_step', '1').toString()]
            ) {
                let execute = stepTree[get(user, 'user_step', '1').toString()]
                if (await get(execute, 'middleware', () => { })({ chat_id, msgText: msg.tex })) {
                    await execute?.selfExecuteFn ? await execute.selfExecuteFn({ chat_id, msgText: msg.text }) : undefined
                    if (execute?.next) {
                        let textBot = await execute?.next?.text({ chat_id, data })
                        let btnBot = await execute?.next?.btn ? await execute?.next?.btn({ chat_id, data, msg }) : undefined
                        let botInfo = await execute?.next?.file ? bot.sendDocument(chat_id, await execute?.next?.file({ chat_id }), btnBot) :
                            sendMessageHelper(chat_id, textBot, btnBot)
                        let lastMessageId = await botInfo
                        updateUser(chat_id, { lastMessageId: lastMessageId?.message_id })
                    }
                }
            }
        }
        catch (err) {
            console.log(err, ' bu err text')
            throw new Error(err);
        }
    }

    async callback_query(msg, data, chat_id) {
        try {
            let user = await infoUser({ chat_id });
            if (get(user, 'confirmed') === false) {
                sendMessageHelper(chat_id, "Tasdiqlash uchun Adminga jo'natilgan", option)
                return
            }
            let callbackTree = {
                ...adminCallBack,
                ...adminTestManagement
            }
            if (user) {
                if (callbackTree[data[0]]) {
                    let callbackTreeList = [
                        adminCallBack,
                        adminTestManagement
                    ]
                    let execute = callbackTreeList.find(item => item[data[0]] && item[data[0]]?.middleware({ chat_id, data, msgText: msg.text, id: get(msg, 'message.message_id', 0) }))
                    execute = execute ? execute[data[0]] : {}
                    if (get(execute, 'middleware', () => { })({ chat_id, data, msgText: msg.text, id: get(msg, 'message.message_id', 0) })) {
                        await execute?.selfExecuteFn ? await execute.selfExecuteFn({ chat_id, data, msg }) : undefined
                        if (execute?.next) {
                            let textBot = await execute?.next?.text({ chat_id, data })
                            let btnBot = await execute?.next?.btn ? await execute?.next?.btn({ chat_id, data, msg }) : undefined

                            let botInfo = await execute?.next?.update ? bot.editMessageText(await execute?.next?.text({ chat_id, data }), { chat_id, message_id: +user.lastMessageId, ...(await execute?.next?.btn ? await execute?.next?.btn({ chat_id, data, msg }) : undefined) }) : (await execute?.next?.file ? bot.sendDocument(chat_id, await execute?.next?.file({ chat_id, data }), await execute?.next?.btn ? await execute?.next?.btn({ chat_id, data, msg }) : undefined) :
                                sendMessageHelper(chat_id, textBot, btnBot))
                            let botId = await botInfo
                            updateUser(chat_id, { lastMessageId: botId.message_id })
                        }
                    }
                }
            }
        } catch (err) {
            console.log(err, ' bu err calback')
            throw new Error(err);
        }
    }

    async contact(msg, chat_id) {
        try {
            let user = await infoUser({ chat_id });
            if (user) {
                let isConfirm = get(user, 'confirmed')
                let text = isConfirm ? `Assalomu Aleykum` : `Tasdiqlash uchun Adminga jo'natilgan`
                let btn = isConfirm ? mainMenuByRoles({ chat_id }) : option
                sendMessageHelper(chat_id, text, btn)
                return
            }
            let phone = get(msg, "contact.phone_number", "").replace(/\D/g, "");
            let deleteMessage = await sendMessageHelper(chat_id, 'Loading...')
            let sap_user = await b1Controller.getBusinessPartnerByPhone(phone);

            if (sap_user.length == 1) {
                if (!rolesList.includes(sap_user[0].jobTitle)) {
                    sendMessageHelper(chat_id, 'Job title xato kiritilgan', option)
                    return
                }
                const newUser = new User({
                    chat_id: chat_id,
                    job_title: sap_user[0].jobTitle,
                    user_step: 1,
                    mobile: sap_user[0].mobile,
                    emp_id: sap_user[0].empID,
                    first_name: sap_user[0].firstName,
                    last_name: sap_user[0].lastName,
                    back: [],
                    lastMessageId: ''
                });
                await newUser.save();

                bot.deleteMessage(chat_id, deleteMessage.message_id)

                const admins = await User.find({
                    job_title: 'Admin',
                    confirmed: true,
                    chat_id: { $ne: chat_id }
                }, 'chat_id')
                let listAdmin = []
                for (let i = 0; i < admins.length; i++) {
                    let btn = await dataConfirmBtnEmp(chat_id, [{ name: '✅ Ha', id: `1#${chat_id}` }, { name: '❌ Bekor qilish', id: `2#${chat_id}` }], 2, 'confirmNewUser')
                    let botId = await bot.sendMessage(admins[i].chat_id, newUserInfo(sap_user, newUser), {
                        parse_mode: 'MarkdownV2',
                        ...btn
                    });
                    listAdmin.push({ id: botId.message_id, chat_id: admins[i].chat_id })
                }
                if (listAdmin.length) {
                    await updateCustom(chat_id, { listAdmin })
                }
                sendMessageHelper(
                    chat_id,
                    "Adminga tasdiqlash uchun jo'natildi ⏳",
                    option
                );

                return
            }
            else {
                bot.deleteMessage(chat_id, deleteMessage.message_id)

                sendMessageHelper(chat_id, "Foydalanuvchi tasdiqlanmadi (SAP da mavjud emas yokida raqamlar ikkita) ❌", option);
                return
            }
        } catch (err) {
            throw new Error(err);
        }
    }

}

module.exports = new botConroller();

