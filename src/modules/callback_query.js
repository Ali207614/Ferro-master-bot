const { get } = require("lodash")
const { bot, rolesList, emoji, uncategorizedProduct } = require("../config")
const ferroController = require("../controllers/ferroController")
const { infoUser, updateUser, deleteUser, sendMessageHelper, updateCustom, updateBack, updateStep } = require("../helpers")
const { empDynamicBtn } = require("../keyboards/function_keyboards")
const { dataConfirmBtnEmp } = require("../keyboards/inline_keyboards")
const { mainMenuByRoles, option } = require("../keyboards/keyboards")
const { updateUserInfo, newUserInfo, confirmLoginText, userDeleteInfo } = require("../keyboards/text")
const Catalog = require("../models/Catalog")
const Product = require("../models/Product")
const User = require("../models/User")
require('dotenv').config();


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

let adminTestManagement = {
    catalogAdmin: {
        selfExecuteFn: async ({ chat_id, data, msg }) => {
            let categories = await Catalog.findOne({ id: data[1] })
            let text = `*🛠️ Kategoriyani tanlang*\n\n` +
                `*🔍 Kategoriya joyi*: \`Katalog > ${get(categories, 'name.textUzLat', '')}\`\n\n` +
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
            return get(user, 'job_title') == 'Admin'
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
            let text = `*🛠️ Mahsulotni tanlang*\n\n` +
                `*🔍 Mahsulot joyi*: \`Katalog > ${get(product, '[0].category.parent.name.textUzLat', '')} > ${get(product, '[0].category.name.textUzLat')}\`\n\n` +
                `Iltimos, quyidagi mahsulotlardan birini tanlang:`
            let productBtn = product.filter(item => !item.isDisabled).map(item => {
                return { name: get(item, 'name.textUzLat', '-'), id: get(item, 'id') }
            })
            let btn = await dataConfirmBtnEmp(chat_id, productBtn, 2, 'productAdmin')
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
            let oldCategories = get(user, 'custom.categories', {})


            updateCustom(chat_id, {
                product,
                categories: newParent
            })

            return
        },
        middleware: async ({ chat_id, id }) => {
            let user = await infoUser({ chat_id })
            return get(user, 'job_title') == 'Admin'
        },
    },
    paginationProductAdmin: {
        selfExecuteFn: async ({ chat_id, data, msg }) => {
            let user = await infoUser({ chat_id })
            let categories = get(user, 'custom.categories', [])
            let product = get(user, 'custom.product', [])
            let text = `*🛠️ Mahsulotni tanlang*\n\n` +
                `*🔍 Mahsulot joyi*: \`Katalog > ${get(categories, 'name.textUzLat', '')} > ${get(product, '[0].category.name.textUzLat')}\`\n\n` +
                `Iltimos, quyidagi mahsulotlardan birini tanlang:`

            let pagination = data[1] == 'prev' ? { prev: +data[2] - 10, next: data[2] } : { prev: data[2], next: +data[2] + 10 }


            let productBtn = product.filter(item => !item.isDisabled).map(item => {
                return { name: get(item, 'name.textUzLat', '-'), id: get(item, 'id') }
            })

            let btn = await dataConfirmBtnEmp(chat_id, productBtn, 2, 'productAdmin', pagination)
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
            return get(user, 'job_title') == 'Admin'
        },
    },
    paginationCategoriesAdmin: {
        selfExecuteFn: async ({ chat_id, data, msg }) => {
            let user = await infoUser({ chat_id })
            let categories = get(user, 'custom.categories', {})
            let subCategory = get(user, 'custom.subCategory', [])
            let text = `*🛠️ Kategoriyani tanlang*\n\n` +
                `*🔍 Kategoriya joyi*: \`Katalog > ${get(categories, 'name.textUzLat', '')}\`\n\n` +
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
            return get(user, 'job_title') == 'Admin'
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
            return get(user, 'job_title') == 'Admin'
        },
    },
    backToCategory: {
        selfExecuteFn: async ({ chat_id, data, msg }) => {
            let user = await infoUser({ chat_id })
            let categories = get(user, 'custom.categories', {})
            let subCategory = get(user, 'custom.subCategory', [])
            let text = `*🛠️ Kategoriyani tanlang*\n\n` +
                `*🔍 Kategoriya joyi*: \`Katalog > ${get(categories, 'name.textUzLat', '')}\`\n\n` +
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
            return get(user, 'job_title') == 'Admin'
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
                await bot.deleteMessage(chat_id, user.custom.productMessageId);
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
    }


}

module.exports = {
    adminCallBack,
    adminTestManagement
}