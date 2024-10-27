const TelegramAPi = require("node-telegram-bot-api");
const mongoose = require('mongoose');
require('dotenv').config();
const Question = require("../src/models/Question");


let token = process.env.token
const conn_params = {
    serverNode: process.env.server_node,
    // serverNode: process.env.server_node_local,
    uid: process.env.uid,
    pwd: process.env.password,
};

const db = process.env.db

let bot = new TelegramAPi(token, {
    polling: true,
});


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.mongo_url_local);
        // await mongoose.connect(process.env.mongo_url);


        let data = [
            {
                _id: ('66f7a8c29cb756d7b2a05f5b'),
                chat_id: 7113959453,
                productId: '1001009',
                photo: [],
                name: {
                    id: 1001009,
                    textUzLat: 'BOLT OQ DIN933',
                    textUzCyr: 'БОЛТ ОҚ DIN933',
                    textRu: 'БОЛТ ОЦИНКОВАННЫЙ DIN933'
                },
                category: {
                    id: 1000933,
                    name: {
                        id: 1019248,
                        textUzLat: 'Boltlar',
                        textUzCyr: 'Болтлар',
                        textRu: 'Болты'
                    },
                    parent: {
                        id: 1000058,
                        name: {
                            id: 1019245,
                            textUzLat: 'Mahkamlovchi',
                            textUzCyr: 'Маҳкамловчи',
                            textRu: 'Крепеж'
                        },
                        icon: {
                            id: 1005267,
                            name: 'cat_krepyoj.svg',
                            url: '2023_12_08_17_45_45_631_9778b779.svg',
                            size: 4307,
                            createdDate: ('2023-12-08T12:45:45.643Z')
                        },
                        isDisabled: false,
                        _id: ('66f7a6839cb756d7b2a05b2f')
                    },
                    isDisabled: false,
                    _id: ('66f7a6839cb756d7b2a05b2e')
                },
                answerText: 'Savollar',
                answers: ['javob', 'javob 1', 'xato', "to'g'ri"],
                correct: "to'g'ri",
                createdByChatId: '7113959453',
                isDeleted: false,
                createdAt: ('2024-09-28T06:57:06.360Z'),
                updatedAt: ('2024-09-28T06:57:06.362Z'),
                id: 21,
                __v: 0
            },
            {
                _id: ('66f7a9ca9cb756d7b2a05fba'),
                chat_id: 7113959453,
                productId: '1001009',
                photo: [],
                name: {
                    id: 1001009,
                    textUzLat: 'BOLT OQ DIN933',
                    textUzCyr: 'БОЛТ ОҚ DIN933',
                    textRu: 'БОЛТ ОЦИНКОВАННЫЙ DIN933'
                },
                category: {
                    id: 1000933,
                    name: {
                        id: 1019248,
                        textUzLat: 'Boltlar',
                        textUzCyr: 'Болтлар',
                        textRu: 'Болты'
                    },
                    parent: {
                        id: 1000058,
                        name: {
                            id: 1019245,
                            textUzLat: 'Mahkamlovchi',
                            textUzCyr: 'Маҳкамловчи',
                            textRu: 'Крепеж'
                        },
                        icon: {
                            id: 1005267,
                            name: 'cat_krepyoj.svg',
                            url: '2023_12_08_17_45_45_631_9778b779.svg',
                            size: 4307,
                            createdDate: ('2023-12-08T12:45:45.643Z')
                        },
                        isDisabled: false,
                        _id: ('66f7a6839cb756d7b2a05b2f')
                    },
                    isDisabled: false,
                    _id: ('66f7a6839cb756d7b2a05b2e')
                },
                answerText: 'Savol',
                answers: ['1', '2', '3', '4'],
                correct: '4',
                createdByChatId: '7113959453',
                isDeleted: false,
                createdAt: ('2024-09-28T07:01:30.885Z'),
                updatedAt: ('2024-09-28T07:01:30.888Z'),
                id: 22,
                __v: 0
            },
            {
                _id: ('671a1a4647f81e8b144a4600'),
                chat_id: 7113959453,
                productId: '1007007',
                photo: [
                    {
                        file_id: 'AgACAgIAAxkBAAIpGGcaGjEK9aO3GtUGFZTKJHRdlY7-AALY4DEbnQnZSHxj1dyi2TahAQADAgADbQADNgQ',
                        file_unique_id: 'AQAD2OAxG50J2Uhy',
                        file_size: 776,
                        width: 43,
                        height: 46
                    }
                ],
                name: {
                    id: 1007007,
                    textUzLat: 'SVERLO DRAPILA FERRO 16pcs',
                    textUzCyr: 'СВЕРЛО ДРАПИЛА FERRO 16pcs',
                    textRu: 'НАБОР КОРОНОК ПО ДЕРЕВУ FERRO 16pcs'
                },
                category: {
                    id: 1005301,
                    name: {
                        id: 1019225,
                        textUzLat: 'Koronkalar',
                        textUzCyr: 'Коронкалар',
                        textRu: 'Коронки',
                        textEn: 'Core drill'
                    },
                    parent: {
                        id: 1005271,
                        name: {
                            id: 1019262,
                            textUzLat: 'Elektr aksessuarlar',
                            textUzCyr: 'Электр аксессуарлар',
                            textRu: 'Расходные материалы для электроинструментов'
                        },
                        icon: {
                            id: 1005270,
                            name: 'tools_parts.svg',
                            url: '2023_12_08_18_41_10_499_67addc9d.svg',
                            size: 5050,
                            createdDate: ('2023-12-08T13:41:10.505Z')
                        },
                        isDisabled: false,
                        _id: ('671a19f147f81e8b144a44fc')
                    },
                    isDisabled: false,
                    _id: ('671a19f147f81e8b144a44fb')
                },
                answerText: 'bu qaysi harf?',
                answers: ['a', 'b', 'c', 'd'],
                correct: 'd',
                createdByChatId: '7113959453',
                isDeleted: false,
                createdAt: ('2024-10-24T09:58:30.539Z'),
                updatedAt: ('2024-10-24T09:58:30.543Z'),
                id: 23,
                __v: 0
            },
            {
                _id: ('671a1a9547f81e8b144a465b'),
                chat_id: 7113959453,
                productId: '1007007',
                photo: [
                    {
                        file_id: 'AgACAgIAAxkBAAIpLGcaGoJgoG0evxZ84nXvCJeQBAG0AALZ4DEbnQnZSG453KO49fvSAQADAgADcwADNgQ',
                        file_unique_id: 'AQAD2eAxG50J2Uh4',
                        file_size: 939,
                        width: 61,
                        height: 90
                    },
                    {
                        file_id: 'AgACAgIAAxkBAAIpLGcaGoJgoG0evxZ84nXvCJeQBAG0AALZ4DEbnQnZSG453KO49fvSAQADAgADbQADNgQ',
                        file_unique_id: 'AQAD2eAxG50J2Uhy',
                        file_size: 1784,
                        width: 95,
                        height: 140
                    }
                ],
                name: {
                    id: 1007007,
                    textUzLat: 'SVERLO DRAPILA FERRO 16pcs',
                    textUzCyr: 'СВЕРЛО ДРАПИЛА FERRO 16pcs',
                    textRu: 'НАБОР КОРОНОК ПО ДЕРЕВУ FERRO 16pcs'
                },
                category: {
                    id: 1005301,
                    name: {
                        id: 1019225,
                        textUzLat: 'Koronkalar',
                        textUzCyr: 'Коронкалар',
                        textRu: 'Коронки',
                        textEn: 'Core drill'
                    },
                    parent: {
                        id: 1005271,
                        name: {
                            id: 1019262,
                            textUzLat: 'Elektr aksessuarlar',
                            textUzCyr: 'Электр аксессуарлар',
                            textRu: 'Расходные материалы для электроинструментов'
                        },
                        icon: {
                            id: 1005270,
                            name: 'tools_parts.svg',
                            url: '2023_12_08_18_41_10_499_67addc9d.svg',
                            size: 5050,
                            createdDate: ('2023-12-08T13:41:10.505Z')
                        },
                        isDisabled: false,
                        _id: ('671a19f147f81e8b144a44fc')
                    },
                    isDisabled: false,
                    _id: ('671a19f147f81e8b144a44fb')
                },
                answerText: 'bu qaysi harf?',
                answers: ['A', 'B', 'C', 'K'],
                correct: 'K',
                createdByChatId: '7113959453',
                isDeleted: false,
                createdAt: ('2024-10-24T09:59:49.418Z'),
                updatedAt: ('2024-10-24T09:59:49.420Z'),
                id: 24,
                __v: 0
            },
            {
                _id: ('671a1ac047f81e8b144a46c8'),
                chat_id: 7113959453,
                productId: '1006869',
                photo: [
                    {
                        file_id: 'AgACAgIAAxkBAAIpQmcaGqgfK9auufzVXaZBovG3DPfRAALa4DEbnQnZSGZ1oyuOngpmAQADAgADcwADNgQ',
                        file_unique_id: 'AQAD2uAxG50J2Uh4',
                        file_size: 1140,
                        width: 90,
                        height: 70
                    },
                    {
                        file_id: 'AgACAgIAAxkBAAIpQmcaGqgfK9auufzVXaZBovG3DPfRAALa4DEbnQnZSGZ1oyuOngpmAQADAgADbQADNgQ',
                        file_unique_id: 'AQAD2uAxG50J2Uhy',
                        file_size: 2852,
                        width: 173,
                        height: 134
                    }
                ],
                name: {
                    id: 1006869,
                    textUzLat: 'KORONKA ALMAZ NAYZA SVERLO FERRO',
                    textUzCyr: 'КОРОНКА АЛМАЗ НАЙЗА СВЕРЛО FERRO',
                    textRu: 'КОРОНКА АЛМАЗНАЯ С ЦЕНТРИРУЮЩИМ СВЕРЛОМ FERRO'
                },
                category: {
                    id: 1005301,
                    name: {
                        id: 1019225,
                        textUzLat: 'Koronkalar',
                        textUzCyr: 'Коронкалар',
                        textRu: 'Коронки',
                        textEn: 'Core drill'
                    },
                    parent: {
                        id: 1005271,
                        name: {
                            id: 1019262,
                            textUzLat: 'Elektr aksessuarlar',
                            textUzCyr: 'Электр аксессуарлар',
                            textRu: 'Расходные материалы для электроинструментов'
                        },
                        icon: {
                            id: 1005270,
                            name: 'tools_parts.svg',
                            url: '2023_12_08_18_41_10_499_67addc9d.svg',
                            size: 5050,
                            createdDate: ('2023-12-08T13:41:10.505Z')
                        },
                        isDisabled: false,
                        _id: ('671a19f147f81e8b144a4506')
                    },
                    isDisabled: false,
                    _id: ('671a19f147f81e8b144a4505')
                },
                answerText: 'bu qaysi harf?',
                answers: ['A', 'B', 'V', 'W'],
                correct: 'W',
                createdByChatId: '7113959453',
                isDeleted: false,
                createdAt: ('2024-10-24T10:00:32.083Z'),
                updatedAt: ('2024-10-24T10:00:32.085Z'),
                id: 25,
                __v: 0
            },
            {
                _id: ('671a1b3147f81e8b144a472d'),
                chat_id: 7113959453,
                productId: '1006777',
                photo: [
                    {
                        file_id: 'AgACAgIAAxkBAAIpXmcaGuMttuV0yePiI1rBaa_0swWjAALb4DEbnQnZSAuBqayfFtD-AQADAgADcwADNgQ',
                        file_unique_id: 'AQAD2-AxG50J2Uh4',
                        file_size: 2015,
                        width: 74,
                        height: 90
                    },
                    {
                        file_id: 'AgACAgIAAxkBAAIpXmcaGuMttuV0yePiI1rBaa_0swWjAALb4DEbnQnZSAuBqayfFtD-AQADAgADbQADNgQ',
                        file_unique_id: 'AQAD2-AxG50J2Uhy',
                        file_size: 18344,
                        width: 235,
                        height: 284
                    }
                ],
                name: {
                    id: 1006777,
                    textUzLat: 'KORONKA ALMAZ GRANIT UCHUN FERRO',
                    textUzCyr: 'КОРОНКА АЛМАЗ ГРАНИТ УЧУН FERRO',
                    textRu: 'КОРОНКА АЛМАЗНАЯ ПО ГРАНИТУ FERRO'
                },
                category: {
                    id: 1005301,
                    name: {
                        id: 1019225,
                        textUzLat: 'Koronkalar',
                        textUzCyr: 'Коронкалар',
                        textRu: 'Коронки',
                        textEn: 'Core drill'
                    },
                    parent: {
                        id: 1005271,
                        name: {
                            id: 1019262,
                            textUzLat: 'Elektr aksessuarlar',
                            textUzCyr: 'Электр аксессуарлар',
                            textRu: 'Расходные материалы для электроинструментов'
                        },
                        icon: {
                            id: 1005270,
                            name: 'tools_parts.svg',
                            url: '2023_12_08_18_41_10_499_67addc9d.svg',
                            size: 5050,
                            createdDate: ('2023-12-08T13:41:10.505Z')
                        },
                        isDisabled: false,
                        _id: ('671a19f147f81e8b144a4511')
                    },
                    isDisabled: false,
                    _id: ('671a19f147f81e8b144a4510')
                },
                answerText: 'bu nima',
                answers: ['Suv', 'Choy', 'blmadim', 'kofe'],
                correct: 'kofe',
                createdByChatId: '7113959453',
                isDeleted: false,
                createdAt: ('2024-10-24T10:02:25.785Z'),
                updatedAt: ('2024-10-24T10:02:25.787Z'),
                id: 26,
                __v: 0
            },
            {
                _id: ('671a1b9647f81e8b144a478c'),
                chat_id: 7113959453,
                productId: '1006777',
                photo: [
                    {
                        file_id: 'AgACAgIAAxkBAAIpcmcaG1GhsJalBLAtApzpKyFAa2q1AALe4DEbnQnZSFMsOix8yQKOAQADAgADcwADNgQ',
                        file_unique_id: 'AQAD3uAxG50J2Uh4',
                        file_size: 1711,
                        width: 90,
                        height: 53
                    },
                    {
                        file_id: 'AgACAgIAAxkBAAIpcmcaG1GhsJalBLAtApzpKyFAa2q1AALe4DEbnQnZSFMsOix8yQKOAQADAgADbQADNgQ',
                        file_unique_id: 'AQAD3uAxG50J2Uhy',
                        file_size: 19429,
                        width: 320,
                        height: 187
                    },
                    {
                        file_id: 'AgACAgIAAxkBAAIpcmcaG1GhsJalBLAtApzpKyFAa2q1AALe4DEbnQnZSFMsOix8yQKOAQADAgADeAADNgQ',
                        file_unique_id: 'AQAD3uAxG50J2Uh9',
                        file_size: 23882,
                        width: 387,
                        height: 226
                    }
                ],
                name: {
                    id: 1006777,
                    textUzLat: 'KORONKA ALMAZ GRANIT UCHUN FERRO',
                    textUzCyr: 'КОРОНКА АЛМАЗ ГРАНИТ УЧУН FERRO',
                    textRu: 'КОРОНКА АЛМАЗНАЯ ПО ГРАНИТУ FERRO'
                },
                category: {
                    id: 1005301,
                    name: {
                        id: 1019225,
                        textUzLat: 'Koronkalar',
                        textUzCyr: 'Коронкалар',
                        textRu: 'Коронки',
                        textEn: 'Core drill'
                    },
                    parent: {
                        id: 1005271,
                        name: {
                            id: 1019262,
                            textUzLat: 'Elektr aksessuarlar',
                            textUzCyr: 'Электр аксессуарлар',
                            textRu: 'Расходные материалы для электроинструментов'
                        },
                        icon: {
                            id: 1005270,
                            name: 'tools_parts.svg',
                            url: '2023_12_08_18_41_10_499_67addc9d.svg',
                            size: 5050,
                            createdDate: ('2023-12-08T13:41:10.505Z')
                        },
                        isDisabled: false,
                        _id: ('671a19f147f81e8b144a4511')
                    },
                    isDisabled: false,
                    _id: ('671a19f147f81e8b144a4510')
                },
                answerText: 'Bu nima?',
                answers: ['energetik', 'Lavina', 'Rasm', 'Reklama'],
                correct: 'Reklama',
                createdByChatId: '7113959453',
                isDeleted: false,
                createdAt: ('2024-10-24T10:04:06.071Z'),
                updatedAt: ('2024-10-24T10:04:06.075Z'),
                id: 27,
                __v: 0
            },
            {
                _id: ('671a1be747f81e8b144a4843'),
                chat_id: 7113959453,
                productId: '1006043',
                photo: [
                    {
                        file_id: 'AgACAgIAAxkBAAIpiGcaG7kdydvwAxmdvz7BMFSYGHYUAALh4DEbnQnZSIo-DK_OWLT7AQADAgADbQADNgQ',
                        file_unique_id: 'AQAD4eAxG50J2Uhy',
                        file_size: 1170,
                        width: 80,
                        height: 62
                    }
                ],
                name: {
                    id: 1006043,
                    textUzLat: 'DISK (LEPESTKOVIY) TOZALASH UCHUN TISCO',
                    textUzCyr: 'ДИСК (ЛЕПЕСТКОВЫЙ) ТОЗАЛАШ УЧУН TISCO',
                    textRu: 'КРУГ ЛЕПЕСТКОВЫЙ ШЛИФОВАЛЬНЫЙ ТОРЦЕВОЙ TISCO'
                },
                category: {
                    id: 1005299,
                    name: {
                        id: 1019226,
                        textUzLat: 'Disklar',
                        textUzCyr: 'Дисклар',
                        textRu: 'Диски',
                        textEn: 'Disks'
                    },
                    parent: {
                        id: 1005271,
                        name: {
                            id: 1019262,
                            textUzLat: 'Elektr aksessuarlar',
                            textUzCyr: 'Электр аксессуарлар',
                            textRu: 'Расходные материалы для электроинструментов'
                        },
                        icon: {
                            id: 1005270,
                            name: 'tools_parts.svg',
                            url: '2023_12_08_18_41_10_499_67addc9d.svg',
                            size: 5050,
                            createdDate: ('2023-12-08T13:41:10.505Z')
                        },
                        isDisabled: false,
                        _id: ('671a19da47f81e8b144a43f2')
                    },
                    isDisabled: false,
                    _id: ('671a19da47f81e8b144a43f1')
                },
                answerText: 'Bu nima?',
                answers: ['Instagram', 'Telegram', 'Kvadrat va nuqta', 'kamera'],
                correct: 'kamera',
                createdByChatId: '7113959453',
                isDeleted: false,
                createdAt: ('2024-10-24T10:05:27.079Z'),
                updatedAt: ('2024-10-24T10:05:27.083Z'),
                id: 28,
                __v: 0
            },
            {
                _id: ('671a1c5847f81e8b144a48a0'),
                chat_id: 7113959453,
                productId: '1006043',
                photo: [
                    {
                        file_id: 'AgACAgIAAxkBAAIpnmcaHCkAAaecrtrSTc5tzBwDxOWDEAAC5OAxG50J2Ui5mTwJ5D771wEAAwIAA3MAAzYE',
                        file_unique_id: 'AQAD5OAxG50J2Uh4',
                        file_size: 1263,
                        width: 90,
                        height: 60
                    },
                    {
                        file_id: 'AgACAgIAAxkBAAIpnmcaHCkAAaecrtrSTc5tzBwDxOWDEAAC5OAxG50J2Ui5mTwJ5D771wEAAwIAA20AAzYE',
                        file_unique_id: 'AQAD5OAxG50J2Uhy',
                        file_size: 18181,
                        width: 320,
                        height: 212
                    },
                    {
                        file_id: 'AgACAgIAAxkBAAIpnmcaHCkAAaecrtrSTc5tzBwDxOWDEAAC5OAxG50J2Ui5mTwJ5D771wEAAwIAA3gAAzYE',
                        file_unique_id: 'AQAD5OAxG50J2Uh9',
                        file_size: 18877,
                        width: 344,
                        height: 228
                    }
                ],
                name: {
                    id: 1006043,
                    textUzLat: 'DISK (LEPESTKOVIY) TOZALASH UCHUN TISCO',
                    textUzCyr: 'ДИСК (ЛЕПЕСТКОВЫЙ) ТОЗАЛАШ УЧУН TISCO',
                    textRu: 'КРУГ ЛЕПЕСТКОВЫЙ ШЛИФОВАЛЬНЫЙ ТОРЦЕВОЙ TISCO'
                },
                category: {
                    id: 1005299,
                    name: {
                        id: 1019226,
                        textUzLat: 'Disklar',
                        textUzCyr: 'Дисклар',
                        textRu: 'Диски',
                        textEn: 'Disks'
                    },
                    parent: {
                        id: 1005271,
                        name: {
                            id: 1019262,
                            textUzLat: 'Elektr aksessuarlar',
                            textUzCyr: 'Электр аксессуарлар',
                            textRu: 'Расходные материалы для электроинструментов'
                        },
                        icon: {
                            id: 1005270,
                            name: 'tools_parts.svg',
                            url: '2023_12_08_18_41_10_499_67addc9d.svg',
                            size: 5050,
                            createdDate: ('2023-12-08T13:41:10.505Z')
                        },
                        isDisabled: false,
                        _id: ('671a19da47f81e8b144a43f2')
                    },
                    isDisabled: false,
                    _id: ('671a19da47f81e8b144a43f1')
                },
                answerText: 'Bu nima?',
                answers: [
                    'oq chiziqli qora zebra',
                    'qora chiziqli oq zebra',
                    'Martis',
                    'Zebra'
                ],
                correct: 'Zebra',
                createdByChatId: '7113959453',
                isDeleted: false,
                createdAt: ('2024-10-24T10:07:20.628Z'),
                updatedAt: ('2024-10-24T10:07:20.632Z'),
                id: 29,
                __v: 0
            },
            {
                _id: ('671a1c8347f81e8b144a4907'),
                chat_id: 7113959453,
                productId: '1006075',
                photo: [],
                name: {
                    id: 1006075,
                    textUzLat: 'SHYOTKA KOSA QORA',
                    textUzCyr: 'ЩЕТКА КОСА ҚОРА',
                    textRu: 'ЩЕТКА ЧАШЕЧНАЯ ЖГУТОВАЯ'
                },
                category: {
                    id: 1005299,
                    name: {
                        id: 1019226,
                        textUzLat: 'Disklar',
                        textUzCyr: 'Дисклар',
                        textRu: 'Диски',
                        textEn: 'Disks'
                    },
                    parent: {
                        id: 1005271,
                        name: {
                            id: 1019262,
                            textUzLat: 'Elektr aksessuarlar',
                            textUzCyr: 'Электр аксессуарлар',
                            textRu: 'Расходные материалы для электроинструментов'
                        },
                        icon: {
                            id: 1005270,
                            name: 'tools_parts.svg',
                            url: '2023_12_08_18_41_10_499_67addc9d.svg',
                            size: 5050,
                            createdDate: ('2023-12-08T13:41:10.505Z')
                        },
                        isDisabled: false,
                        _id: ('671a19da47f81e8b144a43f7')
                    },
                    isDisabled: false,
                    _id: ('671a19da47f81e8b144a43f6')
                },
                answerText: 'Hozir soat nechchi?',
                answers: ['1', '2', '3', '16:00'],
                correct: '16:00',
                createdByChatId: '7113959453',
                isDeleted: false,
                createdAt: ('2024-10-24T10:08:03.631Z'),
                updatedAt: ('2024-10-24T10:08:03.633Z'),
                id: 30,
                __v: 0
            },
            {
                _id: ('671a1ca747f81e8b144a4968'),
                chat_id: 7113959453,
                productId: '1006075',
                photo: [],
                name: {
                    id: 1006075,
                    textUzLat: 'SHYOTKA KOSA QORA',
                    textUzCyr: 'ЩЕТКА КОСА ҚОРА',
                    textRu: 'ЩЕТКА ЧАШЕЧНАЯ ЖГУТОВАЯ'
                },
                category: {
                    id: 1005299,
                    name: {
                        id: 1019226,
                        textUzLat: 'Disklar',
                        textUzCyr: 'Дисклар',
                        textRu: 'Диски',
                        textEn: 'Disks'
                    },
                    parent: {
                        id: 1005271,
                        name: {
                            id: 1019262,
                            textUzLat: 'Elektr aksessuarlar',
                            textUzCyr: 'Электр аксессуарлар',
                            textRu: 'Расходные материалы для электроинструментов'
                        },
                        icon: {
                            id: 1005270,
                            name: 'tools_parts.svg',
                            url: '2023_12_08_18_41_10_499_67addc9d.svg',
                            size: 5050,
                            createdDate: ('2023-12-08T13:41:10.505Z')
                        },
                        isDisabled: false,
                        _id: ('671a19da47f81e8b144a43f7')
                    },
                    isDisabled: false,
                    _id: ('671a19da47f81e8b144a43f6')
                },
                answerText: '✏️ Savolingizni kiriting',
                answers: [
                    '📝 1-ch xato javobni yozing',
                    '📝2-ch xato javobni yozing',
                    '📝3-ch xato javobni yozing',
                    "✅4-ch to'gri javobni yozing"
                ],
                correct: "✅4-ch to'gri javobni yozing",
                createdByChatId: '7113959453',
                isDeleted: false,
                createdAt: ('2024-10-24T10:08:39.335Z'),
                updatedAt: ('2024-10-24T10:08:39.339Z'),
                id: 31,
                __v: 0
            },
            {
                _id: ('671a1cdb47f81e8b144a4a73'),
                chat_id: 7113959453,
                productId: '1041325',
                photo: [
                    {
                        file_id: 'AgACAgIAAxkBAAIp4GcaHMQSfrpA1nbfF_JNtWcNnnJUAALl4DEbnQnZSIURPCQOv1Y8AQADAgADbQADNgQ',
                        file_unique_id: 'AQAD5eAxG50J2Uhy',
                        file_size: 813,
                        width: 40,
                        height: 30
                    }
                ],
                name: {
                    id: 1041325,
                    textUzLat: 'PYORKA FERRO 128',
                    textUzCyr: 'ПЁРКА FERRO 128',
                    textRu: 'СВЕРЛО ФОРСТНЕРА (ПО ДЕРЕВУ) 128'
                },
                category: {
                    id: 1005300,
                    name: {
                        id: 1019227,
                        textUzLat: 'Sverlolar',
                        textUzCyr: 'Сверлолар',
                        textRu: 'Свёрла',
                        textEn: 'Drills'
                    },
                    parent: {
                        id: 1005271,
                        name: {
                            id: 1019262,
                            textUzLat: 'Elektr aksessuarlar',
                            textUzCyr: 'Электр аксессуарлар',
                            textRu: 'Расходные материалы для электроинструментов'
                        },
                        icon: {
                            id: 1005270,
                            name: 'tools_parts.svg',
                            url: '2023_12_08_18_41_10_499_67addc9d.svg',
                            size: 5050,
                            createdDate: ('2023-12-08T13:41:10.505Z')
                        },
                        isDisabled: false,
                        _id: ('671a1cb547f81e8b144a4982')
                    },
                    isDisabled: false,
                    _id: ('671a1cb547f81e8b144a4981')
                },
                answerText: 'savol',
                answers: [
                    '📝 1-ch xato javobni yozing',
                    '📝 2-ch xato javobni yozing',
                    '📝 3-ch xato javobni yozing',
                    '📝 4-ch xato javobni yozing'
                ],
                correct: '📝 4-ch xato javobni yozing',
                createdByChatId: '7113959453',
                isDeleted: false,
                createdAt: ('2024-10-24T10:09:31.435Z'),
                updatedAt: ('2024-10-24T10:09:31.437Z'),
                id: 32,
                __v: 0
            },
            {
                _id: ('671a1d2347f81e8b144a4bec'),
                chat_id: 7113959453,
                productId: '1009845',
                photo: [],
                name: {
                    id: 1009845,
                    textUzLat: "KLYUCH TO'PLAM GOLOVKA 12pcs",
                    textUzCyr: 'КЛЮЧ ТЎПЛАМ ГОЛОВКА 12pcs',
                    textRu: 'Набор головок с трещоткой (12 предметов)'
                },
                category: {
                    id: 1009250,
                    name: {
                        id: 1019223,
                        textUzLat: 'USKUNALAR TO‘PLAMI',
                        textUzCyr: 'УСКУНАЛАР ТЎПЛАМИ',
                        textRu: 'Наборы инструментов',
                        textEn: 'Tool sets'
                    },
                    parent: {
                        id: 1005269,
                        name: {
                            id: 1019263,
                            textUzLat: 'Instrumentlar',
                            textUzCyr: 'Инструментлар',
                            textRu: 'Инструменты'
                        },
                        icon: {
                            id: 1005268,
                            name: 'tools.svg',
                            url: '2023_12_08_18_39_21_939_797bddba.svg',
                            size: 3915,
                            createdDate: ('2023-12-08T13:39:21.947Z')
                        },
                        isDisabled: false,
                        _id: ('671a1ce547f81e8b144a4ad1')
                    },
                    isDisabled: false,
                    _id: ('671a1ce547f81e8b144a4ad0')
                },
                answerText: 'Javob nima?',
                answers: ['savol', 'blmiman', "bilgandak bo'ldim", 'Javob'],
                correct: 'Javob',
                createdByChatId: '7113959453',
                isDeleted: false,
                createdAt: ('2024-10-24T10:10:43.323Z'),
                updatedAt: ('2024-10-24T10:10:43.326Z'),
                id: 33,
                __v: 0
            },
            {
                _id: ('671a1d3c47f81e8b144a4c4f'),
                chat_id: 7113959453,
                productId: '1009845',
                photo: [],
                name: {
                    id: 1009845,
                    textUzLat: "KLYUCH TO'PLAM GOLOVKA 12pcs",
                    textUzCyr: 'КЛЮЧ ТЎПЛАМ ГОЛОВКА 12pcs',
                    textRu: 'Набор головок с трещоткой (12 предметов)'
                },
                category: {
                    id: 1009250,
                    name: {
                        id: 1019223,
                        textUzLat: 'USKUNALAR TO‘PLAMI',
                        textUzCyr: 'УСКУНАЛАР ТЎПЛАМИ',
                        textRu: 'Наборы инструментов',
                        textEn: 'Tool sets'
                    },
                    parent: {
                        id: 1005269,
                        name: {
                            id: 1019263,
                            textUzLat: 'Instrumentlar',
                            textUzCyr: 'Инструментлар',
                            textRu: 'Инструменты'
                        },
                        icon: {
                            id: 1005268,
                            name: 'tools.svg',
                            url: '2023_12_08_18_39_21_939_797bddba.svg',
                            size: 3915,
                            createdDate: ('2023-12-08T13:39:21.947Z')
                        },
                        isDisabled: false,
                        _id: ('671a1ce547f81e8b144a4ad1')
                    },
                    isDisabled: false,
                    _id: ('671a1ce547f81e8b144a4ad0')
                },
                answerText: 'bosqich nima',
                answers: ['1', '2', '3', '4'],
                correct: '4',
                createdByChatId: '7113959453',
                isDeleted: false,
                createdAt: ('2024-10-24T10:11:08.625Z'),
                updatedAt: ('2024-10-24T10:11:08.627Z'),
                id: 34,
                __v: 0
            },
            {
                _id: ('671a1d8447f81e8b144a4cb2'),
                chat_id: 7113959453,
                productId: '1009843',
                photo: [],
                name: {
                    id: 1009843,
                    textUzLat: "OTVYORTKA TO'PLAM (BIT VA GALOVKI) 30PC",
                    textUzCyr: 'ОТВЁРТКА ТЎПЛАМ (БИТ ВА ГАЛОВКИ) 30ПC',
                    textRu: 'Набор отвертка с битами (30 предметов)'
                },
                category: {
                    id: 1009250,
                    name: {
                        id: 1019223,
                        textUzLat: 'USKUNALAR TO‘PLAMI',
                        textUzCyr: 'УСКУНАЛАР ТЎПЛАМИ',
                        textRu: 'Наборы инструментов',
                        textEn: 'Tool sets'
                    },
                    parent: {
                        id: 1005269,
                        name: {
                            id: 1019263,
                            textUzLat: 'Instrumentlar',
                            textUzCyr: 'Инструментлар',
                            textRu: 'Инструменты'
                        },
                        icon: {
                            id: 1005268,
                            name: 'tools.svg',
                            url: '2023_12_08_18_39_21_939_797bddba.svg',
                            size: 3915,
                            createdDate: ('2023-12-08T13:39:21.947Z')
                        },
                        isDisabled: false,
                        _id: ('671a1ce547f81e8b144a4ad6')
                    },
                    isDisabled: false,
                    _id: ('671a1ce547f81e8b144a4ad5')
                },
                answerText: "Otvyortka o'zbekcha nima?",
                answers: ['Otvyortka', 'atvyorka', 'buragich', 'artvor uka'],
                correct: 'artvor uka',
                createdByChatId: '7113959453',
                isDeleted: false,
                createdAt: ('2024-10-24T10:12:20.250Z'),
                updatedAt: ('2024-10-24T10:12:20.254Z'),
                id: 35,
                __v: 0
            },
            {
                _id: ('671a1da847f81e8b144a4d15'),
                chat_id: 7113959453,
                productId: '1009843',
                photo: [],
                name: {
                    id: 1009843,
                    textUzLat: "OTVYORTKA TO'PLAM (BIT VA GALOVKI) 30PC",
                    textUzCyr: 'ОТВЁРТКА ТЎПЛАМ (БИТ ВА ГАЛОВКИ) 30ПC',
                    textRu: 'Набор отвертка с битами (30 предметов)'
                },
                category: {
                    id: 1009250,
                    name: {
                        id: 1019223,
                        textUzLat: 'USKUNALAR TO‘PLAMI',
                        textUzCyr: 'УСКУНАЛАР ТЎПЛАМИ',
                        textRu: 'Наборы инструментов',
                        textEn: 'Tool sets'
                    },
                    parent: {
                        id: 1005269,
                        name: {
                            id: 1019263,
                            textUzLat: 'Instrumentlar',
                            textUzCyr: 'Инструментлар',
                            textRu: 'Инструменты'
                        },
                        icon: {
                            id: 1005268,
                            name: 'tools.svg',
                            url: '2023_12_08_18_39_21_939_797bddba.svg',
                            size: 3915,
                            createdDate: ('2023-12-08T13:39:21.947Z')
                        },
                        isDisabled: false,
                        _id: ('671a1ce547f81e8b144a4ad6')
                    },
                    isDisabled: false,
                    _id: ('671a1ce547f81e8b144a4ad5')
                },
                answerText: "To'plam nima",
                answers: ['hech nima', 'nimadur', 'qatdur kimdur', "bu To'plam"],
                correct: "bu To'plam",
                createdByChatId: '7113959453',
                isDeleted: false,
                createdAt: ('2024-10-24T10:12:56.454Z'),
                updatedAt: ('2024-10-24T10:12:56.458Z'),
                id: 36,
                __v: 0
            },
            {
                _id: ('671a1e1b47f81e8b144a4e0f'),
                chat_id: 7113959453,
                productId: '1009894',
                photo: [],
                name: {
                    id: 1009894,
                    textUzLat: 'JILET',
                    textUzCyr: 'ЖИЛЕТ',
                    textRu: 'Жилет сигнальный'
                },
                category: {
                    id: 1009255,
                    name: {
                        id: 1019224,
                        textUzLat: 'XAVFSIZLIK VOSITALARI',
                        textUzCyr: 'ХАВФСИЗЛИК ВОСИТАЛАРИ',
                        textRu: 'Средства Защиты',
                        textEn: 'Protection means'
                    },
                    parent: {
                        id: 1005269,
                        name: {
                            id: 1019263,
                            textUzLat: 'Instrumentlar',
                            textUzCyr: 'Инструментлар',
                            textRu: 'Инструменты'
                        },
                        icon: {
                            id: 1005268,
                            name: 'tools.svg',
                            url: '2023_12_08_18_39_21_939_797bddba.svg',
                            size: 3915,
                            createdDate: ('2023-12-08T13:39:21.947Z')
                        },
                        isDisabled: false,
                        _id: ('671a1dda47f81e8b144a4d31')
                    },
                    isDisabled: false,
                    _id: ('671a1dda47f81e8b144a4d30')
                },
                answerText: 'Jilet nima?',
                answers: ['kiyim', 'oyoq kiyim', 'bosh kiyim', 'Jilet blue 3'],
                correct: 'Jilet blue 3',
                createdByChatId: '7113959453',
                isDeleted: false,
                createdAt: ('2024-10-24T10:14:51.945Z'),
                updatedAt: ('2024-10-24T10:14:51.948Z'),
                id: 37,
                __v: 0
            },
            {
                _id: ('671a1e4f47f81e8b144a4e6e'),
                chat_id: 7113959453,
                productId: '1009889',
                photo: [],
                name: {
                    id: 1009889,
                    textUzLat: 'PAYVAND OCHKI',
                    textUzCyr: 'ПАЙВАНД ОЧКИ',
                    textRu: 'Очки сварочные'
                },
                category: {
                    id: 1009255,
                    name: {
                        id: 1019224,
                        textUzLat: 'XAVFSIZLIK VOSITALARI',
                        textUzCyr: 'ХАВФСИЗЛИК ВОСИТАЛАРИ',
                        textRu: 'Средства Защиты',
                        textEn: 'Protection means'
                    },
                    parent: {
                        id: 1005269,
                        name: {
                            id: 1019263,
                            textUzLat: 'Instrumentlar',
                            textUzCyr: 'Инструментлар',
                            textRu: 'Инструменты'
                        },
                        icon: {
                            id: 1005268,
                            name: 'tools.svg',
                            url: '2023_12_08_18_39_21_939_797bddba.svg',
                            size: 3915,
                            createdDate: ('2023-12-08T13:39:21.947Z')
                        },
                        isDisabled: false,
                        _id: ('671a1dda47f81e8b144a4d39')
                    },
                    isDisabled: false,
                    _id: ('671a1dda47f81e8b144a4d38')
                },
                answerText: 'Payvand ochki nima?',
                answers: ['svarochniy ochki', 'ochki', 'svarochniy', "payvand ko'zoynak"],
                correct: "payvand ko'zoynak",
                createdByChatId: '7113959453',
                isDeleted: false,
                createdAt: ('2024-10-24T10:15:43.010Z'),
                updatedAt: ('2024-10-24T10:15:43.012Z'),
                id: 38,
                __v: 0
            },
            {
                _id: ('671a1ef747f81e8b144a50cf'),
                chat_id: 7113959453,
                productId: '1009894',
                photo: [],
                name: {
                    id: 1009894,
                    textUzLat: 'JILET',
                    textUzCyr: 'ЖИЛЕТ',
                    textRu: 'Жилет сигнальный'
                },
                category: {
                    id: 1009255,
                    name: {
                        id: 1019224,
                        textUzLat: 'XAVFSIZLIK VOSITALARI',
                        textUzCyr: 'ХАВФСИЗЛИК ВОСИТАЛАРИ',
                        textRu: 'Средства Защиты',
                        textEn: 'Protection means'
                    },
                    parent: {
                        id: 1005269,
                        name: {
                            id: 1019263,
                            textUzLat: 'Instrumentlar',
                            textUzCyr: 'Инструментлар',
                            textRu: 'Инструменты'
                        },
                        icon: {
                            id: 1005268,
                            name: 'tools.svg',
                            url: '2023_12_08_18_39_21_939_797bddba.svg',
                            size: 3915,
                            createdDate: ('2023-12-08T13:39:21.947Z')
                        },
                        isDisabled: false,
                        _id: ('671a1dda47f81e8b144a4d31')
                    },
                    isDisabled: false,
                    _id: ('671a1dda47f81e8b144a4d30')
                },
                answerText: "Oq qora bo'lib qora oq bo'lsachi?",
                answers: [
                    "bo'lsa bo'lar",
                    "bo'masa bo'mer",
                    "bo'sa bilamiz",
                    "bo'masa bilmimiz",
                    'Yarashuvradi'
                ],
                correct: 'Yarashuvradi',
                createdByChatId: '7113959453',
                isDeleted: false,
                createdAt: ('2024-10-24T10:18:31.123Z'),
                updatedAt: ('2024-10-24T10:18:31.125Z'),
                id: 39,
                __v: 0
            },
            {
                _id: ('671a1f1a47f81e8b144a51e5'),
                chat_id: 7113959453,
                productId: '1009889',
                photo: [],
                name: {
                    id: 1009889,
                    textUzLat: 'PAYVAND OCHKI',
                    textUzCyr: 'ПАЙВАНД ОЧКИ',
                    textRu: 'Очки сварочные'
                },
                category: {
                    id: 1009255,
                    name: {
                        id: 1019224,
                        textUzLat: 'XAVFSIZLIK VOSITALARI',
                        textUzCyr: 'ХАВФСИЗЛИК ВОСИТАЛАРИ',
                        textRu: 'Средства Защиты',
                        textEn: 'Protection means'
                    },
                    parent: {
                        id: 1005269,
                        name: {
                            id: 1019263,
                            textUzLat: 'Instrumentlar',
                            textUzCyr: 'Инструментлар',
                            textRu: 'Инструменты'
                        },
                        icon: {
                            id: 1005268,
                            name: 'tools.svg',
                            url: '2023_12_08_18_39_21_939_797bddba.svg',
                            size: 3915,
                            createdDate: ('2023-12-08T13:39:21.947Z')
                        },
                        isDisabled: false,
                        _id: ('671a1dda47f81e8b144a4d39')
                    },
                    isDisabled: false,
                    _id: ('671a1dda47f81e8b144a4d38')
                },
                answerText: 'savol',
                answers: ['1', '2', '3', '4'],
                correct: '4',
                createdByChatId: '7113959453',
                isDeleted: false,
                createdAt: ('2024-10-24T10:19:06.864Z'),
                updatedAt: ('2024-10-24T10:19:06.867Z'),
                id: 40,
                __v: 0
            },
            {
                _id: ('671a1f4147f81e8b144a5322'),
                chat_id: 7113959453,
                productId: '1003022',
                photo: [],
                name: {
                    id: 1003022,
                    textUzLat: 'SAMOREZ ILGAKLI',
                    textUzCyr: 'САМОРЕЗ ИЛГАКЛИ',
                    textRu: 'САМОРЕЗ С КРЮКОМ'
                },
                category: {
                    id: 1002442,
                    name: {
                        id: 1019252,
                        textUzLat: 'Montaj',
                        textUzCyr: 'Монтаж',
                        textRu: 'Монтаж'
                    },
                    parent: {
                        id: 1000058,
                        name: {
                            id: 1019245,
                            textUzLat: 'Mahkamlovchi',
                            textUzCyr: 'Маҳкамловчи',
                            textRu: 'Крепеж'
                        },
                        icon: {
                            id: 1005267,
                            name: 'cat_krepyoj.svg',
                            url: '2023_12_08_17_45_45_631_9778b779.svg',
                            size: 4307,
                            createdDate: ('2023-12-08T12:45:45.643Z')
                        },
                        isDisabled: false,
                        _id: ('671a1f2647f81e8b144a5288')
                    },
                    isDisabled: false,
                    _id: ('671a1f2647f81e8b144a5287')
                },
                answerText: 'savol',
                answers: ['1', '2', '3', '4'],
                correct: '4',
                createdByChatId: '7113959453',
                isDeleted: false,
                createdAt: ('2024-10-24T10:19:45.591Z'),
                updatedAt: ('2024-10-24T10:19:45.594Z'),
                id: 41,
                __v: 0
            },
            {
                _id: ('671a1f5447f81e8b144a5383'),
                chat_id: 7113959453,
                productId: '1003022',
                photo: [],
                name: {
                    id: 1003022,
                    textUzLat: 'SAMOREZ ILGAKLI',
                    textUzCyr: 'САМОРЕЗ ИЛГАКЛИ',
                    textRu: 'САМОРЕЗ С КРЮКОМ'
                },
                category: {
                    id: 1002442,
                    name: {
                        id: 1019252,
                        textUzLat: 'Montaj',
                        textUzCyr: 'Монтаж',
                        textRu: 'Монтаж'
                    },
                    parent: {
                        id: 1000058,
                        name: {
                            id: 1019245,
                            textUzLat: 'Mahkamlovchi',
                            textUzCyr: 'Маҳкамловчи',
                            textRu: 'Крепеж'
                        },
                        icon: {
                            id: 1005267,
                            name: 'cat_krepyoj.svg',
                            url: '2023_12_08_17_45_45_631_9778b779.svg',
                            size: 4307,
                            createdDate: ('2023-12-08T12:45:45.643Z')
                        },
                        isDisabled: false,
                        _id: ('671a1f2647f81e8b144a5288')
                    },
                    isDisabled: false,
                    _id: ('671a1f2647f81e8b144a5287')
                },
                answerText: 'test',
                answers: ['1', '2', '3', '4'],
                correct: '4',
                createdByChatId: '7113959453',
                isDeleted: false,
                createdAt: ('2024-10-24T10:20:04.638Z'),
                updatedAt: ('2024-10-24T10:20:04.640Z'),
                id: 42,
                __v: 0
            },
            {
                _id: ('671a1f8647f81e8b144a545c'),
                chat_id: 7113959453,
                productId: '1014224',
                photo: [],
                name: {
                    id: 1014224,
                    textUzLat: 'SHPILKA DIN975 UZB 14x1000',
                    textUzCyr: 'ШПИЛКА DIN975 УЗБ 14х1000',
                    textRu: 'ШПИЛЬКА РЕЗЬБОВАЯ DIN975 УЗБ 14x1000'
                },
                category: {
                    id: 1002442,
                    name: {
                        id: 1019252,
                        textUzLat: 'Montaj',
                        textUzCyr: 'Монтаж',
                        textRu: 'Монтаж'
                    },
                    parent: {
                        id: 1000058,
                        name: {
                            id: 1019245,
                            textUzLat: 'Mahkamlovchi',
                            textUzCyr: 'Маҳкамловчи',
                            textRu: 'Крепеж'
                        },
                        icon: {
                            id: 1005267,
                            name: 'cat_krepyoj.svg',
                            url: '2023_12_08_17_45_45_631_9778b779.svg',
                            size: 4307,
                            createdDate: ('2023-12-08T12:45:45.643Z')
                        },
                        isDisabled: false,
                        _id: ('671a1f2647f81e8b144a5284')
                    },
                    isDisabled: false,
                    _id: ('671a1f2647f81e8b144a5283')
                },
                answerText: 'javob',
                answers: ['1', '2', '3', '4'],
                correct: '4',
                createdByChatId: '7113959453',
                isDeleted: false,
                createdAt: ('2024-10-24T10:20:54.846Z'),
                updatedAt: ('2024-10-24T10:20:54.848Z'),
                id: 43,
                __v: 0
            },
            {
                _id: ('671a1fb947f81e8b144a54b7'),
                chat_id: 7113959453,
                productId: '1014224',
                photo: [],
                name: {
                    id: 1014224,
                    textUzLat: 'SHPILKA DIN975 UZB 14x1000',
                    textUzCyr: 'ШПИЛКА DIN975 УЗБ 14х1000',
                    textRu: 'ШПИЛЬКА РЕЗЬБОВАЯ DIN975 УЗБ 14x1000'
                },
                category: {
                    id: 1002442,
                    name: {
                        id: 1019252,
                        textUzLat: 'Montaj',
                        textUzCyr: 'Монтаж',
                        textRu: 'Монтаж'
                    },
                    parent: {
                        id: 1000058,
                        name: {
                            id: 1019245,
                            textUzLat: 'Mahkamlovchi',
                            textUzCyr: 'Маҳкамловчи',
                            textRu: 'Крепеж'
                        },
                        icon: {
                            id: 1005267,
                            name: 'cat_krepyoj.svg',
                            url: '2023_12_08_17_45_45_631_9778b779.svg',
                            size: 4307,
                            createdDate: ('2023-12-08T12:45:45.643Z')
                        },
                        isDisabled: false,
                        _id: ('671a1f2647f81e8b144a5284')
                    },
                    isDisabled: false,
                    _id: ('671a1f2647f81e8b144a5283')
                },
                answerText: 'Rasm',
                answers: ['3', '4'],
                correct: '4',
                createdByChatId: '7113959453',
                isDeleted: false,
                createdAt: ('2024-10-24T10:21:45.091Z'),
                updatedAt: ('2024-10-24T10:21:45.093Z'),
                id: 44,
                __v: 0
            },
            {
                _id: ('671a205447f81e8b144a57da'),
                chat_id: 7113959453,
                productId: '1009099',
                photo: [],
                name: {
                    id: 1009099,
                    textUzLat: 'ARQON YUK UCHUN FERRO',
                    textUzCyr: 'АРҚОН ЮК УЧУН FERRO',
                    textRu: 'СТРОПА ПЕТЛЕВАЯ ТЕКСТИЛЬНАЯ (ЧАЛКА) FERRO'
                },
                category: {
                    id: 1003947,
                    name: {
                        id: 1019222,
                        textUzLat: 'Tros va tros aksessuarlari',
                        textUzCyr: 'Трос ва трос аксессуарлари',
                        textRu: 'Тросы и зажимы',
                        textEn: 'Ropes and clamps'
                    },
                    parent: {
                        id: 1000058,
                        name: {
                            id: 1019245,
                            textUzLat: 'Mahkamlovchi',
                            textUzCyr: 'Маҳкамловчи',
                            textRu: 'Крепеж'
                        },
                        icon: {
                            id: 1005267,
                            name: 'cat_krepyoj.svg',
                            url: '2023_12_08_17_45_45_631_9778b779.svg',
                            size: 4307,
                            createdDate: ('2023-12-08T12:45:45.643Z')
                        },
                        isDisabled: false,
                        _id: ('671a1fc747f81e8b144a5585')
                    },
                    isDisabled: false,
                    _id: ('671a1fc747f81e8b144a5584')
                },
                answerText: 'arqon',
                answers: ['1', '2', '3', '4'],
                correct: '4',
                createdByChatId: '7113959453',
                isDeleted: false,
                createdAt: ('2024-10-24T10:24:20.256Z'),
                updatedAt: ('2024-10-24T10:24:20.258Z'),
                id: 45,
                __v: 0
            },
            {
                _id: ('671a206947f81e8b144a5841'),
                chat_id: 7113959453,
                productId: '1009099',
                photo: [],
                name: {
                    id: 1009099,
                    textUzLat: 'ARQON YUK UCHUN FERRO',
                    textUzCyr: 'АРҚОН ЮК УЧУН FERRO',
                    textRu: 'СТРОПА ПЕТЛЕВАЯ ТЕКСТИЛЬНАЯ (ЧАЛКА) FERRO'
                },
                category: {
                    id: 1003947,
                    name: {
                        id: 1019222,
                        textUzLat: 'Tros va tros aksessuarlari',
                        textUzCyr: 'Трос ва трос аксессуарлари',
                        textRu: 'Тросы и зажимы',
                        textEn: 'Ropes and clamps'
                    },
                    parent: {
                        id: 1000058,
                        name: {
                            id: 1019245,
                            textUzLat: 'Mahkamlovchi',
                            textUzCyr: 'Маҳкамловчи',
                            textRu: 'Крепеж'
                        },
                        icon: {
                            id: 1005267,
                            name: 'cat_krepyoj.svg',
                            url: '2023_12_08_17_45_45_631_9778b779.svg',
                            size: 4307,
                            createdDate: ('2023-12-08T12:45:45.643Z')
                        },
                        isDisabled: false,
                        _id: ('671a1fc747f81e8b144a5585')
                    },
                    isDisabled: false,
                    _id: ('671a1fc747f81e8b144a5584')
                },
                answerText: 'yuk',
                answers: ['1', '2', '3', '4'],
                correct: '4',
                createdByChatId: '7113959453',
                isDeleted: false,
                createdAt: ('2024-10-24T10:24:41.319Z'),
                updatedAt: ('2024-10-24T10:24:41.321Z'),
                id: 46,
                __v: 0
            },
            {
                _id: ('671a209847f81e8b144a58a2'),
                chat_id: 7113959453,
                productId: '1009059',
                photo: [],
                name: {
                    id: 1009059,
                    textUzLat: 'ZANJIR',
                    textUzCyr: 'ЗАНЖИР',
                    textRu: 'ЦЕПЬ'
                },
                category: {
                    id: 1003947,
                    name: {
                        id: 1019222,
                        textUzLat: 'Tros va tros aksessuarlari',
                        textUzCyr: 'Трос ва трос аксессуарлари',
                        textRu: 'Тросы и зажимы',
                        textEn: 'Ropes and clamps'
                    },
                    parent: {
                        id: 1000058,
                        name: {
                            id: 1019245,
                            textUzLat: 'Mahkamlovchi',
                            textUzCyr: 'Маҳкамловчи',
                            textRu: 'Крепеж'
                        },
                        icon: {
                            id: 1005267,
                            name: 'cat_krepyoj.svg',
                            url: '2023_12_08_17_45_45_631_9778b779.svg',
                            size: 4307,
                            createdDate: ('2023-12-08T12:45:45.643Z')
                        },
                        isDisabled: false,
                        _id: ('671a1fc747f81e8b144a558b')
                    },
                    isDisabled: false,
                    _id: ('671a1fc747f81e8b144a558a')
                },
                answerText: 'test',
                answers: ['1', '2', '3', '45'],
                correct: '45',
                createdByChatId: '7113959453',
                isDeleted: false,
                createdAt: ('2024-10-24T10:25:28.959Z'),
                updatedAt: ('2024-10-24T10:25:28.961Z'),
                id: 47,
                __v: 0
            },
            {
                _id: ('671a20a947f81e8b144a5903'),
                chat_id: 7113959453,
                productId: '1009059',
                photo: [],
                name: {
                    id: 1009059,
                    textUzLat: 'ZANJIR',
                    textUzCyr: 'ЗАНЖИР',
                    textRu: 'ЦЕПЬ'
                },
                category: {
                    id: 1003947,
                    name: {
                        id: 1019222,
                        textUzLat: 'Tros va tros aksessuarlari',
                        textUzCyr: 'Трос ва трос аксессуарлари',
                        textRu: 'Тросы и зажимы',
                        textEn: 'Ropes and clamps'
                    },
                    parent: {
                        id: 1000058,
                        name: {
                            id: 1019245,
                            textUzLat: 'Mahkamlovchi',
                            textUzCyr: 'Маҳкамловчи',
                            textRu: 'Крепеж'
                        },
                        icon: {
                            id: 1005267,
                            name: 'cat_krepyoj.svg',
                            url: '2023_12_08_17_45_45_631_9778b779.svg',
                            size: 4307,
                            createdDate: ('2023-12-08T12:45:45.643Z')
                        },
                        isDisabled: false,
                        _id: ('671a1fc747f81e8b144a558b')
                    },
                    isDisabled: false,
                    _id: ('671a1fc747f81e8b144a558a')
                },
                answerText: 'test',
                answers: ['1', '2', '3', '54'],
                correct: '54',
                createdByChatId: '7113959453',
                isDeleted: false,
                createdAt: ('2024-10-24T10:25:45.003Z'),
                updatedAt: ('2024-10-24T10:25:45.005Z'),
                id: 48,
                __v: 0
            },
            {
                _id: ('671a22e847f81e8b144a5bb9'),
                chat_id: 7113959453,
                productId: '1000929',
                photo: [],
                name: {
                    id: 1000929,
                    textUzLat: 'KIMYOVIY ANKER KLEY',
                    textUzCyr: 'КИМЁВИЙ АНКЕР КЛЕЙ',
                    textRu: 'Химический анкерный клей'
                },
                category: {
                    id: 1000830,
                    name: {
                        id: 1019247,
                        textUzLat: 'Kimyoviy mahkamlovchilar',
                        textUzCyr: 'Кимёвий маҳкамловчилар',
                        textRu: 'Химические крепежные изделия'
                    },
                    parent: {
                        id: 1000058,
                        name: {
                            id: 1019245,
                            textUzLat: 'Mahkamlovchi',
                            textUzCyr: 'Маҳкамловчи',
                            textRu: 'Крепеж'
                        },
                        icon: {
                            id: 1005267,
                            name: 'cat_krepyoj.svg',
                            url: '2023_12_08_17_45_45_631_9778b779.svg',
                            size: 4307,
                            createdDate: ('2023-12-08T12:45:45.643Z')
                        },
                        isDisabled: false,
                        _id: ('671a203747f81e8b144a5715')
                    },
                    isDisabled: false,
                    _id: ('671a203747f81e8b144a5714')
                },
                answerText: 'test',
                answers: ['1', '2', '3', '4'],
                correct: '4',
                createdByChatId: '7113959453',
                isDeleted: false,
                createdAt: ('2024-10-24T10:35:20.285Z'),
                updatedAt: ('2024-10-24T10:35:20.288Z'),
                id: 49,
                __v: 0
            },
            {
                _id: ('671a22f547f81e8b144a5c0b'),
                chat_id: 7113959453,
                productId: '1000929',
                photo: [],
                name: {
                    id: 1000929,
                    textUzLat: 'KIMYOVIY ANKER KLEY',
                    textUzCyr: 'КИМЁВИЙ АНКЕР КЛЕЙ',
                    textRu: 'Химический анкерный клей'
                },
                category: {
                    id: 1000830,
                    name: {
                        id: 1019247,
                        textUzLat: 'Kimyoviy mahkamlovchilar',
                        textUzCyr: 'Кимёвий маҳкамловчилар',
                        textRu: 'Химические крепежные изделия'
                    },
                    parent: {
                        id: 1000058,
                        name: {
                            id: 1019245,
                            textUzLat: 'Mahkamlovchi',
                            textUzCyr: 'Маҳкамловчи',
                            textRu: 'Крепеж'
                        },
                        icon: {
                            id: 1005267,
                            name: 'cat_krepyoj.svg',
                            url: '2023_12_08_17_45_45_631_9778b779.svg',
                            size: 4307,
                            createdDate: ('2023-12-08T12:45:45.643Z')
                        },
                        isDisabled: false,
                        _id: ('671a203747f81e8b144a5715')
                    },
                    isDisabled: false,
                    _id: ('671a203747f81e8b144a5714')
                },
                answerText: 'test',
                answers: ['3', '4'],
                correct: '4',
                createdByChatId: '7113959453',
                isDeleted: false,
                createdAt: ('2024-10-24T10:35:33.939Z'),
                updatedAt: ('2024-10-24T10:35:33.940Z'),
                id: 50,
                __v: 0
            }
        ]




        // Question.insertMany(data.map(item => {
        //     return { ...item, chat_id: 561932032 }
        // })).then(data => {
        //     console.log('boldi')
        // }).catch(e => {
        //     console.log(e, ' bolmadi')
        // });



        console.log('MongoDBga ulanish muvaffaqiyatli amalga oshirildi');
    } catch (err) {
        console.error('MongoDBga ulanishda xatolik yuz berdi:', err);
        process.exit(1);
    }
};

let personalChatId = '561932032'


let rolesList = ['Admin', 'Master', 'User']
let emojiWithName = {
    'Admin': `🗝️ Admin`,
    'Master': `🛠️ Master`,
    'User': `👤 User`
}
let emoji = {
    'Admin': `🗝️`,
    'Master': `🛠️`,
    'User': `👤`
}

// let uncategorizedProduct = [1003947, 1002442]
let uncategorizedProduct = []

module.exports = { bot, personalChatId, conn_params, db, connectDB, rolesList, emojiWithName, emoji, uncategorizedProduct }


// mongo db ga ulanish

// mongosh  => connect uchun
// show dbs => databaselarni ko'rish uchun
// use Ferro_master => basa ulanish
