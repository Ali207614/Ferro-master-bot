const { get } = require("lodash")
const { bot, rolesList, emoji } = require("../config")
const { infoUser, updateUser, deleteUser, sendMessageHelper, updateCustom } = require("../helpers")
const { dataConfirmBtnEmp } = require("../keyboards/inline_keyboards")
const { mainMenuByRoles } = require("../keyboards/keyboards")
const { updateUserInfo, newUserInfo, confirmLoginText } = require("../keyboards/text")
const User = require("../models/User")


let adminCallBack = {
    "confirmNewUser": {
        selfExecuteFn: async ({ chat_id, data }) => {
            let newUser = await User.findOne({ chat_id: data[2] })
            let admin = await User.findOne({ chat_id })
            if (newUser) {
                if (get(newUser, 'confirmed') === false) {
                    data[1] == 1 ?
                        await updateUser(data[2], { confirmed: true, custom: { ...get(newUser, 'custom', {}), confirm_admin: chat_id } }) :
                        await deleteUser({ chat_id: data[2] })
                    for (let i = 0; i < get(newUser, 'custom.listAdmin', []).length; i++) {
                        let adminChatId = get(newUser, 'custom.listAdmin', [])[i].chat_id
                        let adminMessageId = get(newUser, 'custom.listAdmin', [])[i].id
                        bot.editMessageText(updateUserInfo(newUser, data[1] == 1, admin), {
                            chat_id: adminChatId,
                            message_id: adminMessageId,
                            parse_mode: 'MarkdownV2'
                        })
                    }
                }
                else {
                    sendMessageHelper(chat_id, `Already Confirmed ✅`)
                }
                return
            }
            sendMessageHelper(chat_id, `Already Rejected ❌`)
            return
        },
        middleware: async ({ chat_id, id }) => {
            let user = await infoUser({ chat_id })
            return get(user, 'job_title') == 'Admin'
        },
    },
    "confirmLoginList": {
        selfExecuteFn: async ({ chat_id, data, msg }) => {
            let newUser = await User.findOne({ chat_id: data[2] })
            let admin = await User.findOne({ chat_id })
            if (newUser) {
                if (get(newUser, 'confirmed') === false) {
                    data[1] == 1 ?
                        await updateUser(data[2], { confirmed: true, custom: { ...get(newUser, 'custom', {}), confirm_admin: chat_id } }) :
                        await deleteUser({ chat_id: data[2] })

                    bot.editMessageText(updateUserInfo(newUser, data[1] == 1, admin), {
                        chat_id: chat_id,
                        message_id: get(msg, 'message.message_id'),
                        parse_mode: 'MarkdownV2'
                    })

                    let users = await User.find({ confirmed: false })
                    let lastMessageId = get(admin, 'custom.updateConfirmListId')
                    let mappedUser = users.map(item => {
                        return { name: `${item.last_name} ${item.first_name} ${emoji[item.job_title]}`, id: item.chat_id, sort: rolesList.indexOf(item.job_title) }
                    }).sort((a, b) => a.sort - b.sort)
                    let pagination = get(admin, 'custom.paginationConfirmList')
                    let btn = await dataConfirmBtnEmp(chat_id, mappedUser, 1, 'loginList', pagination)
                    bot.editMessageText(`Tasdiqlash uchun foydalanuvchilar ro'yxati 📋`, {
                        chat_id,
                        message_id: lastMessageId,
                        parse_mode: 'MarkdownV2',
                        ...btn
                    })

                    bot.sendMessage(data[2], updateUserInfo(newUser, data[1] == 1, admin), await mainMenuByRoles({ chat_id }))
                }
                else {
                    sendMessageHelper(chat_id, `Already Confirmed ✅`)
                }
                return
            }
            sendMessageHelper(chat_id, `Already Rejected ❌`)
            return
        },
        middleware: async ({ chat_id, id }) => {
            let user = await infoUser({ chat_id })
            return get(user, 'job_title') == 'Admin'
        },
    },
    'loginList': {
        selfExecuteFn: async ({ chat_id, data }) => {
            let newUser = await User.findOne({ chat_id: data[1] })
            let admin = await User.findOne({ chat_id })
            if (newUser) {
                if (get(newUser, 'confirmed') === false) {
                    let btn = await dataConfirmBtnEmp(chat_id, [{ name: '✅ Ha', id: `1#${newUser.chat_id}` }, { name: '❌ Bekor qilish', id: `2#${newUser.chat_id}` }], 2, 'confirmLoginList')
                    await bot.sendMessage(chat_id, confirmLoginText(newUser), {
                        parse_mode: 'MarkdownV2',
                        ...btn
                    });
                }
                else {
                    sendMessageHelper(chat_id, `Already Confirmed ✅`)
                }
                return
            }
            sendMessageHelper(chat_id, `Already Rejected ❌`)
            return
        },
        middleware: async ({ chat_id, id }) => {
            let user = await infoUser({ chat_id })
            return get(user, 'job_title') == 'Admin'
        },
    },
    "paginationConfirmLoginList": {
        selfExecuteFn: async ({ chat_id, data }) => {
            let user = await infoUser({ chat_id })
            let users = await User.find({ confirmed: false })
            let lastMessageId = get(user, 'custom.updateConfirmListId')
            let mappedUser = users.map(item => {
                return { name: `${item.last_name} ${item.first_name} ${emoji[item.job_title]}`, id: item.chat_id, sort: rolesList.indexOf(item.job_title) }
            }).sort((a, b) => a.sort - b.sort)
            let pagination = data[1] == 'prev' ? { prev: +data[2] - 10, next: data[2] } : { prev: data[2], next: +data[2] + 10 }
            updateCustom(chat_id, { paginationConfirmList: pagination })
            let btn = await dataConfirmBtnEmp(chat_id, mappedUser, 1, 'loginList', pagination)
            bot.editMessageText(`Tasdiqlash uchun foydalanuvchilar ro'yxati 📋`, {
                chat_id,
                message_id: lastMessageId,
                parse_mode: 'MarkdownV2',
                ...btn
            })
            return
        },
        middleware: async ({ chat_id }) => {
            let user = await infoUser({ chat_id })
            return get(user, 'job_title') == 'Admin' && get(user, 'confirmed')
        },
    },

}

module.exports = {
    adminCallBack
}