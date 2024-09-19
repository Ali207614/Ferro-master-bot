const { get } = require("lodash");
const { bot, rolesList, emoji } = require("../config");
const ferroController = require("../controllers/ferroController");
const { infoUser, sendMessageHelper, updateUser, updateCustom, validatePositiveInteger, updateBack, updateQuestion, updateThenFn, sleepNow } = require("../helpers");
const { empDynamicBtn } = require("../keyboards/function_keyboards");
const { dataConfirmBtnEmp } = require("../keyboards/inline_keyboards");
const { mainMenuByRoles } = require("../keyboards/keyboards");
const { confirmTestAdmin } = require("../keyboards/text");
const User = require("../models/User");

let adminText = {
    "10": {
        selfExecuteFn: async ({ chat_id, msgText }) => {
            let master = await infoUser({ chat_id })
            let users;
            if (get(master, 'job_title') == 'Master') {
                users = await User.find({
                    confirmed: true,
                    chat_id: { $ne: chat_id },
                    master: master.emp_id,
                    job_title: 'User',
                    $or: [
                        { first_name: { $regex: msgText, $options: 'i' } },
                        { last_name: { $regex: msgText, $options: 'i' } },
                        { emp_id: isNaN(msgText) ? undefined : msgText },
                        { mobile: { $regex: msgText, $options: 'i' } }
                    ]
                }).lean();
            }
            else {
                users = await User.find({
                    confirmed: true,
                    chat_id: { $ne: chat_id },
                    $or: [
                        { first_name: { $regex: msgText, $options: 'i' } },
                        { last_name: { $regex: msgText, $options: 'i' } },
                        { emp_id: isNaN(msgText) ? undefined : msgText },
                        { mobile: { $regex: msgText, $options: 'i' } }
                    ]
                }).lean();
            }

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
            return ['Admin', 'Master'].includes(get(user, 'job_title')) && get(user, 'confirmed') && get(user, 'user_step') == 10
        },
    },
    "500": {
        selfExecuteFn: async ({ chat_id, msgText }) => {
            if (msgText.length <= 2) {
                await sendMessageHelper(chat_id, `❗️ Xatolik!\n3 ta harfdan katta bo'lishi kerak`)
                return
            }
            let deleteMessage = await sendMessageHelper(chat_id, 'Loading...')

            let result = await ferroController.ferroSearchApi(msgText)
            if (result.length == 0) {
                await sendMessageHelper(chat_id, 'Mavjud emas')
                bot.deleteMessage(chat_id, deleteMessage.message_id)
                return
            }
            bot.deleteMessage(chat_id, deleteMessage.message_id)

            let text = `*🛠️ Iltimos, quyidagi mahsulotlardan birini tanlang*\n\n`
            let productBtn = result.map(item => {
                return { name: get(item, 'name', '-'), id: get(item, 'id') }
            })
            let btn = await dataConfirmBtnEmp(chat_id, productBtn, 2, 'productUser')
            btn.reply_markup.inline_keyboard = [...btn.reply_markup.inline_keyboard.filter(item => item[0].callback_data != 'backToCategory')]
            let botId = await sendMessageHelper(chat_id, text, { ...btn, parse_mode: "MarkdownV2" })
            updateCustom(chat_id, { searchResult: result })
            return
        },
        middleware: async ({ chat_id }) => {
            let user = await infoUser({ chat_id })
            return ['User'].includes(get(user, 'job_title')) && get(user, 'confirmed') && get(user, 'user_step') == 500
        },
    }
}

let adminTestManagementStep = {
    "22": {
        selfExecuteFn: async ({ chat_id, msgText }) => {
            let user = await infoUser({ chat_id })
            if (get(user, 'custom.updateId')) {
                updateQuestion(get(user, 'custom.updateId'), { answerText: msgText })
                sendMessageHelper(chat_id, `✅ O'zgartirildi`, await mainMenuByRoles({ chat_id }))
                await sleepNow(300)
                updateThenFn(get(user, 'custom.updateId'))
                updateCustom(chat_id, { updateId: '', in_process: false })
            }
            else {
                updateBack(chat_id, {
                    text: `✏️ Savolingizni kiriting`,
                    btn: empDynamicBtn(),
                    step: 22
                })
                let text = `Javoblar soni nechta bo'ladi?`
                let btn = empDynamicBtn()
                sendMessageHelper(chat_id, text, btn)
                updateUser(chat_id, {
                    user_step: 23,
                    custom: { ...get(user, 'custom', {}), selectedProduct: { ...get(user, 'custom.selectedProduct', {}), text: msgText } }
                })
            }

        },
        middleware: async ({ chat_id }) => {
            let user = await infoUser({ chat_id })
            return get(user, 'job_title') == 'Admin' && get(user, 'confirmed') && get(user, 'user_step') == 22 && get(user, 'custom.in_process')
        },
    },
    "23": {
        selfExecuteFn: async ({ chat_id, msgText }) => {
            if (msgText == 1 || !validatePositiveInteger(msgText) || Number(msgText) < 0 || Number(msgText) > 10) {
                let text = `❗️ Xatolik!\nJavoblar soni to'g'ri formatda bo'lishi kerak. Iltimos, faqat musbat butun son kiriting. Misol: 4`
                sendMessageHelper(chat_id, text)
                return
            }

            updateBack(chat_id, {
                text: `Javoblar soni nechta bo'ladi?`,
                btn: empDynamicBtn(),
                step: 23
            })
            let user = await infoUser({ chat_id })
            let text = `📝 1-ch xato javobni yozing`
            let btn = empDynamicBtn()
            sendMessageHelper(chat_id, text, btn)
            updateUser(chat_id, {
                user_step: 24,
                custom: {
                    ...get(user, 'custom', {}),
                    selectedProduct: { ...get(user, 'custom.selectedProduct', {}), count: msgText }
                }
            })
        },
        middleware: async ({ chat_id }) => {
            let user = await infoUser({ chat_id })
            return get(user, 'job_title') == 'Admin' && get(user, 'confirmed') && get(user, 'user_step') == 23 && get(user, 'custom.in_process')
        },
    },
}


const handleAnswerManagement = async ({ chat_id }) => {
    let user = await infoUser({ chat_id })
    let obj = {}
    for (let i = 24; i <= Number(get(user, 'custom.selectedProduct.count', '0')) + 23; i++) {
        let correctIndex = Number(get(user, 'custom.selectedProduct.count', '0')) + 22
        let lastIndex = correctIndex + 1
        obj[i] = {
            selfExecuteFn: async ({ chat_id, msgText }) => {
                let newUser = await infoUser({ chat_id })
                let listAnswersObj = get(newUser, 'custom.selectedProduct.listAnswers', {})
                let questionText = correctIndex + 1 == i ? `✅${i - 23}-ch to'gri javobni yozing` : `📝${i - 23}-ch xato javobni yozing`
                if (listAnswersObj[i] != msgText && Object.values(listAnswersObj).includes(msgText)) {
                    let text = `❗️ Xatolik!\nJavoblar bir xil bo'lmasligi kerak.\n\nQaytadan ${questionText}`
                    sendMessageHelper(chat_id, text)

                    return
                }
                updateBack(chat_id, {
                    text: questionText,
                    btn: empDynamicBtn(),
                    step: i
                })
                let text = correctIndex == i ? `✅${i - 22}-ch to'gri javobni yozing` : `📝${i - 22}-ch xato javobni yozing`
                let btn = empDynamicBtn()
                updateUser(chat_id, {
                    user_step: i + 1,
                    custom: {
                        ...get(newUser, 'custom', {}),
                        selectedProduct: {
                            ...get(newUser, 'custom.selectedProduct', {}),
                            listAnswers: { ...listAnswersObj, [i]: msgText },
                            correct: correctIndex + 1 == i ? msgText : ''
                        },
                    }
                })
                if (lastIndex == i) {

                    if (get(user, 'custom.updateId')) {
                        let answers = Object.values({ ...listAnswersObj, [i]: msgText })

                        updateQuestion(get(user, 'custom.updateId'),
                            {
                                answers,
                                correct: correctIndex + 1 == i ? msgText : ''
                            }
                        )
                        sendMessageHelper(chat_id, `✅ O'zgartirildi`, await mainMenuByRoles({ chat_id }))

                        await sleepNow(300)
                        updateThenFn(get(user, 'custom.updateId'))
                        updateUser(chat_id, {
                            custom: {
                                updateId: '',
                                in_process: false,
                                selectedProduct: { id: get(user, 'custom.selectedProduct.id', {}) }
                            }
                        })
                    }
                    else {
                        confirmTestAdmin({
                            ...get(newUser, 'custom.selectedProduct', {}),
                            listAnswers: { ...listAnswersObj, [i]: msgText },
                            correct: correctIndex + 1 == i ? msgText : '',
                            chat_id,
                            product: get(newUser, 'custom.product', []).find(item => item.id == get(newUser, 'custom.selectedProduct.id'))
                        })
                    }
                    return
                }
                sendMessageHelper(chat_id, text, btn)
                return
            },
            middleware: async ({ chat_id }) => {
                let user = await infoUser({ chat_id })
                return get(user, 'job_title') == 'Admin' && get(user, 'confirmed') && get(user, 'user_step') == i && get(user, 'custom.in_process')
            },
        }
    }
    return obj
}



module.exports = { adminText, adminTestManagementStep, handleAnswerManagement }