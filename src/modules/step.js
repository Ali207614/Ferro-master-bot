const { get } = require("lodash");
const { bot, rolesList, emoji } = require("../config");
const { infoUser, sendMessageHelper, updateUser, updateCustom } = require("../helpers")
const { dataConfirmBtnEmp } = require("../keyboards/inline_keyboards");
const User = require("../models/User");

let adminText = {
    "10": {
        selfExecuteFn: async ({ chat_id, msgText }) => {
            let users = await User.find({
                confirmed: true,
                chat_id: { $ne: chat_id },
                $or: [
                    { first_name: { $regex: msgText, $options: 'i' } },
                    { last_name: { $regex: msgText, $options: 'i' } },
                    { emp_id: isNaN(msgText) ? undefined : msgText },
                    { mobile: { $regex: msgText, $options: 'i' } }
                ]
            }).lean();
            updateCustom(chat_id, { search: msgText })
            if (users.length) {
                let mappedUser = users.map(item => {
                    return { name: `${item.last_name} ${item.first_name} ${emoji[item.job_title]}`, id: item.chat_id, sort: rolesList.indexOf(item.job_title) }
                }).sort((a, b) => a.sort - b.sort)
                let btn = await dataConfirmBtnEmp(chat_id, mappedUser, 1, 'userListSearch')
                let botId = await bot.sendMessage(chat_id, `Foydalanuvchilar ro'yxati 📋`, btn)
                updateCustom(chat_id, { updateConfirmListId: botId.message_id })
                return
            }
            let botId = await bot.sendMessage(chat_id, `Mavjud emas`)
            return
        },
        middleware: async ({ chat_id }) => {
            let user = await infoUser({ chat_id })
            return get(user, 'job_title') == 'Admin' && get(user, 'confirmed') && get(user, 'user_step') == 10
        },
    },
}

module.exports = { adminText }