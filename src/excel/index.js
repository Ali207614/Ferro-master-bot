const fs = require("fs");
const { get } = require("lodash");
const path = require("path");
const ExcelJS = require('exceljs');

async function generateTestResultExcel(testResult, user) {
    let rows = testResult.map((item, i) => {
        let totalQuestions = get(item, 'answers', []).length
        let correctAnswers = get(item, 'answers', []).filter(item => item.isCorrect).length
        const correctPercentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);

        const timeDifference = new Date(item.endDate) - new Date(item.startDate); // Millisekundlarda farq
        const timeSpentMinutes = Math.floor(timeDifference / 60000); // To'liq minutlarni hisoblash
        const timeSpentSeconds = Math.floor((timeDifference % 60000) / 1000); // Qolgan sekundlarni hisoblas

        let formattedDate = (date) => {
            return new Date(date).toLocaleString('uz-UZ', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
            });
        }
        let statusObj = {
            0: `⏳ Hali tekshirilmagan`,
            1: `✅ Tekshirildi`,
            2: `❌ Rad etilgan`
        }
        return {
            ...item,
            no: i + 1,
            name: get(item, 'name.textUzLat', ''),
            breadCrumb: `${get(item, 'category.parent.name.textUzLat')} > ${get(item, 'category.name.textUzLat')}`,
            totalQuestions: `${totalQuestions} ta`,
            correct: `${correctAnswers} ta`,
            inCorrect: `${get(item, 'answers', []).filter(item => !item.isCorrect).length} ta`,
            percent: `${correctPercentage} %`,
            time: `${timeSpentMinutes} minut ${timeSpentSeconds} sekund`,
            startDate: formattedDate(item.startDate),
            endDate: formattedDate(item.endDate),
            status: item.full ? statusObj[item.confirm] : '-'
        }
    });

    // Excel fayl yaratish
    let workbook = new ExcelJS.Workbook();
    let worksheet = workbook.addWorksheet('Ma\'lumotlar');

    // Ustunlar nomini qo'shish
    worksheet.columns = [
        { header: '№', key: 'no', width: 5 },
        { header: 'Bosqich nomi', key: 'name', width: 25 },
        { header: 'Joylashuvi', key: 'breadCrumb', width: 20 },
        { header: 'Umumiy savollar', key: 'totalQuestions', width: 15 },
        { header: `To'gri javoblar ✅`, key: 'correct', width: 15 },
        { header: `Xato javoblar ❌`, key: 'inCorrect', width: 15 },
        { header: `To'gri javoblar foizda`, key: 'percent', width: 16 },
        { header: `Ketgan vaqt`, key: 'time', width: 15 },
        { header: `Test boshlangan sana`, key: 'startDate', width: 23 },
        { header: `Test tugagan sana`, key: 'endDate', width: 23 },
        { header: `Holati`, key: 'status', width: 18 },
    ];

    worksheet.getRow(1).height = 30;
    worksheet.getRow(1).eachCell({ includeEmpty: true }, (cell) => {
        cell.font = { size: 10, bold: true };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    rows.forEach(row => {
        const work = worksheet.addRow(row);
        work.height = 23;
        work.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
            cell.font = { size: 9, };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });
    });


    const filePath = path.join(__dirname, `${get(user, 'last_name', '-').replace(/[<>:"\/\\|?*]+/g, '-')} ${get(user, 'first_name', '-').replace(/[<>:"\/\\|?*]+/g, '-')}.xlsx`);
    await workbook.xlsx.writeFile(filePath);
    return filePath
}

module.exports = {
    generateTestResultExcel
}