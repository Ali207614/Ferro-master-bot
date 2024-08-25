const { get } = require("lodash")
const { infoUser, updateUser, updateData } = require("../helpers")
const { mainMenuByRoles } = require("./keyboards")

const dataConfirmBtnEmp = async (chat_id = '', list = [], count = 1, cbName = '', pagination = { prev: 0, next: 10 }) => {

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
        'category': 'paginationCategory',
    }

    // let backCb = {
    //     'category': 'backCategory'
    // }

    if (result.length > 10) {
        let paginationBtn = [
            prev == 0 ? undefined : { text: '⬅️Oldingi', callback_data: `${objCb[cbName]}#prev#${prev}` },
            nextCount != 0 ? { text: 'Keyingi➡️', callback_data: `${objCb[cbName]}#next#${next}` } : undefined
        ]

        arr.push(paginationBtn.filter(item => item))
    }
    // if (['category'].includes(cbName)) {
    //     arr.push([
    //         {
    //             text: '⬅️⬅️Tovar belgisiga qaytish',
    //             callback_data: backCb[cbName]
    //         }
    //     ])
    // }

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