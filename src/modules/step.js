const { get } = require("lodash");
const { bot, rolesList, emoji } = require("../config");
const { infoUser, sendMessageHelper, updateUser, updateCustom, validatePositiveInteger, updateBack } = require("../helpers");
const { empDynamicBtn } = require("../keyboards/function_keyboards");
const { dataConfirmBtnEmp } = require("../keyboards/inline_keyboards");
const { confirmTestAdmin } = require("../keyboards/text");
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

let adminTestManagementStep = {
    "22": {
        selfExecuteFn: async ({ chat_id, msgText }) => {
            let user = await infoUser({ chat_id })
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
        },
        middleware: async ({ chat_id }) => {
            let user = await infoUser({ chat_id })
            return get(user, 'job_title') == 'Admin' && get(user, 'confirmed') && get(user, 'user_step') == 22 && get(user, 'custom.in_process')
        },
    },
    "23": {
        selfExecuteFn: async ({ chat_id, msgText }) => {
            if (!validatePositiveInteger(msgText) || Number(msgText) < 0 || Number(msgText) > 10) {
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
                    confirmTestAdmin({
                        ...get(newUser, 'custom.selectedProduct', {}),
                        listAnswers: { ...listAnswersObj, [i]: msgText },
                        correct: correctIndex + 1 == i ? msgText : '',
                        chat_id,
                        product: get(newUser, 'custom.product', []).find(item => item.id == get(newUser, 'custom.selectedProduct.id'))
                    })
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