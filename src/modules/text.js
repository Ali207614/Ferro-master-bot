const { get } = require("lodash")
const { emoji, rolesList, bot } = require("../config")
const { infoUser, updateCustom } = require("../helpers")
const { dataConfirmBtnEmp } = require("../keyboards/inline_keyboards")
const User = require("../models/User")

let adminBtn = {
    "Kirish uchun tasdiqlash 📩": {
        selfExecuteFn: async ({ chat_id }) => {
            let users = await User.find({ confirmed: false })
            let mappedUser = users.map(item => {
                return { name: `${item.last_name} ${item.first_name} ${emoji[item.job_title]}`, id: item.chat_id, sort: rolesList.indexOf(item.job_title) }
            }).sort((a, b) => a.sort - b.sort)
            let btn = await dataConfirmBtnEmp(chat_id, mappedUser, 1, 'loginList')
            let botId = await bot.sendMessage(chat_id, `Tasdiqlash uchun foydalanuvchilar ro'yxati 📋`, btn)
            updateCustom(chat_id, { updateConfirmListId: botId.message_id })
        },
        middleware: async ({ chat_id }) => {
            let user = await infoUser({ chat_id })
            return get(user, 'user_step') == 1 && get(user, 'job_title') == 'Admin' && get(user, 'confirmed')
        },
    },
}

module.exports = { adminBtn }