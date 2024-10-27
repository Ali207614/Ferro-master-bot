const { get } = require("lodash")
const { bot, rolesList, emoji, uncategorizedProduct } = require("../config")
const ferroController = require("../controllers/ferroController")
const { generateTestResultExcel } = require("../excel")
const { infoUser, updateUser, deleteUser, sendMessageHelper, updateCustom, updateBack, updateStep, executeUpdateFn, updateThenFn, sleepNow, updateQuestion, filterAndShuffleQuestions } = require("../helpers")
const { empDynamicBtn } = require("../keyboards/function_keyboards")
const { dataConfirmBtnEmp } = require("../keyboards/inline_keyboards")
const { mainMenuByRoles, option, adminBtn } = require("../keyboards/keyboards")
const { updateUserInfo, newUserInfo, confirmLoginText, userDeleteInfo, TestAdminInfo, TestInfo, generateProductText, generateTestText, escapeMarkdown, generateTestResultText, generateTestResultTextConfirm, updateUserInfoMaster } = require("../keyboards/text")
const Catalog = require("../models/Catalog")
const ChildProduct = require("../models/ChildProduct")
const Product = require("../models/Product")
const Question = require("../models/Question")
const TestResult = require("../models/TestResult")
const User = require("../models/User")
require('dotenv').config();


let adminCallBack = {
    "confirmNewUser": {
        selfExecuteFn: async ({ chat_id, data }) => {
            let admin = await User.findOne({ chat_id })
            if (!(get(admin, 'job_title') == 'Admin')) {
                return
            }
            let newUser = await User.findOne({ chat_id: data[2] })
            if (newUser) {
                if (get(newUser, 'confirmed') === false) {
                    data[1] == 1 ?
                        await updateUser(data[2], { confirmed: true, custom: { ...get(newUser, 'custom', {}), confirm_admin: chat_id } }) :
                        await deleteUser({ chat_id: data[2] })


                    let master = await User.findOne({ emp_id: get(newUser, 'master') })
                    if (master && data[1] == 1) {
                        bot.sendMessage(get(master, 'chat_id'), updateUserInfoMaster(newUser, data[1] == 1, admin), { parse_mode: 'MarkdownV2' })
                    }

                    for (let i = 0; i < get(newUser, 'custom.listAdmin', []).length; i++) {
                        let adminChatId = get(newUser, 'custom.listAdmin', [])[i].chat_id
                        let adminMessageId = get(newUser, 'custom.listAdmin', [])[i].id
                        bot.editMessageText(updateUserInfo(newUser, data[1] == 1, admin), {
                            chat_id: adminChatId,
                            message_id: adminMessageId,
                            parse_mode: 'MarkdownV2'
                        })
                    }
                    let btn = data[1] == 1 ? await mainMenuByRoles({ chat_id: newUser.chat_id }) : option
                    let text = updateUserInfo(newUser, data[1] == 1, admin)
                    bot.sendMessage(data[2], text, btn)
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
            return true
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

                    let master = await User.findOne({ emp_id: get(newUser, 'master') })
                    if (master && data[1] == 1) {
                        bot.sendMessage(get(master, 'chat_id'), updateUserInfoMaster(newUser, data[1] == 1, admin), { parse_mode: 'MarkdownV2' })
                    }

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

                    bot.sendMessage(data[2], updateUserInfo(newUser, data[1] == 1, admin), await mainMenuByRoles({ chat_id: data[2] }))
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
                await TestResult.deleteMany({ chat_id: data[2] })
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
            let master = await User.findOne({ chat_id })
            if (master.job_title == 'Master') {
                let testResult = await TestResult.find({ chat_id: data[1] })
                if (testResult.length == 0) {
                    await sendMessageHelper(chat_id, 'Mavjud emas')
                    return
                }
                let filePath = await generateTestResultExcel(testResult, newUser)

                await bot.sendDocument(chat_id, filePath, {
                    caption: empDynamicBtn(),
                    filename: 'Malumotlar.xlsx',
                    contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                });
                return
            }
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
            return ['Admin', 'Master'].includes(get(user, 'job_title'))
        },
    },

    'userListSearch': {
        selfExecuteFn: async ({ chat_id, data }) => {
            let newUser = await User.findOne({ chat_id: data[1] })
            let master = await User.findOne({ chat_id })
            if (master.job_title == 'Master') {
                let testResult = await TestResult.find({ chat_id: data[1] })
                let filePath = await generateTestResultExcel(testResult, newUser)
                if (testResult.length == 0) {
                    await sendMessageHelper(chat_id, 'Mavjud emas')
                    return
                }
                await bot.sendDocument(chat_id, filePath, {
                    caption: empDynamicBtn(),
                    filename: 'Malumotlar.xlsx',
                    contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                });
                return
            }
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
            return ['Admin', 'Master'].includes(get(user, 'job_title'))
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
            let users;
            if (get(user, 'job_title') == 'Master') {
                users = await User.find({ confirmed: true, master: user.emp_id, job_title: "User" })
            }
            else {
                users = await User.find({ confirmed: true, chat_id: { $ne: chat_id } })
            }
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
            return ['Admin', 'Master'].includes(get(user, 'job_title')) && get(user, 'confirmed')
        },
    },

    "paginationUserListSearch": {
        selfExecuteFn: async ({ chat_id, data }) => {
            let user = await infoUser({ chat_id })
            let users;
            if (get(user, 'job_title') == 'Master') {
                users = await User.find({
                    confirmed: true,
                    chat_id: { $ne: chat_id },
                    master: user.emp_id,
                    job_title: "User",
                    $or: [
                        { first_name: { $regex: get(user, 'custom.search'), $options: 'i' } },
                        { last_name: { $regex: get(user, 'custom.search'), $options: 'i' } },
                        { emp_id: isNaN(get(user, 'custom.search')) ? undefined : get(user, 'custom.search') },
                        { mobile: { $regex: get(user, 'custom.search'), $options: 'i' } }
                    ]
                }).lean();
            }
            else {
                users = await User.find({
                    confirmed: true,
                    chat_id: { $ne: chat_id },
                    $or: [
                        { first_name: { $regex: get(user, 'custom.search'), $options: 'i' } },
                        { last_name: { $regex: get(user, 'custom.search'), $options: 'i' } },
                        { emp_id: isNaN(get(user, 'custom.search')) ? undefined : get(user, 'custom.search') },
                        { mobile: { $regex: get(user, 'custom.search'), $options: 'i' } }
                    ]
                }).lean();
            }

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
            return ['Admin', 'Master'].includes(get(user, 'job_title')) && get(user, 'confirmed')
        },
    },

}

let adminTestManagement = {
    catalogAdmin: {
        selfExecuteFn: async ({ chat_id, data, msg }) => {
            let categories = await Catalog.findOne({ id: data[1] })
            let text = `*🛠️ Kategoriyani tanlang*\n\n` +
                `*🔍 Kategoriya joyi*: \`${get(categories, 'name.textUzLat', '')}\`\n\n` +
                `Iltimos, quyidagi kategoriyalardan birini tanlang:`
            let categoriesBtn = get(categories, 'subCategories', []).filter(item => !item.isDisabled).map(item => {
                return { name: get(item, 'name.textUzLat', '-'), id: get(item, 'id') }
            })
            let btn = await dataConfirmBtnEmp(chat_id, categoriesBtn, 2, 'categoriesAdmin')
            bot.editMessageText(text, {
                chat_id: chat_id,
                message_id: get(msg, 'message.message_id'),
                parse_mode: 'MarkdownV2',
                ...btn
            })
            updateCustom(chat_id, { categories, subCategory: get(categories, 'subCategories', []) })
            return
        },
        middleware: async ({ chat_id, id }) => {
            let user = await infoUser({ chat_id })
            return !get(user, 'custom.test.productId')
        },
    },
    categoriesAdmin: {
        selfExecuteFn: async ({ chat_id, data, msg }) => {
            let product = await Product.find({ 'category.id': data[1] })
            let user = await infoUser({ chat_id })
            if (product.length == 0) {
                let deleteMessage = await sendMessageHelper(chat_id, 'Loading...')
                let newProduct = await ferroController.getProductListCategory(data[1])

                await Product.insertMany(newProduct);
                bot.deleteMessage(chat_id, deleteMessage.message_id)
                product = newProduct
            }
            if (get(user, 'custom.statusBtn') == 3) {
                let questions = await Question.find({ isDeleted: false, 'category.id': data[1] })
                let testResult = await TestResult.find({ 'category.id': data[1], full: true, chat_id })

                if (questions.length == 0) {
                    if (get(user, 'custom.productMessageId')) {
                        bot.editMessageText(`Mavjud emas`, {
                            chat_id: chat_id,
                            message_id: get(user, 'custom.productMessageId'),
                            parse_mode: 'HTML',
                        })
                    }
                    else {
                        let message = await sendMessageHelper(chat_id, `Mavjud emas`, { parse_mode: "HTML" })
                        updateCustom(chat_id, { productMessageId: message.message_id })
                    }
                    return
                }
                let productIdList = [...new Set(questions.map(item => +item.productId))].sort((a, b) => b - a)
                let text = ''
                for (let i = 0; i < productIdList.length; i++) {
                    let oneQuestion = questions.find(item => item.productId == productIdList[i])
                    let tests = testResult.filter(item => item.productId == productIdList[i])

                    let success = tests.find(item => item.confirm == '1')
                    let reject = tests[tests.length - 1]?.confirm == 2
                    let pending = tests[tests.length - 1]?.confirm == 0
                    text += `📦 <b>Mahsulot joyi:</b> ➡️${get(oneQuestion, 'category.name.textUzLat')} > ${get(oneQuestion, 'name.textUzLat')}\n`;
                    if (success) {
                        text += `📊 <b>Holati:</b> ✅ Muvaffaqiyatli topshirilgan\n\n`;
                    } else if (reject) {
                        text += `📊 <b>Holati:</b> 🔄 Qayta ishlash kerak\n\n`;
                    } else if (pending) {
                        text += `📊 <b>Holati:</b> 🕒 Tekshirilmoqda\n\n`;
                    } else {
                        text += `📊 <b>Holati:</b> 🔒 Topshirilmagan\n\n`;
                    }
                }
                if (get(user, 'custom.productMessageId')) {
                    bot.editMessageText(text, {
                        chat_id: chat_id,
                        message_id: get(user, 'custom.productMessageId'),
                        parse_mode: 'HTML',
                    })
                }
                else {
                    let message = await sendMessageHelper(chat_id, text, { parse_mode: "HTML" })
                    updateCustom(chat_id, { productMessageId: message.message_id })
                }
                return
            }
            let text = `*🛠️ Mahsulotni tanlang*\n\n` +
                `*🔍 Mahsulot joyi*: \`${get(product, '[0].category.parent.name.textUzLat', '')} > ${get(product, '[0].category.name.textUzLat')}\`\n\n` +
                `Iltimos, quyidagi mahsulotlardan birini tanlang:`
            let productBtn = product.filter(item => !item.isDisabled).map(item => {
                return { name: get(item, 'name.textUzLat', '-'), id: get(item, 'id') }
            })
            let obj = {
                'User': 'productUser',
                'Admin': 'productAdmin'
            }
            let btn = await dataConfirmBtnEmp(chat_id, productBtn, 2, obj[get(user, 'job_title')])
            if (uncategorizedProduct.includes(+data[1])) {
                btn.reply_markup.inline_keyboard = [...btn.reply_markup.inline_keyboard.filter(item => item[0].callback_data != 'backToCategory'), [{
                    text: `🔙 Katalogga qaytish`,
                    callback_data: 'backToCatalog'
                }]]
            }
            bot.editMessageText(text, {
                chat_id: chat_id,
                message_id: get(msg, 'message.message_id'),
                parse_mode: 'MarkdownV2',
                ...btn
            })
            let newParent = get(product, '[0].category.parent', {})
            updateCustom(chat_id, {
                product,
                categories: newParent,
                selectSubCategoriesId: data[1]
            })


            return
        },
        middleware: async ({ chat_id, id }) => {
            let user = await infoUser({ chat_id })
            return !get(user, 'custom.test.productId')
        },
    },
    paginationProductAdmin: {
        selfExecuteFn: async ({ chat_id, data, msg }) => {
            let user = await infoUser({ chat_id })
            let categories = get(user, 'custom.categories', [])
            let product = get(user, 'custom.product', [])
            let text = `*🛠️ Mahsulotni tanlang*\n\n` +
                `*🔍 Mahsulot joyi*: \`${get(categories, 'name.textUzLat', '')} > ${get(product, '[0].category.name.textUzLat')}\`\n\n` +
                `Iltimos, quyidagi mahsulotlardan birini tanlang:`

            let pagination = data[1] == 'prev' ? { prev: +data[2] - 10, next: data[2] } : { prev: data[2], next: +data[2] + 10 }


            let productBtn = product.filter(item => !item.isDisabled).map(item => {
                return { name: get(item, 'name.textUzLat', '-'), id: get(item, 'id') }
            })
            let obj = {
                'User': 'productUser',
                'Admin': 'productAdmin'
            }
            let btn = await dataConfirmBtnEmp(chat_id, productBtn, 2, obj[get(user, 'job_title')], pagination)
            if (uncategorizedProduct.includes(Number(get(product, '[0].category.id', '0')))) {
                btn.reply_markup.inline_keyboard = [...btn.reply_markup.inline_keyboard.filter(item => item[0].callback_data != 'backToCategory'), [{
                    text: `🔙 Katalogga qaytish`,
                    callback_data: 'backToCatalog'
                }]]
            }
            bot.editMessageText(text, {
                chat_id: chat_id,
                message_id: get(msg, 'message.message_id'),
                parse_mode: 'MarkdownV2',
                ...btn
            })
            return
        },
        middleware: async ({ chat_id, id }) => {
            let user = await infoUser({ chat_id })
            return !get(user, 'custom.test.productId')
        },
    },
    paginationCategoriesAdmin: {
        selfExecuteFn: async ({ chat_id, data, msg }) => {
            let user = await infoUser({ chat_id })
            let categories = get(user, 'custom.categories', {})
            let subCategory = get(user, 'custom.subCategory', [])
            let text = `*🛠️ Kategoriyani tanlang*\n\n` +
                `*🔍 Kategoriya joyi*: \`${get(categories, 'name.textUzLat', '')}\`\n\n` +
                `Iltimos, quyidagi kategoriyalardan birini tanlang:`
            let categoriesBtn = subCategory.filter(item => !item.isDisabled).map(item => {
                return { name: get(item, 'name.textUzLat', '-'), id: get(item, 'id') }
            })

            let pagination = data[1] == 'prev' ? { prev: +data[2] - 10, next: data[2] } : { prev: data[2], next: +data[2] + 10 }

            let btn = await dataConfirmBtnEmp(chat_id, categoriesBtn, 2, 'categoriesAdmin', pagination)
            bot.editMessageText(text, {
                chat_id: chat_id,
                message_id: get(msg, 'message.message_id'),
                parse_mode: 'MarkdownV2',
                ...btn
            })
            return
        },
        middleware: async ({ chat_id, id }) => {
            let user = await infoUser({ chat_id })
            return !get(user, 'custom.test.productId')
        },
    },
    backToCatalog: {
        selfExecuteFn: async ({ chat_id, data, msg }) => {
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
            let text = `Mahsulotlar katalogi 🔧`
            bot.editMessageText(text, {
                chat_id: chat_id,
                message_id: get(msg, 'message.message_id'),
                parse_mode: 'MarkdownV2',
                ...btn
            })
            return
        },
        middleware: async ({ chat_id, id }) => {
            let user = await infoUser({ chat_id })
            return !get(user, 'custom.test.productId')
        },
    },
    backToCategory: {
        selfExecuteFn: async ({ chat_id, data, msg }) => {
            let user = await infoUser({ chat_id })
            let categories = get(user, 'custom.categories', {})
            let subCategory = get(user, 'custom.subCategory', [])
            let text = `*🛠️ Kategoriyani tanlang*\n\n` +
                `*🔍 Kategoriya joyi*: \`${get(categories, 'name.textUzLat', '')}\`\n\n` +
                `Iltimos, quyidagi kategoriyalardan birini tanlang:`
            let categoriesBtn = subCategory.filter(item => !item.isDisabled).map(item => {
                return { name: get(item, 'name.textUzLat', '-'), id: get(item, 'id') }
            })
            let btn = await dataConfirmBtnEmp(chat_id, categoriesBtn, 2, 'categoriesAdmin')
            bot.editMessageText(text, {
                chat_id: chat_id,
                message_id: get(msg, 'message.message_id'),
                parse_mode: 'MarkdownV2',
                ...btn
            })
            updateCustom(chat_id, { categories })
            return
        },
        middleware: async ({ chat_id, id }) => {
            let user = await infoUser({ chat_id })
            return !get(user, 'custom.test.productId')
        },
    },
    productAdmin: {
        selfExecuteFn: async ({ chat_id, data, msg }) => {
            let user = await infoUser({ chat_id });
            let deleteMessage = await sendMessageHelper(chat_id, 'Loading...')

            let product = await Product.findOne({ 'id': data[1] });
            let photoUrl = `${process.env.ferro_api}/file/thumbnail/square/1280/` + get(product, 'photos[0].photo.url', '');

            updateBack(chat_id, { text: "Assalomu aleykum", btn: await mainMenuByRoles({ chat_id }), step: 1 });

            let text = `🛒 Tanlangan Mahsulot: ${get(product, 'name.textUzLat', '')}\n\n💬 Bu mahsulot bilan qanday amallarni bajarmoqchisiz?`;
            let btn = empDynamicBtn([`➕ Test qo'shish`, `✏️ O'zgartirish`, `🗑 O'chirish`], 2);

            try {
                if (get(user, 'custom.productMessageId')) {
                    await bot.deleteMessage(chat_id, user.custom?.productMessageId);
                }
            } catch (error) {
                console.error('Xabarni o\'chirishda xatolik:', error.message);
            }

            let updateId;
            if (get(product, 'photos[0].photo.url', '')) {
                updateId = await bot.sendPhoto(chat_id, photoUrl, {
                    caption: text,
                    ...btn
                });
            } else {
                updateId = await sendMessageHelper(chat_id, text, btn);
            }
            bot.deleteMessage(chat_id, deleteMessage.message_id)

            updateCustom(chat_id, { selectedProduct: { id: data[1] }, productMessageId: updateId.message_id });
            updateStep(chat_id, 20);
        },
        middleware: async ({ chat_id, id }) => {
            let user = await infoUser({ chat_id })
            return get(user, 'job_title') == 'Admin' && !get(user, 'custom.in_process')
        },
    },
    confirmTest: {
        selfExecuteFn: async ({ chat_id, data, msg }) => {
            let user = await infoUser({ chat_id });
            if (data[1] == 1) {
                let { id, text, count, listAnswers, correct } = get(user, 'custom.selectedProduct', {});

                // Ma'lumotlar yetarli ekanligini tekshirish
                if (!id || !text || !count || Object.keys(listAnswers).length == 0 || !correct) {
                    let text = `❗️ Xatolik!\nMa'lumotlar yetarli emas (Savol, Javoblar etc...)`;
                    sendMessageHelper(chat_id, text);
                    return;
                }

                // Mahsulotni olish
                let product = await Product.findOne({ 'id': id });
                if (!product) {
                    let text = `❗️ Xatolik!\nMahsulot topilmadi!`;
                    sendMessageHelper(chat_id, text);
                    return;
                }

                // Javoblarni array formatiga aylantirish
                let answers = Object.keys(listAnswers).map(key => listAnswers[key]);

                try {
                    // Yangi savol yaratish
                    let question = new Question({
                        chat_id,
                        productId: product.id, // Mahsulot ID'si
                        photo: get(user, 'custom.selectedProduct.photo'),
                        name: {
                            id: product.id,
                            textUzLat: product.name.textUzLat,
                            textUzCyr: product.name.textUzCyr,
                            textRu: product.name.textRu
                        },
                        category: product.category, // Mahsulotning categoriyasi (bosqich)
                        answerText: text, // Savol matni
                        answers: answers, // Foydalanuvchi kiritgan javoblar
                        correct: correct, // To'g'ri javob
                        createdByChatId: chat_id, // Savolni yaratgan foydalanuvchi
                        createdAt: Date.now(),
                    });

                    // Savolni saqlash
                    await question.save();

                    // Javob berish
                    let createdBy = `${get(user, 'last_name', '-')} ${get(user, 'first_name')}`
                    let textMessage = TestAdminInfo({ chat_id, text, count, listAnswers, correct, product: question, createdBy })
                    if (get(user, 'custom.selectedProduct.photo', []).length) {
                        bot.editMessageCaption(textMessage, {
                            chat_id: chat_id,
                            message_id: get(msg, 'message.message_id'),
                            parse_mode: 'HTML',
                        });
                    }
                    else {
                        bot.editMessageText(textMessage, {
                            chat_id: chat_id,
                            message_id: get(msg, 'message.message_id'),
                            parse_mode: 'HTML',
                        })
                    }



                    bot.sendMessage(chat_id, 'Assalomu Aleykum', await mainMenuByRoles({ chat_id }))
                    // Foydalanuvchi ma'lumotlarini yangilash

                    await sleepNow(300)

                    updateUser(chat_id, {
                        custom: {
                            ...get(user, 'custom', {}),
                            selectedProduct: {},
                            in_process: false
                        },
                        back: []
                    })


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

                    return

                } catch (error) {
                    let text = `❗️ Xatolik!\nSavolni qo'shishda muammo yuzaga keldi: ${error.message}`;
                    sendMessageHelper(chat_id, text);
                }
            } else {
                updateUser(chat_id, {
                    custom: {
                        ...get(user, 'custom', {}),
                        selectedProduct: {},
                        in_process: false
                    },
                    back: []
                })
                bot.deleteMessage(chat_id, get(msg, 'message.message_id'),)
                bot.sendMessage(chat_id, `✅ Bekor qilindi`, await mainMenuByRoles({ chat_id }))
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

        },
        middleware: async ({ chat_id, id }) => {
            let user = await infoUser({ chat_id })
            return get(user, 'job_title') == 'Admin' && get(user, 'custom.in_process') && get(user, 'custom.selectedProduct.id')
        },
    },
    updateList: {
        selfExecuteFn: async ({ chat_id, data, msg }) => {
            let user = await infoUser({ chat_id });

            let question = await Question.findOne({ isDeleted: false, id: data[1] })
            if (question.length == 0) {
                sendMessageHelper(chat_id, 'Mavjud emas')
                return
            }
            let btn = await dataConfirmBtnEmp(chat_id, [
                { name: `📸 Rasm o'zgartirish`, id: `updatePicture#${question.id}` },
                { name: `❓ Savol`, id: `updateAnswerText#${question.id}` },
                { name: `✅ Javoblar`, id: `updateAnswerList#${question.id}` },
                { name: `🗑️ Rasmni o'chirish`, id: `deletePicture#${question.id}` },
                { name: `❌ Bekor qilish`, id: `remove#${question.id}` },
            ], 2, 'updateTest')
            let createUser = await infoUser({ chat_id: get(question, 'chat_id') })
            let createdBy = `${get(createUser, 'last_name', '-')} ${get(createUser, 'first_name')}`

            let text = TestAdminInfo({
                text: get(question, 'answerText', ''),
                count: get(question, 'answers', []).length,
                listAnswers: get(question, 'answers', []),
                correct: get(question, 'correct'),
                product: question,
                createdBy,
                status: true
            })
            let photo = get(question, 'photo', [])

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

        },
        middleware: async ({ chat_id, id }) => {
            let user = await infoUser({ chat_id })
            return get(user, 'job_title') == 'Admin' && get(user, 'confirmed') && get(user, 'user_step') == 20
        },
    },

    confirmTestResult: {
        selfExecuteFn: async ({ chat_id, data, msg }) => {
            let admin = await infoUser({ chat_id })
            let testResult = await TestResult.findOne({ full: true, confirm: 0, test_id: data[2] });

            if (!testResult) {
                bot.sendMessage(chat_id, 'Mavjud emas')
                return
            }
            let user = await User.findOne({ confirmed: true, master: admin.emp_id, chat_id: testResult.chat_id });

            testResult.confirm = +data[1];
            await testResult.save();

            let finalTex = generateTestResultTextConfirm(
                {
                    question: testResult,
                    totalQuestions: testResult.answers.length,
                    answers: testResult.answers,
                    startDate: testResult.startDate,
                    endDate: testResult.endDate,
                    user,
                    status: data[1]
                },
            )
            bot.editMessageText(finalTex, {
                chat_id: chat_id,
                message_id: get(msg, 'message.message_id'),
                parse_mode: 'HTML',
            })

            bot.sendMessage(user.chat_id, finalTex, { parse_mode: 'HTML' })
        },
        middleware: async ({ chat_id }) => {
            let user = await infoUser({ chat_id })
            return get(user, 'job_title') == 'Master' && get(user, 'confirmed')
        },
    },

}


let updateTestCallBack = {
    updateTest: {
        selfExecuteFn: async ({ chat_id, data, msg }) => {
            let user = await infoUser({ chat_id })

            let obj = executeUpdateFn(data[1])
            if (data[1] == 'deletePicture') {
                await updateQuestion(data[2], { photo: [] })
                sendMessageHelper(chat_id, `✅ O'zgartirildi`, await mainMenuByRoles({ chat_id }))
            }
            else if (data[1] == 'remove') {
                bot.deleteMessage(chat_id, msg.message.message_id)
                return
            }
            else if (obj) {
                updateUser(chat_id,
                    {
                        user_step: obj.step,
                        custom: {
                            ...get(user, 'custom'),
                            updateId: data[2],
                            in_process: true
                        }
                    }
                )
                let text = obj?.text
                let btn = obj?.btn
                bot.sendMessage(chat_id, text, btn)
                return
            }
            await sleepNow(300)

            updateThenFn(data[2])
        },
        middleware: async ({ chat_id, id }) => {
            let user = await infoUser({ chat_id })
            return get(user, 'job_title') == 'Admin' && get(user, 'confirmed') && get(user, 'user_step') == 20
        },
    },
    deleteList: {
        selfExecuteFn: async ({ chat_id, data, msg }) => {
            let user = await infoUser({ chat_id })
            let question = await Question.findOne({ isDeleted: false, id: data[1] })
            if (question.length == 0) {
                sendMessageHelper(chat_id, 'Mavjud emas')
                return
            }
            let btn = await dataConfirmBtnEmp(chat_id, [
                { name: `🗑 Testni o'chirish`, id: `deleteTest#${question.id}` },
                { name: `❌ Bekor qilish`, id: `cancel#${question.id}` },
            ], 2, 'deleteTest')
            let createUser = await infoUser({ chat_id: get(question, 'chat_id') })
            let createdBy = `${get(createUser, 'last_name', '-')} ${get(createUser, 'first_name')}`

            let text = TestAdminInfo({
                text: get(question, 'answerText', ''),
                count: get(question, 'answers', []).length,
                listAnswers: get(question, 'answers', []),
                correct: get(question, 'correct'),
                product: question,
                createdBy,
                status: true
            })
            if (get(question, 'photo', []).length) {
                try {
                    await bot.editMessageCaption(text, {
                        chat_id: chat_id,
                        message_id: get(msg, 'message.message_id'),
                        parse_mode: 'HTML',
                        ...btn
                    });
                }
                catch (e) {
                    bot.editMessageText(text, {
                        chat_id: chat_id,
                        message_id: get(msg, 'message.message_id'),
                        parse_mode: 'HTML',
                        ...btn
                    })
                }
            }
            else {
                bot.editMessageText(text, {
                    chat_id: chat_id,
                    message_id: get(msg, 'message.message_id'),
                    parse_mode: 'HTML',
                    ...btn
                })
            }

        },
        middleware: async ({ chat_id, id }) => {
            let user = await infoUser({ chat_id })
            return get(user, 'job_title') == 'Admin' && get(user, 'confirmed') && get(user, 'user_step') == 20
        },
    },
    deleteTest: {
        selfExecuteFn: async ({ chat_id, data, msg }) => {
            if (data[1] == 'cancel') {
                let user = await infoUser({ chat_id })
                let question = await Question.findOne({ isDeleted: false, id: data[2] })
                if (question.length == 0) {
                    sendMessageHelper(chat_id, 'Mavjud emas')
                    return
                }
                let btn = await dataConfirmBtnEmp(chat_id, [{ name: `🗑 O'chirish`, id: question.id }], 1, 'deleteList')
                let text = TestInfo(question)
                if (get(question, 'photo', []).length) {
                    try {
                        await bot.editMessageCaption(text, {
                            chat_id: chat_id,
                            message_id: get(msg, 'message.message_id'),
                            parse_mode: 'HTML',
                            ...btn
                        });
                    }
                    catch (e) {
                        bot.editMessageText(text, {
                            chat_id: chat_id,
                            message_id: get(msg, 'message.message_id'),
                            parse_mode: 'HTML',
                            ...btn
                        })
                    }
                }
                else {
                    bot.editMessageText(text, {
                        chat_id: chat_id,
                        message_id: get(msg, 'message.message_id'),
                        parse_mode: 'HTML',
                        ...btn
                    })
                }
            }
            else {
                updateQuestion(data[2], { isDeleted: true })
                bot.deleteMessage(chat_id, get(msg, 'message.message_id'))
                sendMessageHelper(chat_id, `✅ ${data[2]} ID test muvaffaqiyatli o'chirildi.`)
            }

        },
        middleware: async ({ chat_id, id }) => {
            let user = await infoUser({ chat_id })
            return get(user, 'job_title') == 'Admin' && get(user, 'confirmed') && get(user, 'user_step') == 20
        },
    },

}

let userCallback = {
    productUser: {
        selfExecuteFn: async ({ chat_id, data, msg }) => {
            let user = await infoUser({ chat_id })
            let product = await ChildProduct.find({ 'parentProduct.id': data[1] })
            let testResult = await TestResult.find({ productId: data[1], chat_id })
            let questions = await Question.find({ isDeleted: false, productId: data[1] })
            if (product.length == 0) {
                let deleteMessage = await sendMessageHelper(chat_id, 'Loading...')
                let newProduct = await ferroController.getChildProduct(data[1])

                await ChildProduct.insertMany(newProduct);
                bot.deleteMessage(chat_id, deleteMessage.message_id)
                product = newProduct
            }
            if (product?.length == 0) {
                let parentProduct = await Product.find({ 'id': data[1] }).lean()
                product = parentProduct.map(item => {
                    return { ...item, parentProduct: { name: item.name, id: item.id, category: item.category, photos: item.photos } }
                })
            }

            if (get(user, 'custom.statusBtn') == 2) {
                if (testResult.length == 0) {
                    if (get(user, 'custom.productMessageId')) {
                        bot.editMessageText(`Mavjud emas`, {
                            chat_id: chat_id,
                            message_id: get(user, 'custom.productMessageId'),
                            parse_mode: 'HTML',
                        })
                    }
                    else {
                        let message = await sendMessageHelper(chat_id, `Mavjud emas`, { parse_mode: "HTML" })
                        updateCustom(chat_id, { productMessageId: message.message_id })
                    }
                    return
                }

                let lastResult = testResult[testResult.length - 1]
                let finalTex = generateTestResultText(
                    {
                        question: questions[0],
                        totalQuestions: lastResult.answers.length,
                        answers: lastResult.answers,
                        startDate: lastResult.startDate,
                        endDate: lastResult.endDate,
                        status: lastResult?.confirm,
                    },
                )
                if (get(user, 'custom.productMessageId')) {
                    bot.editMessageText(finalTex, {
                        chat_id: chat_id,
                        message_id: get(user, 'custom.productMessageId'),
                        parse_mode: 'HTML',
                    })
                }
                else {
                    let message = await sendMessageHelper(chat_id, finalTex, { parse_mode: "HTML" })
                    updateCustom(chat_id, { productMessageId: message.message_id })
                }


                return
            }

            let text = `*🛠️ Mahsulotni tanlang*\n\n` +
                `*🔍 Mahsulot joyi*: \`${get(product, '[0].parentProduct.category.parent.name.textUzLat', '')} > ${get(product, '[0].parentProduct.category.name.textUzLat')} > ${get(product, '[0].parentProduct.name.textUzLat')}\`\n\n` +
                `Iltimos, quyidagi ichki mahsulotlardan birini tanlang`
            let productBtn = product.filter(item => !item?.isDisabled).map(item => {
                return { name: get(item, 'name.textUzLat', '-'), id: get(item, 'id') }
            })

            let btn = await dataConfirmBtnEmp(chat_id, productBtn, 2, 'childProduct')
            if (questions.length) {
                let elektrAksessuarlar = 1005271
                let instrumentlar = 1005269
                let mahkamlovchi = 1000058
                let status = false;

                let selectProduct = get(user, 'custom.subCategory', []);

                let currentStepIndex = selectProduct.findIndex(item => item.id == get(user, 'custom.selectSubCategoriesId'));
                const sliced = selectProduct.slice(0, currentStepIndex);
                let productID = '';
                if (sliced.length) {
                    let results = await TestResult.find({
                        full: true,
                        chat_id,
                        'category.id': { $in: sliced.map(item => item.id) },
                        confirm: { $in: [0, 1] }
                    });

                    let questionsResults = await Question.find({
                        isDeleted: false,
                        'category.id': { $in: sliced.map(item => item.id) }
                    });

                    for (let step of sliced) {
                        let stepId = step.id;

                        let hasQuestions = questionsResults.filter(q => q.category.id == stepId);

                        let hasFullResult = results.filter(r => r.category.id == stepId);

                        if (hasQuestions.length) {
                            if (hasQuestions.length != hasFullResult.length) {
                                status = true;
                                let resultsId = hasFullResult.map(item => item.productId)
                                productID = hasQuestions.find(item => !resultsId.includes(item.productId))?.id
                                break;
                            }
                        }


                    }
                }
                console.log(status, productID)
                if (!status) {
                    console.log("tushdi")
                    let selectProductChild = get(user, 'custom.product', []);

                    // Joriy bosqich raqami (masalan, 4)
                    let currentStepIndexChild = selectProductChild.findIndex(item => item.id == data[1]);

                    // Joriy bosqichga kirishdan oldingi bosqichlar
                    const slicedChild = selectProductChild.slice(0, currentStepIndexChild);
                    if (slicedChild.length) {
                        // Barcha oldingi bosqichlar bo'yicha natijalarni olish
                        let resultsChild = await TestResult.find({
                            full: true,
                            chat_id,
                            productId: { $in: slicedChild.map(item => item.id) },
                            confirm: { $in: [0, 1] }
                        });

                        // Barcha oldingi bosqichlar bo'yicha mavjud savollarni olish
                        let questionsResultsChild = await Question.find({
                            isDeleted: false,
                            productId: { $in: slicedChild.map(item => item.id) }
                        });
                        for (let step of slicedChild) {
                            let stepId = step.id;



                            const filteredQuestions = questionsResultsChild.filter(q => q.productId == stepId);

                            const hasQuestions = filteredQuestions.reduce((acc, current) => {
                                // Agar `productId` allaqachon `acc` da bo'lmasa, uni qo'shamiz
                                const x = acc.find(item => item.productId == current.productId);
                                if (!x) {
                                    acc.push(current);
                                }
                                return acc;
                            }, []);

                            // Ushbu bosqich uchun to'liq tasdiqlangan natija mavjudligini tekshirish
                            let hasFullResult = resultsChild.filter(r => r.productId == stepId);
                            if (hasQuestions.length) {
                                if (hasQuestions.length != hasFullResult.length) {
                                    status = true;
                                    let resultsId = hasFullResult.map(item => item.productId)
                                    productID = hasQuestions.find(item => !resultsId.includes(item.productId))?.id
                                    break;
                                }
                            }

                        }
                    }
                }



                let textObj = {
                    '0': "⏳ Tasdiqlanishi kutilyapti",
                    '1': "✅ Test tasdiqlangan",
                    '2': "🔄 Testni qayta topshirish"
                }
                let tests = testResult.filter(item => item.full)
                let confirmTest = tests.find(item => item.confirm == 1)
                btn.reply_markup.inline_keyboard = [...btn.reply_markup.inline_keyboard, [{
                    text: (status && !confirmTest && tests[tests.length - 1]?.confirm != 0) ? `🔒 Test bloklangan` : (tests.length ? textObj[confirmTest ? 1 : tests[tests.length - 1]?.confirm] : `📝 Testni boshlash`),
                    callback_data: 'startTestConfirm' + ((status && !confirmTest && tests[tests.length - 1]?.confirm != 0) ? `#3#${productID}` : '')
                }]]
            }


            bot.editMessageText(text, {
                chat_id: chat_id,
                message_id: get(msg, 'message.message_id'),
                parse_mode: 'MarkdownV2',
                ...btn
            })

            updateCustom(chat_id, {
                childProduct: product,
                selectedProduct: { id: data[1] },
                productMessageId: ''
            })

            return
        },
        middleware: async ({ chat_id, id }) => {
            let user = await infoUser({ chat_id })
            return get(user, 'job_title') == 'User' && !get(user, 'custom.test.productId')
        },
    },
    paginationProductUser: {
        selfExecuteFn: async ({ chat_id, data, msg }) => {
            let user = await infoUser({ chat_id })
            let categories = get(user, 'custom.categories', [])
            let product = get(user, 'custom.product', [])
            let text = ''
            if (get(user, 'custom.searchResult', []).length) {
                text = `*🛠️ Iltimos, quyidagi mahsulotlardan birini tanlang*\n\n`
            }
            else {
                text = `*🛠️ Mahsulotni tanlang*\n\n` +
                    `*🔍 Mahsulot joyi*: \`${get(categories, 'name.textUzLat', '')} > ${get(product, '[0].category.name.textUzLat')}\`\n\n` +
                    `Iltimos, quyidagi mahsulotlardan birini tanlang:`
            }


            let pagination = data[1] == 'prev' ? { prev: +data[2] - 10, next: data[2] } : { prev: data[2], next: +data[2] + 10 }

            let productBtn = []
            if (get(user, 'custom.searchResult', []).length == 0) {
                productBtn = product.filter(item => !item.isDisabled).map(item => {
                    return { name: get(item, 'name.textUzLat', '-'), id: get(item, 'id') }
                })
            }
            else {
                productBtn = get(user, 'custom.searchResult', []).map(item => {
                    return { name: get(item, 'name', '-'), id: get(item, 'id') }
                })
            }

            let obj = {
                'User': 'productUser',
                'Admin': 'productAdmin'
            }
            let btn = await dataConfirmBtnEmp(chat_id, productBtn, 2, obj[get(user, 'job_title')], pagination)
            if (uncategorizedProduct.includes(Number(get(product, '[0].category.id', '0')))) {

                btn.reply_markup.inline_keyboard = [...btn.reply_markup.inline_keyboard.filter(item => item[0].callback_data != 'backToCategory'), [{
                    text: `🔙 Katalogga qaytish`,
                    callback_data: 'backToCatalog'
                }]]
            }
            if (get(user, 'custom.searchResult', []).length) {
                btn.reply_markup.inline_keyboard = [...btn.reply_markup.inline_keyboard.filter(item => item[0].callback_data != 'backToCategory')]
            }
            bot.editMessageText(text, {
                chat_id: chat_id,
                message_id: get(msg, 'message.message_id'),
                parse_mode: 'MarkdownV2',
                ...btn
            })
            return
        },
        middleware: async ({ chat_id, id }) => {
            let user = await infoUser({ chat_id })
            return get(user, 'job_title') == 'User' && !get(user, 'custom.test.productId')
        },
    },
    backToChildProduct: {
        selfExecuteFn: async ({ chat_id, data, msg }) => {
            let user = await infoUser({ chat_id })
            let categories = get(user, 'custom.categories', [])
            let product = get(user, 'custom.product', [])
            let text = ''
            if (get(user, 'custom.searchResult', []).length) {
                text = `*🛠️ Iltimos, quyidagi mahsulotlardan birini tanlang*\n\n`
            }
            else {
                text = `*🛠️ Mahsulotni tanlang*\n\n` +
                    `*🔍 Mahsulot joyi*: \`${get(categories, 'name.textUzLat', '')} > ${get(product, '[0].category.name.textUzLat')}\`\n\n` +
                    `Iltimos, quyidagi mahsulotlardan birini tanlang:`
            }



            let productBtn = []
            if (get(user, 'custom.searchResult', []).length == 0) {
                productBtn = product.filter(item => !item.isDisabled).map(item => {
                    return { name: get(item, 'name.textUzLat', '-'), id: get(item, 'id') }
                })
            }
            else {
                productBtn = get(user, 'custom.searchResult', []).map(item => {
                    return { name: get(item, 'name', '-'), id: get(item, 'id') }
                })
            }

            let btn = await dataConfirmBtnEmp(chat_id, productBtn, 2, 'productUser')

            if (uncategorizedProduct.includes(Number(get(product, '[0].category.id', '0'))) && get(user, 'custom.searchResult', []).length == 0) {
                btn.reply_markup.inline_keyboard = [...btn.reply_markup.inline_keyboard.filter(item => item[0].callback_data != 'backToCategory'), [{
                    text: `🔙 Katalogga qaytish`,
                    callback_data: 'backToCatalog'
                }]]
            }
            if (get(user, 'custom.searchResult', []).length) {
                btn.reply_markup.inline_keyboard = [...btn.reply_markup.inline_keyboard.filter(item => item[0].callback_data != 'backToCategory')]
            }
            try {
                if (get(user, 'custom.productMessageId')) {
                    await bot.deleteMessage(chat_id, user.custom?.productMessageId);
                    updateCustom(chat_id, { productMessageId: '' })
                }
            } catch (error) {
                console.error('Xabarni o\'chirishda xatolik:', error.message);
            }

            bot.editMessageText(text, {
                chat_id: chat_id,
                message_id: get(msg, 'message.message_id'),
                parse_mode: 'MarkdownV2',
                ...btn
            })
            return
        },
        middleware: async ({ chat_id, id }) => {
            let user = await infoUser({ chat_id })
            return get(user, 'job_title') == 'User' && !get(user, 'custom.test.productId')
        },
    },
    paginationChildProduct: {
        selfExecuteFn: async ({ chat_id, data, msg }) => {
            let user = await infoUser({ chat_id })
            let testResult = await TestResult.find({ productId: get(user, 'custom.selectedProduct.id'), chat_id })
            let questions = await Question.find({ isDeleted: false, productId: get(user, 'custom.selectedProduct.id') })

            let product = get(user, 'custom.childProduct')

            if (get(user, 'custom.statusBtn') == 2) {
                if (testResult.length == 0) {
                    if (get(user, 'custom.productMessageId')) {
                        bot.editMessageText(`Mavjud emas`, {
                            chat_id: chat_id,
                            message_id: get(user, 'custom.productMessageId'),
                            parse_mode: 'HTML',
                        })
                    }
                    else {
                        let message = await sendMessageHelper(chat_id, `Mavjud emas`, { parse_mode: "HTML" })
                        updateCustom(chat_id, { productMessageId: message.message_id })
                    }
                    return
                }
                let successResult = testResult.filter(item => item.confirm == 1)

                let lastResult = successResult.length ? successResult[successResult.length - 1] : testResult[testResult.length - 1]
                let finalTex = generateTestResultText(
                    {
                        question: questions[0],
                        totalQuestions: questions.length,
                        answers: lastResult.answers,
                        startDate: lastResult.startDate,
                        endDate: lastResult.endDate,
                        status: lastResult?.confirm
                    },
                )
                if (get(user, 'custom.productMessageId')) {
                    bot.editMessageText(finalTex, {
                        chat_id: chat_id,
                        message_id: get(user, 'custom.productMessageId'),
                        parse_mode: 'HTML',
                    })
                }
                else {
                    let message = await sendMessageHelper(chat_id, finalTex, { parse_mode: "HTML" })
                    updateCustom(chat_id, { productMessageId: message.message_id })
                }

                return
            }

            let text = `*🛠️ Mahsulotni tanlang*\n\n` +
                `*🔍 Mahsulot joyi*: \`${get(product, '[0].parentProduct.category.parent.name.textUzLat', '')} > ${get(product, '[0].parentProduct.category.name.textUzLat')} > ${get(product, '[0].parentProduct.name.textUzLat')}\`\n\n` +
                `Iltimos, quyidagi ichki mahsulotlardan birini tanlang`
            let productBtn = product.filter(item => !item.isDisabled).map(item => {
                return { name: get(item, 'name.textUzLat', '-'), id: get(item, 'id') }
            })
            let pagination = data[1] == 'prev' ? { prev: +data[2] - 10, next: data[2] } : { prev: data[2], next: +data[2] + 10 }
            let btn = await dataConfirmBtnEmp(chat_id, productBtn, 2, 'childProduct', pagination)


            if (questions.length) {
                let elektrAksessuarlar = 1005271
                let instrumentlar = 1005269
                let mahkamlovchi = 1000058

                let status = false;

                let selectProduct = get(user, 'custom.subCategory', []);

                let currentStepIndex = selectProduct.findIndex(item => item.id == get(user, 'custom.selectSubCategoriesId'));
                const sliced = selectProduct.slice(0, currentStepIndex);
                if (sliced.length) {
                    let results = await TestResult.find({
                        full: true,
                        chat_id,
                        'category.id': { $in: sliced.map(item => item.id) },
                        confirm: { $in: [0, 1] }
                    });

                    let questionsResults = await Question.find({
                        isDeleted: false,
                        'category.id': { $in: sliced.map(item => item.id) }
                    });

                    for (let step of sliced) {
                        let stepId = step.id;

                        let hasQuestions = questionsResults.filter(q => q.category.id == stepId);

                        let hasFullResult = results.filter(r => r.category.id == stepId);

                        if (hasQuestions.length) {
                            if (hasQuestions.length != hasFullResult.length) {
                                status = true;
                                break;
                            }
                        }


                    }
                }

                if (!status) {
                    let selectProductChild = get(user, 'custom.product', []);

                    // Joriy bosqich raqami (masalan, 4)
                    let currentStepIndexChild = selectProductChild.findIndex(item => item.id == get(user, 'custom.selectedProduct.id'));

                    // Joriy bosqichga kirishdan oldingi bosqichlar
                    const slicedChild = selectProductChild.slice(0, currentStepIndexChild);
                    if (slicedChild.length) {
                        // Barcha oldingi bosqichlar bo'yicha natijalarni olish
                        let resultsChild = await TestResult.find({
                            full: true,
                            chat_id,
                            productId: { $in: slicedChild.map(item => item.id) },
                            confirm: { $in: [0, 1] }
                        });

                        // Barcha oldingi bosqichlar bo'yicha mavjud savollarni olish
                        let questionsResultsChild = await Question.find({
                            isDeleted: false,
                            productId: { $in: slicedChild.map(item => item.id) }
                        });
                        // Har bir bosqich uchun savollar va javoblarni tekshirish
                        for (let step of slicedChild) {
                            let stepId = step.id;

                            // Ushbu bosqich uchun savollar mavjudligini tekshirish
                            let hasQuestions = questionsResultsChild.some(q => q.productId == stepId);

                            // Ushbu bosqich uchun to'liq tasdiqlangan natija mavjudligini tekshirish
                            let hasFullResult = resultsChild.some(r => r.productId == stepId);
                            if (hasQuestions) {
                                if (!hasFullResult) {
                                    status = true;
                                    break; // Tekshirishni to'xtatamiz, boshqa bosqichlarni ko'rish shart emas
                                }
                            }

                        }
                    }
                }

                // confirm 0 tasdiqlanmagan , 1 tasdiqlangan 2 reject bo'lgan 
                let textObj = {
                    '0': "⏳ Tasdiqlanishi kutilyapti",
                    '1': "✅ Test tasdiqlangan",
                    '2': "🔄 Testni qayta topshirish"
                }
                let tests = testResult.filter(item => item.full)
                let confirmTest = tests.find(item => item.confirm == 1)
                btn.reply_markup.inline_keyboard = [...btn.reply_markup.inline_keyboard, [{
                    text: (status && !confirmTest && tests[tests.length - 1]?.confirm != 0) ? `🔒 Test bloklangan` : (tests.length ? textObj[confirmTest ? 1 : tests[tests.length - 1]?.confirm] : `📝 Testni boshlash`),
                    callback_data: 'startTestConfirm' + ((status && !confirmTest && tests[tests.length - 1]?.confirm != 0) ? '#3' : '')
                }]]
            }

            bot.editMessageText(text, {
                chat_id: chat_id,
                message_id: get(msg, 'message.message_id'),
                parse_mode: 'MarkdownV2',
                ...btn
            })


            return
        },
        middleware: async ({ chat_id, id }) => {
            let user = await infoUser({ chat_id })
            return get(user, 'job_title') == 'User' && !get(user, 'custom.test.productId')
        },
    },
    childProduct: {
        selfExecuteFn: async ({ chat_id, data, msg }) => {
            let user = await infoUser({ chat_id });
            let deleteMessage = await sendMessageHelper(chat_id, 'Loading...')

            let childProduct = await ChildProduct.findOne({ id: data[1] })
            if (!childProduct) {
                let parentProduct = await Product.find({ 'id': data[1] }).lean()
                if (parentProduct.length == 0) {
                    await sendMessageHelper(chat_id, 'Mavjud emas')
                    return
                }
                childProduct = parentProduct.map(item => {
                    return { ...item, parentProduct: { name: item.name, id: item.id, category: item.category, photos: item.photos } }
                })[0]
            }
            let photoUrl = `${process.env.ferro_api}/file/thumbnail/square/1280/` + get(childProduct, 'parentProduct.photos[0].photo.url', '');
            let text = generateProductText(childProduct)
            let updateId;
            if (get(user, 'custom.productMessageId')) {
                bot.deleteMessage(chat_id, get(user, 'custom.productMessageId'))
            }
            if (get(childProduct, 'parentProduct.photos[0].photo.url', '')) {
                updateId = await bot.sendPhoto(chat_id, photoUrl, {
                    caption: text,
                    parse_mode: 'MarkdownV2',
                });
            } else {
                updateId = await sendMessageHelper(chat_id, text, { parse_mode: 'MarkdownV2' });
            }
            updateCustom(chat_id, { productMessageId: updateId.message_id });
            bot.deleteMessage(chat_id, deleteMessage.message_id)
            return
        },
        middleware: async ({ chat_id, id }) => {
            let user = await infoUser({ chat_id })
            return get(user, 'job_title') == 'User' && !get(user, 'custom.test.productId')
        },
    },
}

let userStartTestCallback = {
    startTestConfirm: {
        selfExecuteFn: async ({ chat_id, data, msg }) => {
            try {
                let user = await infoUser({ chat_id });
                if (data[1] == 3) {
                    console.log(data, ' bu data')
                    let questionsData = await Question.findOne({ isDeleted: false, id: Number(data[2]) })

                    let text = `*⚠️ Diqqat: Avval ushbu bosqichni bajarishingiz kerak*\n\n` +
                        `*🔍 Mahsulot joyi*: \`${get(questionsData, 'category.parent.name.textUzLat', '')} > ${get(questionsData, 'category.name.textUzLat')} > ${get(questionsData, 'name.textUzLat')}\`\n\n`
                    let message = await sendMessageHelper(chat_id, text, { parse_mode: "MarkdownV2" })
                    return
                }
                let questions = await Question.find({ isDeleted: false, productId: get(user, 'custom.selectedProduct.id') })
                let testResult = await TestResult.find({ productId: get(user, 'custom.selectedProduct.id'), full: true, chat_id })
                let success = testResult.find(item => item.confirm == 1)
                let pending = testResult[testResult.length - 1]?.confirm == '0'
                if (!success && pending) {
                    if (get(user, 'custom.productMessageId')) {
                        bot.editMessageText(`⏳ Tasdiqlanish kutilyapti`, {
                            chat_id: chat_id,
                            message_id: get(user, 'custom.productMessageId'),
                            parse_mode: 'HTML',
                        })
                    }
                    else {
                        let message = await sendMessageHelper(chat_id, `⏳ Tasdiqlanish kutilyapti`, { parse_mode: "HTML" })
                        updateCustom(chat_id, { productMessageId: message.message_id })
                    }

                    return
                }
                if (questions.length) {

                    let btn = await dataConfirmBtnEmp(chat_id,
                        [
                            { name: '🚀 Boshlash', id: `start#${get(user, 'custom.selectedProduct.id')}` },
                            { name: '❌ Bekor qilish', id: `cancel#${get(user, 'custom.selectedProduct.id')}` }
                        ], 2, 'startTest')
                    let master = await User.findOne({ emp_id: get(user, 'master') })
                    let text = generateTestText(questions, master)
                    if (get(user, 'custom.productMessageId')) {
                        await bot.deleteMessage(chat_id, user.custom?.productMessageId);
                        let message = await sendMessageHelper(chat_id, text, { ...btn, parse_mode: "HTML" })
                        updateCustom(chat_id, { productMessageId: message.message_id })
                    }
                    else {
                        let message = await sendMessageHelper(chat_id, text, { ...btn, parse_mode: "HTML" })
                        updateCustom(chat_id, { productMessageId: message.message_id })
                    }

                    return
                }
                return sendMessageHelper(chat_id, 'Mavjud emas')
            }
            catch (e) {
                console.log(e, ' bu err')
            }
        },
        middleware: async ({ chat_id, id }) => {
            let user = await infoUser({ chat_id })
            return get(user, 'job_title') == 'User' && !get(user, 'custom.test.productId')
        },
    },
    startTest: {
        selfExecuteFn: async ({ chat_id, data, msg }) => {
            let user = await infoUser({ chat_id });
            let questions = await Question.find({ isDeleted: false, productId: get(user, 'custom.selectedProduct.id') })
            if (data[1] == 'cancel') {
                bot.deleteMessage(chat_id, get(msg, 'message.message_id'))
                updateCustom(chat_id, { productMessageId: '' })
                return
            }
            if (questions.length) {
                questions = filterAndShuffleQuestions(questions, [])
                let master = await User.findOne({ emp_id: get(user, 'master') })

                let textTest = generateTestText(questions, master, new Date())
                let btnTest = empDynamicBtn([])

                bot.deleteMessage(chat_id, get(msg, 'message.message_id'))
                await sendMessageHelper(chat_id, textTest, { ...btnTest, parse_mode: "HTML" })
                await sleepNow(300)

                let oneQuestion = questions[0]
                let photoUrl = get(oneQuestion, 'photo[0].file_id')
                let text = `1\\-*Savol* : ${escapeMarkdown(get(oneQuestion, 'answerText', '-'))}`
                let btnList = filterAndShuffleQuestions(get(oneQuestion, 'answers', []).map(item => {
                    return { name: item, id: `${oneQuestion.id}#${item == oneQuestion.correct}` }
                }))
                let btn = await dataConfirmBtnEmp(chat_id, btnList, Math.ceil(btnList.length / 2), 'test')
                let messageId;
                if (photoUrl) {
                    try {
                        messageId = await bot.sendPhoto(chat_id, photoUrl, {
                            caption: text,
                            parse_mode: 'MarkdownV2',
                            ...btn
                        });
                    } catch (e) {
                        messageId = await sendMessageHelper(chat_id, text, { ...btn, parse_mode: 'MarkdownV2' });
                    }
                }
                else {
                    messageId = await sendMessageHelper(chat_id, text, { ...btn, parse_mode: 'MarkdownV2' });
                }

                updateCustom(chat_id, {
                    test: {
                        productId: get(user, 'custom.selectedProduct.id'),
                        startDate: new Date(),
                        messageId: messageId.message_id
                    },
                    productMessageId: ''
                })
                return
            }
            return sendMessageHelper(chat_id, 'Mavjud emas')
        },
        middleware: async ({ chat_id, id }) => {
            let user = await infoUser({ chat_id })
            return get(user, 'job_title') == 'User' && !get(user, 'custom.test.productId')
        },
    },
    test: {
        selfExecuteFn: async ({ chat_id, data, msg }) => {
            let user = await infoUser({ chat_id });
            let questions = await Question.find({ isDeleted: false, productId: get(user, 'custom.selectedProduct.id') })
            let totalQuestions = questions
            if (questions.length) {
                let currentQuest = questions.find(item => item?.id == data[1])

                updateCustom(chat_id, {
                    answers: [
                        ...get(user, 'custom.answers', []),
                        {
                            id: data[1],
                            text: get(currentQuest, 'answerText'),
                            isCorrect: data[2] === 'true',
                            correct: get(currentQuest, 'correct')
                        }
                    ]
                })
                questions = filterAndShuffleQuestions(questions, [...get(user, 'custom.answers', []).map(item => Number(item.id)), data[1]])
                if (questions.length == 0) {

                    let endDate = new Date()
                    let answers = [
                        ...get(user, 'custom.answers', []),
                        {
                            id: data[1],
                            text: get(currentQuest, 'answerText'),
                            isCorrect: data[2] === 'true',
                            correct: get(currentQuest, 'correct')
                        }
                    ]
                    let finalTex = generateTestResultText(
                        {
                            question: currentQuest,
                            totalQuestions: totalQuestions.length,
                            answers,
                            startDate: get(user, 'custom.test.startDate', new Date()),
                            endDate
                        },
                    )
                    await sendMessageHelper(chat_id, finalTex, { ...await mainMenuByRoles({ chat_id }), parse_mode: "HTML" })

                    let full = answers.filter(item => item.isCorrect).length == totalQuestions.length

                    let testResultNow = await TestResult.find({ productId: get(user, 'custom.selectedProduct.id'), full: true, chat_id })
                    let success = testResultNow.find(item => item?.confirm == 1)
                    let testResult;
                    if (!success) {
                        testResult = new TestResult({
                            chat_id,
                            productId: totalQuestions[0].productId,
                            name: {
                                id: totalQuestions[0].id,
                                textUzLat: totalQuestions[0].name.textUzLat,
                                textUzCyr: totalQuestions[0].name.textUzCyr,
                                textRu: totalQuestions[0].name.textRu
                            },
                            category: totalQuestions[0].category,
                            startDate: get(user, 'custom.test.startDate', new Date()),
                            endDate,
                            answers,
                            full
                        });
                        // confirm 0 tasdiqlanmagan , 1 tasdiqlangan 2 reject bo'lgan 
                        await testResult.save();
                    }


                    updateCustom(chat_id, {
                        test: {},
                        answers: []
                    })

                    if (!success && full) {
                        let master = await User.findOne({ emp_id: get(user, 'master'), job_title: "Master" })
                        if (master) {
                            await sendMessageHelper(chat_id, `Masterga jo'natildi ✅`, await mainMenuByRoles({ chat_id }))
                            let finalTex = generateTestResultTextConfirm(
                                {
                                    question: testResult,
                                    totalQuestions: testResult.answers.length,
                                    answers: testResult.answers,
                                    startDate: testResult.startDate,
                                    endDate: testResult.endDate,
                                    user,
                                },
                            )
                            let btn = await dataConfirmBtnEmp(chat_id, [{ name: '✅ Ha', id: `1#${testResult.test_id}` }, { name: '❌ Bekor qilish', id: `2#${testResult.test_id}` }], 2, 'confirmTestResult')
                            await sendMessageHelper(master.chat_id, finalTex, { ...btn, parse_mode: 'HTML' })
                        }
                    }

                    await postThenFn({ user, chat_id })

                    return
                }
                await helperTestCallback({ user, chat_id, questions, count: Math.abs((totalQuestions.length - questions.length) + 1) })
                return
            }
            return sendMessageHelper(chat_id, 'Mavjud emas')
        },
        middleware: async ({ chat_id, id }) => {
            let user = await infoUser({ chat_id })
            return get(user, 'job_title') == 'User' && get(user, 'custom.test.productId') && id == get(user, 'custom.test.messageId')
        },
    }
}


let postThenFn = async ({ user, chat_id }) => {
    let categories = get(user, 'custom.categories', [])
    let product = get(user, 'custom.product', [])
    let text = `*🛠️ Mahsulotni tanlang*\n\n` +
        `*🔍 Mahsulot joyi*: \`${get(categories, 'name.textUzLat', '')} > ${get(product, '[0].category.name.textUzLat')}\`\n\n` +
        `Iltimos, quyidagi mahsulotlardan birini tanlang:`



    let productBtn = product.filter(item => !item.isDisabled).map(item => {
        return { name: get(item, 'name.textUzLat', '-'), id: get(item, 'id') }
    })
    let obj = {
        'User': 'productUser',
        'Admin': 'productAdmin'
    }
    let btn = await dataConfirmBtnEmp(chat_id, productBtn, 2, obj[get(user, 'job_title')])
    if (uncategorizedProduct.includes(Number(get(product, '[0].category.id', '0')))) {
        btn.reply_markup.inline_keyboard = [...btn.reply_markup.inline_keyboard.filter(item => item[0].callback_data != 'backToCategory'), [{
            text: `🔙 Katalogga qaytish`,
            callback_data: 'backToCatalog'
        }]]
    }

    await sendMessageHelper(chat_id, text, { ...btn, parse_mode: 'MarkdownV2' })
}

let helperTestCallback = async ({ user, chat_id, questions, count }) => {
    let oneQuestion = questions[0]
    let photoUrl = get(oneQuestion, 'photo[0].file_id')
    let text = `${count}\\-*Savol* : ${escapeMarkdown(get(oneQuestion, 'answerText', '-'))}`

    let btnList = filterAndShuffleQuestions(get(oneQuestion, 'answers', []).map(item => {
        return { name: item, id: `${oneQuestion.id}#${item == oneQuestion.correct}` }
    }))

    let btn = await dataConfirmBtnEmp(chat_id, btnList, Math.ceil(btnList.length / 2), 'test')
    let messageId;
    if (photoUrl) {
        try {
            messageId = await bot.sendPhoto(chat_id, photoUrl, {
                caption: text,
                parse_mode: 'MarkdownV2',
                ...btn
            });
        } catch (e) {
            messageId = await sendMessageHelper(chat_id, text, { ...btn, parse_mode: 'MarkdownV2' });
        }
    }
    else {
        messageId = await sendMessageHelper(chat_id, text, { ...btn, parse_mode: 'MarkdownV2' });
    }

    updateCustom(chat_id, {
        test: {
            ...get(user, 'custom.test', {}),
            messageId: messageId.message_id
        },
    })
    return
}

module.exports = {
    adminCallBack,
    adminTestManagement,
    updateTestCallBack,
    userCallback,
    userStartTestCallback
}