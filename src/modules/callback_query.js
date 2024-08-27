const { get } = require("lodash")
const { bot, rolesList, emoji } = require("../config")
const { infoUser, updateUser, deleteUser, sendMessageHelper, updateCustom } = require("../helpers")
const { dataConfirmBtnEmp } = require("../keyboards/inline_keyboards")
const { mainMenuByRoles, option } = require("../keyboards/keyboards")
const { updateUserInfo, newUserInfo, confirmLoginText, userDeleteInfo } = require("../keyboards/text")
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
    "confirmDeleteUser": {
        selfExecuteFn: async ({ chat_id, data, msg }) => {
            let newUser = await User.findOne({ chat_id: data[2] })
            let admin = await User.findOne({ chat_id })
            if (newUser) {
                if (data[1] == 2) {
                    bot.deleteMessage(chat_id, get(msg, 'message.message_id'))
                    return
                }
                await deleteUser({ chat_id: data[2] })
                bot.editMessageText(userDeleteInfo(newUser, admin), {
                    chat_id: chat_id,
                    message_id: get(msg, 'message.message_id'),
                    parse_mode: 'MarkdownV2'
                })

                let users = await User.find({ confirmed: true, chat_id: { $ne: chat_id } })
                let lastMessageId = get(admin, 'custom.updateConfirmListId')
                let mappedUser = users.map(item => {
                    return { name: `${item.last_name} ${item.first_name} ${emoji[item.job_title]}`, id: item.chat_id, sort: rolesList.indexOf(item.job_title) }
                }).sort((a, b) => a.sort - b.sort)
                let pagination = get(admin, 'custom.paginationConfirmList')
                let btn = await dataConfirmBtnEmp(chat_id, mappedUser, 1, 'userList', pagination)
                bot.editMessageText(`Foydalanuvchilar ro'yxati 📋`, {
                    chat_id,
                    message_id: lastMessageId,
                    parse_mode: 'MarkdownV2',
                    ...btn
                })

                bot.sendMessage(data[2], userDeleteInfo(newUser, admin), option)

                return
            }
            sendMessageHelper(chat_id, `Already Deleted ❌`)
            return
        },
        middleware: async ({ chat_id, id }) => {
            let user = await infoUser({ chat_id })
            return get(user, 'job_title') == 'Admin'
        },
    },

    "confirmDeleteUserSearch": {
        selfExecuteFn: async ({ chat_id, data, msg }) => {
            let newUser = await User.findOne({ chat_id: data[2] })
            let admin = await User.findOne({ chat_id })
            if (newUser) {
                if (data[1] == 2) {
                    bot.deleteMessage(chat_id, get(msg, 'message.message_id'))
                    return
                }
                await deleteUser({ chat_id: data[2] })
                bot.editMessageText(userDeleteInfo(newUser, admin), {
                    chat_id: chat_id,
                    message_id: get(msg, 'message.message_id'),
                    parse_mode: 'MarkdownV2'
                })

                let users = await User.find({
                    confirmed: true,
                    chat_id: { $ne: chat_id },
                    $or: [
                        { first_name: { $regex: get(admin, 'custom.search'), $options: 'i' } },
                        { last_name: { $regex: get(admin, 'custom.search'), $options: 'i' } },
                        { emp_id: isNaN(get(admin, 'custom.search')) ? undefined : get(admin, 'custom.search') },
                        { mobile: { $regex: get(admin, 'custom.search'), $options: 'i' } }
                    ]
                }).lean();
                let lastMessageId = get(admin, 'custom.updateConfirmListId')
                let mappedUser = users.map(item => {
                    return { name: `${item.last_name} ${item.first_name} ${emoji[item.job_title]}`, id: item.chat_id, sort: rolesList.indexOf(item.job_title) }
                }).sort((a, b) => a.sort - b.sort)
                let pagination = get(admin, 'custom.paginationConfirmList')
                let btn = await dataConfirmBtnEmp(chat_id, mappedUser, 1, 'userListSearch', pagination)
                bot.editMessageText(`Foydalanuvchilar ro'yxati 📋`, {
                    chat_id,
                    message_id: lastMessageId,
                    parse_mode: 'MarkdownV2',
                    ...btn
                })

                bot.sendMessage(data[2], userDeleteInfo(newUser, admin), option)

                return
            }
            sendMessageHelper(chat_id, `Already Deleted ❌`)
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
    'userList': {
        selfExecuteFn: async ({ chat_id, data }) => {
            let newUser = await User.findOne({ chat_id: data[1] })
            let admin = await User.findOne({ chat_id })
            if (newUser) {
                let btn = await dataConfirmBtnEmp(chat_id, [{ name: "🗑 O'chirish", id: `1#${newUser.chat_id}` }, { name: '❌ Bekor qilish', id: `2#${newUser.chat_id}` }], 2, 'confirmDeleteUser')
                await bot.sendMessage(chat_id, confirmLoginText(newUser), {
                    parse_mode: 'MarkdownV2',
                    ...btn
                });
                return
            }
            sendMessageHelper(chat_id, `Already Deleted ❌`)
            return
        },
        middleware: async ({ chat_id, id }) => {
            let user = await infoUser({ chat_id })
            return get(user, 'job_title') == 'Admin'
        },
    },

    'userListSearch': {
        selfExecuteFn: async ({ chat_id, data }) => {
            let newUser = await User.findOne({ chat_id: data[1] })
            let admin = await User.findOne({ chat_id })
            if (newUser) {
                let btn = await dataConfirmBtnEmp(chat_id, [{ name: "🗑 O'chirish", id: `1#${newUser.chat_id}` }, { name: '❌ Bekor qilish', id: `2#${newUser.chat_id}` }], 2, 'confirmDeleteUserSearch')
                await bot.sendMessage(chat_id, confirmLoginText(newUser), {
                    parse_mode: 'MarkdownV2',
                    ...btn
                });
                return
            }
            sendMessageHelper(chat_id, `Already Deleted ❌`)
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
    "paginationUserList": {
        selfExecuteFn: async ({ chat_id, data }) => {
            let user = await infoUser({ chat_id })
            let users = await User.find({ confirmed: true, chat_id: { $ne: chat_id } })
            let lastMessageId = get(user, 'custom.updateConfirmListId')
            let mappedUser = users.map(item => {
                return { name: `${item.last_name} ${item.first_name} ${emoji[item.job_title]}`, id: item.chat_id, sort: rolesList.indexOf(item.job_title) }
            }).sort((a, b) => a.sort - b.sort)
            let pagination = data[1] == 'prev' ? { prev: +data[2] - 10, next: data[2] } : { prev: data[2], next: +data[2] + 10 }
            updateCustom(chat_id, { paginationConfirmList: pagination })
            let btn = await dataConfirmBtnEmp(chat_id, mappedUser, 1, 'userList', pagination)
            bot.editMessageText(`Foydalanuvchilar ro'yxati 📋`, {
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

    "paginationUserListSearch": {
        selfExecuteFn: async ({ chat_id, data }) => {
            let user = await infoUser({ chat_id })
            let users = await User.find({
                confirmed: true,
                chat_id: { $ne: chat_id },
                $or: [
                    { first_name: { $regex: get(user, 'custom.search'), $options: 'i' } },
                    { last_name: { $regex: get(user, 'custom.search'), $options: 'i' } },
                    { emp_id: isNaN(get(user, 'custom.search')) ? undefined : get(user, 'custom.search') },
                    { mobile: { $regex: get(user, 'custom.search'), $options: 'i' } }
                ]
            }).lean();
            let lastMessageId = get(user, 'custom.updateConfirmListId')
            let mappedUser = users.map(item => {
                return { name: `${item.last_name} ${item.first_name} ${emoji[item.job_title]}`, id: item.chat_id, sort: rolesList.indexOf(item.job_title) }
            }).sort((a, b) => a.sort - b.sort)
            let pagination = data[1] == 'prev' ? { prev: +data[2] - 10, next: data[2] } : { prev: data[2], next: +data[2] + 10 }
            updateCustom(chat_id, { paginationConfirmList: pagination })
            let btn = await dataConfirmBtnEmp(chat_id, mappedUser, 1, 'userListSearch', pagination)
            bot.editMessageText(`Foydalanuvchilar ro'yxati 📋`, {
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