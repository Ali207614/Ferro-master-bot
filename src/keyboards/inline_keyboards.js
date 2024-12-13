const { get } = require("lodash")
const { mainMenuByRoles } = require("./keyboards")

const dataConfirmBtnEmp = async (chat_id = '', list = [], count = 1, cbName = '', pagination = { prev: 0, next: 10 }) => {
    const { infoUser, updateUser } = require("../helpers")

    let user = await infoUser({ chat_id })

    let arr = []
    let result = list
    let next = get(pagination, 'next', 0)
    let prev = get(pagination, 'prev', 10)
    let nextCount;
    if (result.length > 10) {
        nextCount = list.slice(prev, +next + 1).length - list.slice(prev, next).length
        list = list.slice(prev, next)
        if (user) {
            updateUser(chat_id, { select: { ...get(user, 'select', {}), pagination: { next, prev } } })
        }
    }
    for (let i = 0; i < list.length; i += count) {
        let el = list
        arr.push(el.slice(i, i + count).map(itemData => {
            return { text: itemData.name, callback_data: `${cbName}#${itemData.id}` }
        }))
    }

    let objCb = {
        'loginList': 'paginationConfirmLoginList',
        'userList': 'paginationUserList',
        'userListSearch': 'paginationUserListSearch',
        'categoriesAdmin': "paginationCategoriesAdmin",
        'productAdmin': "paginationProductAdmin",
        'productUser': "paginationProductUser",
        'childProduct': "paginationChildProduct"
    }

    let backCb = {
        'categoriesAdmin': {
            text: `🔙 Katalogga qaytish`,
            callback_data: 'backToCatalog'
        },
        'productAdmin': {
            text: `🔙 Kategoriyaga qaytish`,
            callback_data: 'backToCategory'
        },
        'productUser': {
            text: `🔙 Kategoriyaga qaytish`,
            callback_data: 'backToCategory'
        },
        'childProduct': {
            text: `🔙 Mahsulotga qaytish`,
            callback_data: 'backToChildProduct'
        }
    }


    if (result.length > 10) {

        let countNext = (result.length - next) > 10 ? 10 : (result.length - next)
        let paginationBtn = [
            prev == 0 ? undefined : { text: `⬅️${10} - Oldingi`, callback_data: `${objCb[cbName]}#prev#${prev}` },
            nextCount != 0 ? { text: `Keyingi + ${countNext}➡️`, callback_data: `${objCb[cbName]}#next#${next}` } : undefined
        ]

        arr.push(paginationBtn.filter(item => item))
    }
    if (Object.keys(backCb).includes(cbName)) {
        arr.push([backCb[cbName]])
    }

    let keyboard = {
        reply_markup: {
            inline_keyboard: arr,
            resize_keyboard: true,
        },
    };
    return keyboard
}



module.exports = {
    dataConfirmBtnEmp
}