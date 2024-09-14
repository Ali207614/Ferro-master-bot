const { get } = require("lodash")
const { emoji, rolesList, bot, uncategorizedProduct } = require("../config")
const ferroController = require("../controllers/ferroController")
const { infoUser, updateCustom, updateStep, sendMessageHelper, updateUser, updateBack, sleepNow } = require("../helpers")
const { empDynamicBtn } = require("../keyboards/function_keyboards")
const { dataConfirmBtnEmp } = require("../keyboards/inline_keyboards")
const { mainMenuByRoles } = require("../keyboards/keyboards")
const Catalog = require("../models/Catalog")
const User = require("../models/User")
const Question = require("../models/Question")
const { TestInfo, generateTestResultText, generateTestResultTextConfirm } = require("../keyboards/text")
const TestResult = require("../models/TestResult")

let executeBtn = {
    "Orqaga": {
        selfExecuteFn: async ({ chat_id }) => {
            let user = await infoUser({ chat_id })
            updateStep(chat_id, get(user, `back[${user.back.length - 1}].step`, 1))
        },
        middleware: async ({ chat_id }) => {
            let user = await infoUser({ chat_id })
            if (get(user, 'back', []).length == 1) {
                updateCustom(chat_id, { 'in_process': false, updateId: '' })
            }
            if (get(user, 'custom.test.productId')) {
                return false
            }
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
                updateUser(chat_id, {
                    back: get(user, 'back', []).filter((item, i) => i != user.back?.length - 1),
                    custom: { ...get(user, 'custom', {}), productMessageId: '' }
                })
                return await btnBack
            },
        },
    },
}

let adminBtn = {
    "📩 Kirish uchun tasdiqlash": {
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
    "👥 Foydalanuvchilar": {
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
    "🔍 Foydalanuvchini izlash": {
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
    "📋 Test boshqaruvi": {
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

let adminTestManagementBtn = {
    "Keyingi bosqichga o'tish ➡️": {
        selfExecuteFn: async ({ chat_id }) => {
            let user = await infoUser({ chat_id })
            updateBack(chat_id, {
                text: `Agar savolda rasm bo'lsa, rasmni yuboring 📸 yoki keyingi bosqichga o'ting`,
                btn: empDynamicBtn([`Keyingi bosqichga o'tish ➡️`]),
                step: 20
            })
            let text = `✏️ Savolingizni kiriting`
            let btn = empDynamicBtn()
            sendMessageHelper(chat_id, text, btn)
            updateUser(chat_id, {
                user_step: 22,
                custom: { ...get(user, 'custom', {}) }
            })
        },
        middleware: async ({ chat_id }) => {
            let user = await infoUser({ chat_id })
            return get(user, 'job_title') == 'Admin' && get(user, 'confirmed') && get(user, 'user_step') == 21
        },
    },
    "➕ Test qo'shish": {
        selfExecuteFn: async ({ chat_id }) => {
            let user = await infoUser({ chat_id })
            updateBack(chat_id, {
                text: `Menular`,
                btn: empDynamicBtn([`➕ Test qo'shish`, `✏️ O'zgartirish`, `🗑 O'chirish`], 2),
                step: 20
            })
            let text = `Agar savolda rasm bo'lsa, rasmni yuboring 📸 yoki keyingi bosqichga o'ting`
            let btn = empDynamicBtn([`Keyingi bosqichga o'tish ➡️`])
            sendMessageHelper(chat_id, text, btn)
            updateUser(chat_id, {
                user_step: 21,
                custom: { ...get(user, 'custom', {}), productMessageId: '', in_process: true }
            })
        },
        middleware: async ({ chat_id }) => {
            let user = await infoUser({ chat_id })
            return get(user, 'job_title') == 'Admin' && get(user, 'confirmed') && get(user, 'user_step') == 20
        },
    },
    "✏️ O'zgartirish": {
        selfExecuteFn: async ({ chat_id }) => {
            let user = await infoUser({ chat_id })
            let questions = await Question.find({ isDeleted: false, productId: get(user, 'custom.selectedProduct.id') })
            if (questions.length == 0) {
                await sendMessageHelper(chat_id, 'Mavjud emas')
                return
            }
            for (let i = 0; i < questions.length; i++) {
                let btn = await dataConfirmBtnEmp(chat_id, [{ name: `✏️O'zgartirasizmi ?`, id: questions[i].id }], 1, 'updateList')
                let text = TestInfo(questions[i])
                let photo = get(questions[i], 'photo', [])

                if (photo?.length) {
                    try {
                        await bot.sendPhoto(chat_id, get(photo, `[0].file_id`), {
                            caption: text,
                            parse_mode: 'HTML',
                            ...btn
                        });
                    }
                    catch (e) {
                        bot.sendMessage(chat_id, text, { ...btn, parse_mode: 'HTML' });
                    }
                } else {
                    bot.sendMessage(chat_id, text, { ...btn, parse_mode: 'HTML' });
                }
                await sleepNow(300)

            }
        },
        middleware: async ({ chat_id }) => {
            let user = await infoUser({ chat_id })
            return get(user, 'job_title') == 'Admin' && get(user, 'confirmed') && get(user, 'user_step') == 20
        },
    },
    "🗑 O'chirish": {
        selfExecuteFn: async ({ chat_id }) => {
            let user = await infoUser({ chat_id })
            let questions = await Question.find({ isDeleted: false, productId: get(user, 'custom.selectedProduct.id') })
            if (questions.length == 0) {
                await sendMessageHelper(chat_id, 'Mavjud emas')
                return
            }
            for (let i = 0; i < questions.length; i++) {
                let btn = await dataConfirmBtnEmp(chat_id, [{ name: `🗑 O'chirish`, id: questions[i].id }], 1, 'deleteList')
                let text = TestInfo(questions[i])
                let photo = get(questions[i], 'photo', [])

                if (photo?.length) {
                    try {
                        await bot.sendPhoto(chat_id, get(photo, `[0].file_id`), {
                            caption: text,
                            parse_mode: 'HTML',
                            ...btn
                        });
                    }
                    catch (e) {
                        bot.sendMessage(chat_id, text, { ...btn, parse_mode: 'HTML' });
                    }
                } else {
                    bot.sendMessage(chat_id, text, { ...btn, parse_mode: 'HTML' });
                }
                await sleepNow(300)

            }
        },
        middleware: async ({ chat_id }) => {
            let user = await infoUser({ chat_id })
            return get(user, 'job_title') == 'Admin' && get(user, 'confirmed') && get(user, 'user_step') == 20
        },
    },
}


let userBtn = {
    "📦 Mahsulotlar bo'yicha ma'lumot": {
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
            updateCustom(chat_id, { statusBtn: 1, productMessageId: '' })
        },
        middleware: async ({ chat_id }) => {
            let user = await infoUser({ chat_id })
            return get(user, 'job_title') == 'User' && get(user, 'confirmed')
        },
    },
    "📊 Mening natijalarim": {
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
            updateCustom(chat_id, { statusBtn: 2, productMessageId: '' })
        },
        middleware: async ({ chat_id }) => {
            let user = await infoUser({ chat_id })
            return get(user, 'job_title') == 'User' && get(user, 'confirmed')
        },
    },
    "🌐 Umumiy Natijalar": {
        selfExecuteFn: async ({ chat_id }) => {
            let testResult = await TestResult.find({ full: true, confirm: 1 })
            if (testResult.length == 0) {
                return await sendMessageHelper(chat_id, 'Mavjud emas')
            }
            let users = await User.find({ confirmed: true, chat_id: { $in: [...new Set(testResult.map(item => item.chat_id))] } })


            let text = `🌐 Umumiy Natijalar\n\n`
            for (let i = 0; i < users.length; i++) {
                text += `${i + 1} : ${users[i].last_name} ${users[i].first_name}\n`
            }

            await sendMessageHelper(chat_id, text)
        },
        middleware: async ({ chat_id }) => {
            let user = await infoUser({ chat_id })
            return get(user, 'job_title') == 'User' && get(user, 'confirmed')
        },
    },
    "⏳ Yopilmagan Testlar": {
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
            updateCustom(chat_id, { statusBtn: 3, productMessageId: '' })
        },
        middleware: async ({ chat_id }) => {
            let user = await infoUser({ chat_id })
            return get(user, 'job_title') == 'User' && get(user, 'confirmed')
        },
    },
}


let masterBtn = {
    "👥 Foydalanuvchilar": {
        selfExecuteFn: async ({ chat_id }) => {
            let admin = await infoUser({ chat_id })
            let users = await User.find({ confirmed: true, master: admin.emp_id })
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
            return
        },
        middleware: async ({ chat_id }) => {
            let user = await infoUser({ chat_id })
            return get(user, 'job_title') == 'Master' && get(user, 'confirmed')
        },
    },
    "🔍 Foydalanuvchini izlash": {
        selfExecuteFn: async ({ chat_id }) => {
            updateStep(chat_id, 10)
        },
        middleware: async ({ chat_id }) => {
            let user = await infoUser({ chat_id })
            return get(user, 'job_title') == 'Master' && get(user, 'confirmed')
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
    "📊 Test natijalari": {
        selfExecuteFn: async ({ chat_id }) => {
            let admin = await infoUser({ chat_id })
            let users = await User.find({ confirmed: true, master: admin.emp_id });
            let chatIds = users.map(user => user.chat_id);
            let testResult = await TestResult.find({ full: true, confirm: 0, chat_id: { $in: chatIds } });

            if (testResult.length == 0) {
                bot.sendMessage(chat_id, 'Mavjud emas')
                return
            }
            for (let i = 0; i < testResult.length; i++) {
                let finalTex = generateTestResultTextConfirm(
                    {
                        question: testResult[i],
                        totalQuestions: testResult[i].answers.length,
                        answers: testResult[i].answers,
                        startDate: testResult[i].startDate,
                        endDate: testResult[i].endDate,
                        user: users.find(item => item.chat_id == testResult[i].chat_id)
                    },
                )


                let btn = await dataConfirmBtnEmp(chat_id, [{ name: '✅ Ha', id: `1#${testResult[i].test_id}` }, { name: '❌ Bekor qilish', id: `2#${testResult[i].test_id}` }], 2, 'confirmTestResult')

                bot.sendMessage(chat_id, (finalTex), { ...btn, parse_mode: 'HTML' })
            }

        },
        middleware: async ({ chat_id }) => {
            let user = await infoUser({ chat_id })
            return get(user, 'job_title') == 'Master' && get(user, 'confirmed')
        },
    },
}

module.exports = { adminBtn, executeBtn, adminTestManagementBtn, userBtn, masterBtn }