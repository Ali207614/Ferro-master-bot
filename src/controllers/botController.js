const { get } = require("lodash");
const ExcelJS = require('exceljs');
const { pipeline } = require('stream');
const { promisify } = require('util');
const pipelineAsync = promisify(pipeline);
const fs = require('fs');
let { bot, rolesList, token } = require("../config");
const { infoUser, sendMessageHelper, updateCustom, updateUser, updateQuestion, updateThenFn, sleepNow, updateStep } = require("../helpers");
const { empDynamicBtn } = require("../keyboards/function_keyboards");
const { dataConfirmBtnEmp } = require("../keyboards/inline_keyboards");
const { option, mainMenuByRoles } = require("../keyboards/keyboards");
const { newUserInfo } = require("../keyboards/text");
const User = require("../models/User");
const { adminCallBack, adminTestManagement, updateTestCallBack, userCallback, userStartTestCallback } = require("../modules/callback_query");
const { adminText, adminTestManagementStep, handleAnswerManagement } = require("../modules/step");
const { adminBtn, executeBtn, adminTestManagementBtn, userBtn, masterBtn } = require("../modules/text");
const b1Controller = require('./b1Controller');
const NewProduct = require("../models/NewProduct");
const Product = require("../models/Product");
const Question = require("../models/Question");
const { default: mongoose } = require("mongoose");
const fetch = require('node-fetch')
class botConroller {
    async text(msg, chat_id) {
        try {
            let user = await infoUser({ chat_id });

            if (get(user, 'confirmed') === false) {
                sendMessageHelper(chat_id, "Tasdiqlash uchun Adminga jo'natilgan", option)
                return
            }


            let btnTree = {
                ...adminBtn,
                ...executeBtn,
                ...adminTestManagementBtn,
                ...userBtn,
                ...masterBtn
            }
            let stepTree = {
                ...adminText,
                ...adminTestManagementStep,
                ...await handleAnswerManagement({ chat_id })
            }
            if (msg.text == "/start") {
                sendMessageHelper(
                    chat_id,
                    "Assalomu Aleykum",
                    get(user, 'confirmed') ? await mainMenuByRoles({ chat_id }) : option
                );
                if (user) {
                    updateUser(chat_id, {
                        back: [],
                        custom: {
                            ...get(user, 'custom', {}),
                            productMessageId: '',
                            in_process: false,
                            selectedProduct: {},
                            updateId: '',
                            test: {},
                            answers: [],
                            searchResult: []
                        }
                    })
                }

                return
            }
            else if (msg.text == '/info') {

            }
            else if (
                btnTree[msg.text] && get(user, "user_step", 0) >= 1
            ) {
                let btnTreeList = [
                    adminBtn,
                    executeBtn,
                    adminTestManagementBtn,
                    userBtn,
                    masterBtn
                ]
                let execute;
                for (let item of btnTreeList) {
                    if (await item[msg.text]?.middleware({ chat_id, msgText: msg.text })) {
                        execute = item;
                        break; // Topilgan birinchi elementdan keyin chiqish
                    }
                }
                execute = execute ? execute[msg.text] : {}
                if (await get(execute, 'middleware', () => { })({ chat_id, msgText: msg.text })) {
                    await execute?.selfExecuteFn ? await execute.selfExecuteFn({ chat_id }) : undefined
                    if (execute?.next) {
                        let textBot = await execute?.next?.text({ chat_id })
                        let btnBot = await execute?.next?.btn ? await execute?.next?.btn({ chat_id, msg }) : undefined
                        let botInfo = await execute?.next?.file ? bot.sendDocument(chat_id, await execute?.next?.file({ chat_id }), btnBot) :
                            sendMessageHelper(chat_id, textBot, btnBot)
                        let lastMessageId = await botInfo
                        updateUser(chat_id, { lastMessageId: lastMessageId?.message_id })
                    }
                }
            }
            else if (
                stepTree[get(user, 'user_step', '1').toString()]
            ) {
                let execute = stepTree[get(user, 'user_step', '1').toString()]
                if (await get(execute, 'middleware', () => { })({ chat_id, msgText: msg.tex })) {
                    await execute?.selfExecuteFn ? await execute.selfExecuteFn({ chat_id, msgText: msg.text }) : undefined
                    if (execute?.next) {
                        let textBot = await execute?.next?.text({ chat_id, data })
                        let btnBot = await execute?.next?.btn ? await execute?.next?.btn({ chat_id, data, msg }) : undefined
                        let botInfo = await execute?.next?.file ? bot.sendDocument(chat_id, await execute?.next?.file({ chat_id }), btnBot) :
                            sendMessageHelper(chat_id, textBot, btnBot)
                        let lastMessageId = await botInfo
                        updateUser(chat_id, { lastMessageId: lastMessageId?.message_id })
                    }
                }
            }
        }
        catch (err) {
            throw new Error(err);
        }
    }

    async callback_query(msg, data, chat_id) {
        try {
            let user = await infoUser({ chat_id });
            if (get(user, 'confirmed') === false) {
                sendMessageHelper(chat_id, "Tasdiqlash uchun Adminga jo'natilgan", option)
                return
            }
            let callbackTree = {
                ...adminCallBack,
                ...adminTestManagement,
                ...updateTestCallBack,
                ...userCallback,
                ...userStartTestCallback
            }
            if (user) {
                if (callbackTree[data[0]]) {
                    let callbackTreeList = [
                        adminCallBack,
                        adminTestManagement,
                        updateTestCallBack,
                        userCallback,
                        userStartTestCallback
                    ]
                    let execute = callbackTreeList.find(item => item[data[0]] && item[data[0]]?.middleware({ chat_id, data, msgText: msg.text, id: get(msg, 'message.message_id', 0) }))
                    execute = execute ? execute[data[0]] : {}
                    if (await get(execute, 'middleware', () => { })({ chat_id, data, msgText: msg.text, id: get(msg, 'message.message_id', 0) })) {

                        await execute?.selfExecuteFn ? await execute.selfExecuteFn({ chat_id, data, msg }) : undefined
                        if (execute?.next) {
                            let textBot = await execute?.next?.text({ chat_id, data })
                            let btnBot = await execute?.next?.btn ? await execute?.next?.btn({ chat_id, data, msg }) : undefined

                            let botInfo = await execute?.next?.update ? bot.editMessageText(await execute?.next?.text({ chat_id, data }), { chat_id, message_id: +user.lastMessageId, ...(await execute?.next?.btn ? await execute?.next?.btn({ chat_id, data, msg }) : undefined) }) : (await execute?.next?.file ? bot.sendDocument(chat_id, await execute?.next?.file({ chat_id, data }), await execute?.next?.btn ? await execute?.next?.btn({ chat_id, data, msg }) : undefined) :
                                sendMessageHelper(chat_id, textBot, btnBot))
                            let botId = await botInfo
                            updateUser(chat_id, { lastMessageId: botId.message_id })
                        }
                    }
                }
            }
        } catch (err) {
            throw new Error(err);
        }
    }

    async contact(msg, chat_id) {
        try {
            let user = await infoUser({ chat_id });
            if (user) {
                let isConfirm = get(user, 'confirmed')
                let text = isConfirm ? `Assalomu Aleykum` : `Tasdiqlash uchun Adminga jo'natilgan`
                let btn = isConfirm ? mainMenuByRoles({ chat_id }) : option
                sendMessageHelper(chat_id, text, btn)
                return
            }
            let phone = get(msg, "contact.phone_number", "").replace(/\D/g, "");
            let deleteMessage = await sendMessageHelper(chat_id, 'Loading...')
            let sap_user = await b1Controller.getBusinessPartnerByPhone(phone);

            if (sap_user.length == 1) {
                if (!rolesList.includes(sap_user[0].jobTitle)) {
                    sendMessageHelper(chat_id, 'Job title xato kiritilgan', option)
                    bot.deleteMessage(chat_id, deleteMessage.message_id)
                    return
                }
                if (sap_user[0].jobTitle == 'User') {
                    let master = await User.findOne({ emp_id: sap_user[0].U_Master, job_title: "Master" })
                    if (!master) {
                        sendMessageHelper(
                            chat_id,
                            "Master mavjud emas",
                            option
                        );
                        bot.deleteMessage(chat_id, deleteMessage.message_id)
                        return
                    }
                }
                const newUser = new User({
                    chat_id: chat_id,
                    job_title: sap_user[0].jobTitle,
                    user_step: 1,
                    mobile: sap_user[0].mobile,
                    emp_id: sap_user[0].empID,
                    first_name: sap_user[0].firstName,
                    last_name: sap_user[0].lastName,
                    back: [],
                    lastMessageId: '',
                    master: sap_user[0]?.U_Master
                });
                await newUser.save();

                bot.deleteMessage(chat_id, deleteMessage.message_id)

                const admins = await User.find({
                    job_title: 'Admin',
                    confirmed: true,
                    chat_id: { $ne: chat_id }
                }, 'chat_id')
                let listAdmin = []
                for (let i = 0; i < admins.length; i++) {
                    let btn = await dataConfirmBtnEmp(chat_id, [{ name: '✅ Ha', id: `1#${chat_id}` }, { name: '❌ Bekor qilish', id: `2#${chat_id}` }], 2, 'confirmNewUser')
                    let botId = await bot.sendMessage(admins[i].chat_id, newUserInfo(sap_user, newUser), {
                        parse_mode: 'MarkdownV2',
                        ...btn
                    });
                    listAdmin.push({ id: botId.message_id, chat_id: admins[i].chat_id })
                }
                if (listAdmin.length) {
                    await updateCustom(chat_id, { listAdmin })
                }
                sendMessageHelper(
                    chat_id,
                    "Adminga tasdiqlash uchun jo'natildi ⏳",
                    option
                );

                return
            }
            else {
                bot.deleteMessage(chat_id, deleteMessage.message_id)

                sendMessageHelper(chat_id, "Foydalanuvchi tasdiqlanmadi (SAP da mavjud emas yokida raqamlar ikkita) ❌", option);
                return
            }
        } catch (err) {
            throw new Error(err);
        }
    }

    async photo(msg, chat_id) {
        try {
            let user = await infoUser({ chat_id })
            if (get(user, 'job_title') == 'Admin' && get(user, 'confirmed') && get(user, 'user_step') == 21) {
                if (get(user, 'custom.updateId')) {
                    updateQuestion(get(user, 'custom.updateId'), { photo: get(msg, 'photo') })
                    sendMessageHelper(chat_id, `✅ O'zgartirildi`,
                        await mainMenuByRoles({ chat_id })
                    )

                    await sleepNow(300)

                    updateThenFn(get(user, 'custom.updateId'))
                    updateUser(chat_id, {
                        custom: {
                            ...get(user, 'custom', {}),
                            updateId: '',
                            in_process: false
                        }
                    })
                }
                else {
                    let text = `✏️ Savolingizni kiriting`
                    let btn = empDynamicBtn()
                    sendMessageHelper(chat_id, text, btn)
                    updateUser(chat_id, {
                        user_step: 22,
                        custom: {
                            ...get(user, 'custom', {}),
                            selectedProduct:
                            {
                                ...get(user, 'custom.selectedProduct', {}),
                                photo: get(msg, 'photo')
                            }
                        }
                    })
                }

            }
        } catch (err) {
            throw new Error(err);
        }
    }

    async getNextSequence(name) {
        const sequenceDoc = await mongoose.model('Counter_id').findOneAndUpdate(
            { id: name },
            { $inc: { seq: 1 } },
            {
                returnDocument: "after",
                upsert: true
            }
        );
        return sequenceDoc.seq;
    };

    async document(msg, chat_id, file_id) {
        try {
            let user = await infoUser({ chat_id })
            if (get(user, 'user_step') != 600) {
                return
            }
            let deleteMessage = await sendMessageHelper(chat_id, 'Loading...')

            const fileInfo = await bot.getFile(file_id);
            const filePath = fileInfo.file_path;
            const fileUrl = `https://api.telegram.org/file/bot${token}/${filePath}`;

            // Faylni vaqtinchalik yuklash
            const fileName = `temp_${msg.document.file_name}`;
            const response = await fetch(fileUrl);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Faylni stream orqali saqlash
            const fileStream = fs.createWriteStream(fileName);
            await pipelineAsync(response.body, fileStream);

            // Excel faylni o'qish
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(fileName);

            const worksheet = workbook.getWorksheet(1); // Birinchi sahifa
            const data = [];

            // Birinchi qatordagi ustun nomlarini olish
            const header = [];
            worksheet.getRow(1).eachCell((cell, colNumber) => {
                header.push(cell.value); // Ustun nomlarini yig'ish
            });

            // Qolgan qatorlarni obyekt sifatida yig'ish
            worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
                if (rowNumber === 1) return; // Birinchi qatordan o'tib ketamiz

                const rowData = {};
                row.eachCell((cell, colNumber) => {
                    rowData[header[colNumber - 1]] = cell.value; // Ustun nomini kalit sifatida ishlatish
                });
                data.push(rowData);
            });
            let wrongAnswers = []
            let filteredData = data.filter(item => {
                let answersList = Object.keys(item).filter(el => el.includes('Answer')).map(el => (item[el] || '').toString().trim())
                if (answersList.length > 0 && [...new Set(answersList)].length == answersList.length && answersList.includes((get(item, 'Correct', '') || '').toString().trim())) {
                    return get(item, 'ID') && get(item, 'Question') && get(item, 'Correct')
                }
                if (answersList.length == 0) {
                    wrongAnswers.push({ ID: item?.ID || '', No: item?.No || 0, message: "Javoblar mavjud emas" })
                }
                else if ([...new Set(answersList)].length != answersList.length) {
                    wrongAnswers.push({ ID: item?.ID || '', No: item?.No || 0, message: "Javoblar bir xil" })
                }
                else if (!answersList.includes((get(item, 'Correct', '') || '').toString().trim())) {
                    wrongAnswers.push({ ID: item?.ID || '', No: item?.No || 0, message: "To'gri javob yo'q" })
                }
                else if (!get(item, 'ID')) {
                    wrongAnswers.push({ ID: item?.ID || '', No: item?.No || 0, message: "ID majvud emas" })
                }
                else if (!get(item, 'Question')) {
                    wrongAnswers.push({ ID: item?.ID || '', No: item?.No || 0, message: "Savol majvud emas" })
                }
                else {
                    wrongAnswers.push({ ID: item?.ID || '', No: item?.No || 0, message: "❌" })
                }
                return false
            })


            let newProductIds = filteredData
                .filter(item => item?.Status == 'true')
                .map(item => get(item, 'ID'));

            let productIds = filteredData
                .filter(item => item?.Status == 'false')
                .map(item => get(item, 'ID'));

            // newProduct va product kolleksiyalariga IN qilib topish
            let newProductList = await NewProduct.find({ id: { $in: newProductIds } });
            let productList = await Product.find({ id: { $in: productIds } });

            // Barcha ma'lumotlarni birlashtirish
            let allProducts = [...newProductList, ...productList];
            // Question kolleksiyasiga qo'shiladigan ma'lumotlarni tayyorlash
            let questionsToInsert = await Promise.all(filteredData.map(async (el) => {
                let product = allProducts.find(item => item.id == el.ID)
                if (!product) {
                    return null
                }
                let isNewProduct = newProductIds.find(e => e == (String(product.id)));

                const newQuestionId = await this.getNextSequence('id');

                return {
                    id: newQuestionId,  // Avtomatik oshirilgan ID
                    chat_id: chat_id,
                    productId: product.id,
                    name: {
                        id: product.id,
                        textUzLat: get(product, 'name.textUzLat'),
                        textUzCyr: get(product, 'name.textUzCyr'),
                        textRu: get(product, 'name.textRu')
                    },
                    category: get(product, 'category'),
                    answerText: get(el, 'Question'),
                    answers: Object.keys(el)
                        .filter(key => key.includes('Answer'))
                        .map(key => el[key]),
                    correct: get(el, 'Correct'),
                    createdByChatId: chat_id,
                    createdAt: Date.now(),
                    newProducts: isNewProduct ? true : false
                };
            }))
            questionsToInsert = questionsToInsert.filter(Boolean);
            let insertedQuestions = await Question.insertMany(questionsToInsert);
            let wrongTextList = ``
            wrongAnswers.forEach((item, i) => {
                wrongTextList += `ID: ${get(item, 'ID', '')} || Qator: ${get(item, 'No', '')} || Sabab: ${get(item, 'message', '')}\n`
            })
            let text = `📄 Savollar bo'yicha ma'lumot\n\nUmumiy savollar soni : ${data.length} ta\nQo'shilgan savollar soni : ${insertedQuestions.length} ta ✅\nXato savollar soni : ${data.length - insertedQuestions.length} ta ❌\n\n${wrongTextList}`
            bot.deleteMessage(chat_id, deleteMessage.message_id)
            await updateStep(chat_id, 1)
            await sendMessageHelper(chat_id, text, await mainMenuByRoles({ chat_id }))

            fs.unlinkSync(fileName);
        } catch (error) {
            throw new Error(error);
        }
    }

}

module.exports = new botConroller();


