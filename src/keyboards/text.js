const { get } = require("lodash");
const { emojiWithName, bot } = require("../config");


let rolesList = ['Admin', 'Master', 'User']


let newUserInfo = (sap_user, newUser) => {
    let text = `
*📄 Name :* ${sap_user[0].lastName} ${sap_user[0].firstName}
*💼 Job Title :* **${emojiWithName[sap_user[0].jobTitle]}**
*📱 Number :* ${sap_user[0].mobile}
*🕒 Registered At :* ${newUser.created_at ? new Date(newUser.created_at).toLocaleString() : 'N/A'}
    
Do you confirm this information?
    `;
    return text
}

let deleteUserInfo = (newUser) => {
    let text = `
*📄 Name :* ${newUser.last_name} ${newUser.first_name}
*💼 Job Title :* **${emojiWithName[newUser.job_title]}**
*📱 Number :* ${newUser.mobile}
*🕒 Registered At :* ${newUser.created_at ? new Date(newUser.created_at).toLocaleString() : 'N/A'}
    
Do you delete this information?
    `;
    return text
}


let updateUserInfo = (newUser, confirmed, admin) => {
    let text = `
*${confirmed ? "Confirmed" : "Rejected"} by ${admin.last_name} ${admin.first_name} ${confirmed ? '✅' : '❌'}*

*📄 Name :* ${newUser.last_name} ${newUser.first_name}
*💼 Job Title :* **${emojiWithName[newUser.job_title]}**
*📱 Number :* ${newUser.mobile}
*🕒 Registered At :* ${newUser.created_at ? new Date(newUser.created_at).toLocaleString() : 'N/A'}`;
    return text
}


let userDeleteInfo = (newUser, admin) => {
    let text = `
*Deleted by ${admin.last_name} ${admin.first_name} ✅*

*📄 Name :* ${newUser.last_name} ${newUser.first_name}
*💼 Job Title :* **${emojiWithName[newUser.job_title]}**
*📱 Number :* ${newUser.mobile}
*🕒 Registered At :* ${newUser.created_at ? new Date(newUser.created_at).toLocaleString() : 'N/A'}`;
    return text
}

let confirmLoginText = (newUser) => {
    let text = `
*📄 Name :* ${newUser.last_name} ${newUser.first_name}
*💼 Job Title :* **${emojiWithName[newUser.job_title]}**
*📱 Number :* ${newUser.mobile}
*🕒 Registered At :* ${newUser.created_at ? new Date(newUser.created_at).toLocaleString() : 'N/A'}
    
Do you confirm this information?
    `;
    return text
}



let confirmTestAdmin = ({ chat_id, id, text, count, listAnswers, correct, product, photo }) => {
    const answersText = Object.entries(listAnswers)
        .map(([key, value], i) => `📍 ${i + 1}. ${value}`)
        .join('\n');

    const confirmationMessage = `
📝 <b>Test haqida ma'lumot:</b>

📦 <b>Mahsulot joyi:</b> ➡️ ${get(product, 'category.parent.name.textUzLat', 'Kategoriya')} > ${get(product, 'category.name.textUzLat', 'Subkategoriya')}
🔢 <b>Bosqich nomi:</b> 🏷️ ${get(product, 'name.textUzLat', 'Bosqich nomi')}
        
❓ <b>Savol:</b> ${text}
📊 <b>Umumiy javoblar soni:</b> ${count}
        
📜 <b>Foydalanuvchi javoblari:</b>
${answersText}
        
✅ <b>To'g'ri javob:</b> ${correct}
        
❓ Ushbu testni tasdiqlaysizmi?
        `;

    const confirmationButtons = {
        reply_markup: {
            inline_keyboard: [
                [{ text: "✅ Tasdiqlash", callback_data: "confirmTest#1" }, { text: "❌ Bekor qilish", callback_data: "confirmTest#2" }],
            ]
        },
        parse_mode: 'HTML'
    };

    if (photo?.length) {
        // Agar rasm bo'lsa, xabarni rasm bilan jo'natish


        try {
            bot.sendPhoto(chat_id, get(photo, `[0].file_id`), {
                caption: confirmationMessage,
                ...confirmationButtons
            });
        }
        catch (e) {
            bot.sendMessage(chat_id, confirmationMessage, confirmationButtons);
        }
    } else {
        // Agar rasm bo'lmasa, oddiy xabarni jo'natish
        bot.sendMessage(chat_id, confirmationMessage, confirmationButtons);
    }
}

let TestAdminInfo = ({ text, count, listAnswers, correct, product, createdBy, status = false }) => {
    const answersText = Object.entries(listAnswers)
        .map(([key, value], i) => `📍 ${i + 1}. ${value}`)
        .join('\n');

    const confirmationMessage = `
${status ? '' : `✅ <b>Test Muvaffaqiyatli qo'shildi!</b>`}

📝 <b>Test haqida ma'lumot:</b>

🆔 <b>Test ID:</b> ${get(product, 'id')}
👤 <b>Kim tomonidan qo'shilgan:</b> ${createdBy}

📦 <b>Mahsulot joyi:</b> ➡️ ${get(product, 'category.parent.name.textUzLat', 'Kategoriya')} > ${get(product, 'category.name.textUzLat', 'Subkategoriya')}
🔢 <b>Bosqich nomi:</b> 🏷️ ${get(product, 'name.textUzLat', 'Bosqich nomi')}
        
❓ <b>Savol:</b> ${text}
📊 <b>Umumiy javoblar soni:</b> ${count}
        
📜 <b>Foydalanuvchi javoblari:</b>
${answersText}
        
✅ <b>To'g'ri javob:</b> ${correct}

📅 <b>Qo'shilgan sana:</b> ${new Date(get(product, 'createdAt')).toLocaleDateString()}
        `;

    return confirmationMessage
}

let TestInfo = ({ answerText, count, answers, correct }) => {
    const answersTextList = Object.entries(answers)
        .map(([key, value], i) => `📍 ${i + 1}. ${value}`)
        .join('\n');

    const confirmationMessage = `
📝 <b>Test haqida ma'lumot:</b>

❓ <b>Savol:</b> ${answerText}
📊 <b>Umumiy javoblar soni:</b> ${answers?.length || 0}
        
📜 <b>Foydalanuvchi javoblari:</b>
${answersTextList}
        
✅ <b>To'g'ri javob:</b> ${correct}
        `;

    // Xabarni jo'natish
    // bot.sendMessage(chat_id, confirmationMessage, { parse_mode: 'HTML' });
    return confirmationMessage
}


function escapeMarkdown(text) {
    return text.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, '\\$1');
}

function generateProductText(product) {
    const name = escapeMarkdown(get(product, 'name.textUzLat', 'Noma\'lum'));
    const searchableName = escapeMarkdown(get(product, 'searchableName', 'Noma\'lum'));
    const unit = escapeMarkdown(get(product, 'unit.name.textUzLat', 'Noma\'lum'));

    let text = `🛠 *Mahsulot haqida ma'lumot:*\n\n`;
    text += `*🔍 Mahsulot joyi*: \`${get(product, 'parentProduct.category.parent.name.textUzLat', '')} > ${get(product, 'parentProduct.category.name.textUzLat')} > ${get(product, 'parentProduct.name.textUzLat')}\`\n\n`
    text += `*Nomi:* ${name}\n`;
    text += `*Qidirish nomi:* ${searchableName}\n`;
    text += `*Birlik:* ${unit}\n\n`;

    // Mahsulot xususiyatlarini qochirib qo'shish
    get(product, 'properties', []).forEach(prop => {
        const propName = escapeMarkdown(get(prop, 'propertyValue.property.name.textUzLat', 'Noma\'lum'));
        const propValue = escapeMarkdown(get(prop, 'propertyValue.value.textUzLat', 'Noma\'lum'));
        const propUnit = escapeMarkdown(get(prop, 'propertyValue.property.unit.name.textUzLat', ''));

        if (propValue) {
            text += `📏 *${propName}:* ${propValue} ${propUnit}\n`;
        } else {
            text += `📦 *${propName}:* Ma'lumot mavjud emas\n`;
        }
    });

    return text;
}


function generateTestText(question, master, date) {
    const confirmationMessage = `
📝 <b>Testlar haqida ma'lumot:</b>

📦 <b>Mahsulot joyi:</b> ➡️ ${get(question, '[0].category.parent.name.textUzLat', 'Kategoriya')} > ${get(question, '[0].category.name.textUzLat', 'Subkategoriya')}
🔢 <b>Bosqich nomi:</b> 🏷️ ${get(question, '[0].name.textUzLat', 'Bosqich nomi')}
    
❓ <b>Umumiy savollar soni:</b> ${question?.length || 0} ta
    
🎓 <b>Baholovchi</b> : ${master ? get(master, 'last_name', '') + ' ' + get(master, 'first_name', '') : 'Mavjud emas'}
`;

    if (date) {
        const formattedDate = new Date(date).toLocaleString('uz-UZ', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });
        return `${confirmationMessage}\n\n📅 <b>Boshlangan vaqt:</b> ${formattedDate}`;
    }

    return confirmationMessage
}


function generateTestResultText({ question, totalQuestions, answers = [], startDate, endDate, status = '' }) {
    // To'g'ri javoblarning foizini hisoblash
    let incorrectAnswers = answers.filter(item => !item.isCorrect).length
    let correctAnswers = answers.filter(item => item.isCorrect).length
    const correctPercentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);

    const timeDifference = new Date(endDate) - new Date(startDate); // Millisekundlarda farq
    const timeSpentMinutes = Math.floor(timeDifference / 60000); // To'liq minutlarni hisoblash
    const timeSpentSeconds = Math.floor((timeDifference % 60000) / 1000); // Qolgan sekundlarni hisoblas

    const formattedDate = new Date(endDate).toLocaleString('uz-UZ', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    });

    let statusObj = {
        0: `⏳ Hali tekshirilmagan`,
        1: `✅ Tekshirildi`,
        2: `❌ Rad etilgan`
    }

    let text = `
📝 <b>${statusObj[status] ? 'Oxirgi test natijangiz' : 'Test natijalari:'}</b>

📦 <b>Mahsulot joyi:</b> ➡️ ${get(question, 'category.parent.name.textUzLat', 'Kategoriya')} > ${get(question, 'category.name.textUzLat', 'Subkategoriya')}
🔢 <b>Bosqich nomi:</b> 🏷️ ${get(question, 'name.textUzLat', 'Bosqich nomi')}

📊 <b>Umumiy savollar soni:</b> ${totalQuestions} ta
✅ <b>To'g'ri javoblar:</b> ${correctAnswers} ta
❌ <b>Xato javoblar:</b> ${incorrectAnswers} ta
📈 <b>To'g'ri javoblar foizi:</b> ${correctPercentage}% 
⏳ <b>Ketgan vaqt:</b> ${timeSpentMinutes} minut ${timeSpentSeconds} sekund

📅 <b>Test tugagan sanasi:</b> ${formattedDate}

`;
    // if (statusObj[status]) {
    //     text += `🎓 <b>Baholovchi:</b> ${statusObj[status]}`
    // }
    return text
}


function generateTestResultTextConfirm({ question, totalQuestions, answers = [], startDate, endDate, status = '', user }) {
    let incorrectAnswers = answers.filter(item => !item.isCorrect).length
    let correctAnswers = answers.filter(item => item.isCorrect).length
    const correctPercentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);

    const timeDifference = new Date(endDate) - new Date(startDate); // Millisekundlarda farq
    const timeSpentMinutes = Math.floor(timeDifference / 60000); // To'liq minutlarni hisoblash
    const timeSpentSeconds = Math.floor((timeDifference % 60000) / 1000); // Qolgan sekundlarni hisoblas

    const formattedDate = new Date(endDate).toLocaleString('uz-UZ', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    });

    let head = status ? status == 1 ? 'Test natijasi tasdiqlandi ✅' : 'Test natijasi bekor qilindi ❌' : 'Test natijasini tasdiqlaysizmi ?'

    let text = `
📝 <b>${head}</b>

👤 <b>Test topshiruvchi:</b> ${get(user, 'last_name')} ${get(user, 'first_name')}

📦 <b>Mahsulot joyi:</b> ➡️ ${get(question, 'category.parent.name.textUzLat', 'Kategoriya')} > ${get(question, 'category.name.textUzLat', 'Subkategoriya')}
🔢 <b>Bosqich nomi:</b> 🏷️ ${get(question, 'name.textUzLat', 'Bosqich nomi')}

📊 <b>Umumiy savollar soni:</b> ${totalQuestions} ta
✅ <b>To'g'ri javoblar:</b> ${correctAnswers} ta
❌ <b>Xato javoblar:</b> ${incorrectAnswers} ta
📈 <b>To'g'ri javoblar foizi:</b> ${correctPercentage}% 
⏳ <b>Ketgan vaqt:</b> ${timeSpentMinutes} minut ${timeSpentSeconds} sekund

📅 <b>Test tugagan sanasi:</b> ${formattedDate}

    `;
    return text
}

module.exports = { newUserInfo, updateUserInfo, confirmLoginText, deleteUserInfo, userDeleteInfo, confirmTestAdmin, TestAdminInfo, TestInfo, generateProductText, generateTestText, escapeMarkdown, generateTestResultText, generateTestResultTextConfirm }