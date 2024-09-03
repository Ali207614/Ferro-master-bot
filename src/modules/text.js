const { get } = require("lodash")
const { emoji, rolesList, bot, uncategorizedProduct } = require("../config")
const ferroController = require("../controllers/ferroController")
const { infoUser, updateCustom, updateStep, sendMessageHelper, updateUser } = require("../helpers")
const { dataConfirmBtnEmp } = require("../keyboards/inline_keyboards")
const { mainMenuByRoles } = require("../keyboards/keyboards")
const Catalog = require("../models/Catalog")
const User = require("../models/User")

let executeBtn = {
    "Orqaga": {
        selfExecuteFn: async ({ chat_id }) => {
            let user = await infoUser({ chat_id })
            updateStep(chat_id, get(user, `back[${user.back.length - 1}].step`, 1))
        },
        middleware: async ({ chat_id }) => {
            let user = await infoUser({ chat_id })
            return get(user, 'back', []).length
        },
        next: {
            text: async ({ chat_id }) => {
                let user = await infoUser({ chat_id })
                return get(user, `back[${user.back.length - 1}].text`, 'Assalomu Aleykum')
            },
            btn: async ({ chat_id }) => {
                let user = await infoUser({ chat_id })
                let btnBack = get(user, `back[${user.back.length - 1}].btn`, await mainMenuByRoles({ chat_id }))
                updateUser(chat_id, { back: get(user, 'back', []).filter((item, i) => i != user.back?.length - 1) })
                return await btnBack
            },
        },
    },
}

let adminBtn = {
    "Kirish uchun tasdiqlash 📩": {
        selfExecuteFn: async ({ chat_id }) => {
            let users = await User.find({ confirmed: false })
            updateStep(chat_id, 1)

            if (users.length) {
                let mappedUser = users.map(item => {
                    return { name: `${item.last_name} ${item.first_name} ${emoji[item.job_title]}`, id: item.chat_id, sort: rolesList.indexOf(item.job_title) }
                }).sort((a, b) => a.sort - b.sort)
                let btn = await dataConfirmBtnEmp(chat_id, mappedUser, 1, 'loginList')
                let botId = await bot.sendMessage(chat_id, `Tasdiqlash uchun foydalanuvchilar ro'yxati 📋`, btn)
                updateCustom(chat_id, { updateConfirmListId: botId.message_id })
                return
            }
            let botId = await bot.sendMessage(chat_id, `Mavjud emas`)
        },
        middleware: async ({ chat_id }) => {
            let user = await infoUser({ chat_id })
            return get(user, 'job_title') == 'Admin' && get(user, 'confirmed')
        },
    },
    "Foydalanuvchilar 👥": {
        selfExecuteFn: async ({ chat_id }) => {
            let users = await User.find({ confirmed: true, chat_id: { $ne: chat_id } })
            updateStep(chat_id, 1)
            if (users.length) {
                let mappedUser = users.map(item => {
                    return { name: `${item.last_name} ${item.first_name} ${emoji[item.job_title]}`, id: item.chat_id, sort: rolesList.indexOf(item.job_title) }
                }).sort((a, b) => a.sort - b.sort)
                let btn = await dataConfirmBtnEmp(chat_id, mappedUser, 1, 'userList')
                let botId = await bot.sendMessage(chat_id, `Foydalanuvchilar ro'yxati 📋`, btn)
                updateCustom(chat_id, { updateConfirmListId: botId.message_id })
                return
            }
            let botId = await bot.sendMessage(chat_id, `Mavjud emas`)

        },
        middleware: async ({ chat_id }) => {
            let user = await infoUser({ chat_id })
            return get(user, 'job_title') == 'Admin' && get(user, 'confirmed')
        },
    },
    "Foydalanuvchini izlash 🔍": {
        selfExecuteFn: async ({ chat_id }) => {
            updateStep(chat_id, 10)
        },
        middleware: async ({ chat_id }) => {
            let user = await infoUser({ chat_id })
            return get(user, 'job_title') == 'Admin' && get(user, 'confirmed')
        },
        next: {
            text: ({ chat_id, data }) => {
                return `Foydalanuvchi Ismi yoki ID yoki Telefon Raqamini kiriting`
            },
            btn: async ({ chat_id, data }) => {
                return
            },
        },
    },
    "Test boshqaruvi 📋": {
        selfExecuteFn: async ({ chat_id }) => {
            let catalog = await Catalog.find()
            if (catalog.length == 0) {
                let deleteMessage = await sendMessageHelper(chat_id, 'Loading...')
                let newCatalog = await ferroController.getPageContent()
                let data = get(newCatalog, 'components[0].component.categories', []).map(item => {
                    return { ...item, ...item.category }
                })
                await Catalog.insertMany(data);
                catalog = data
                bot.deleteMessage(chat_id, deleteMessage.message_id)
            }
            let catalogBtn = catalog.map(item => {
                return { name: get(item, 'name.textUzLat'), id: get(item, 'id') }
            }).filter(el => !uncategorizedProduct.includes(el.id))

            let directProduct = catalog.map(item => {
                return { name: get(item, 'name.textUzLat'), id: get(item, 'id') }
            }).filter(el => uncategorizedProduct.includes(el.id))

            let btnCatalog = await dataConfirmBtnEmp(chat_id, catalogBtn, 1, 'catalogAdmin')
            let btnCategory = await dataConfirmBtnEmp(chat_id, directProduct, 1, 'categoriesAdmin')

            let btn = {
                reply_markup: {
                    inline_keyboard: [...get(btnCatalog, 'reply_markup.inline_keyboard', []), ...get(btnCategory, 'reply_markup.inline_keyboard', [])].filter(item => item[0].callback_data != 'backToCatalog'),
                    resize_keyboard: true
                }
            }
            sendMessageHelper(chat_id, `Mahsulotlar katalogi 🔧`, btn)
        },
        middleware: async ({ chat_id }) => {
            let user = await infoUser({ chat_id })
            return get(user, 'job_title') == 'Admin' && get(user, 'confirmed')
        },
    },

}

module.exports = { adminBtn, executeBtn }