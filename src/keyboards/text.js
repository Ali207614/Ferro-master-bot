const { emojiWithName } = require("../config");


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

let updateUserInfo = (newUser, confirmed, admin) => {
    let text = `
*${confirmed ? "Confirmed" : "Rejected"} by ${admin.last_name} ${admin.first_name} ${confirmed ? '✅' : '❌'}*

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


module.exports = { newUserInfo, updateUserInfo, confirmLoginText }