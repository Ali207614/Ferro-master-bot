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



let confirmTestAdmin = ({ chat_id, id, text, count, listAnswers, correct, product }) => {
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

    // Xabarni jo'natish
    bot.sendMessage(chat_id, confirmationMessage, confirmationButtons);
}

let TestAdminInfo = ({ chat_id, text, count, listAnswers, correct, product, createdBy }) => {
    const answersText = Object.entries(listAnswers)
        .map(([key, value], i) => `📍 ${i + 1}. ${value}`)
        .join('\n');

    const confirmationMessage = `
✅ <b>Test Muvaffaqiyatli qo'shildi!</b>

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

    // Xabarni jo'natish
    // bot.sendMessage(chat_id, confirmationMessage, { parse_mode: 'HTML' });
    return confirmationMessage
}


module.exports = { newUserInfo, updateUserInfo, confirmLoginText, deleteUserInfo, userDeleteInfo, confirmTestAdmin, TestAdminInfo }