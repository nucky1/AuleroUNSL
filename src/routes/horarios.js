const express = require("express");
const router = express.Router();
const morgan = require("morgan");
const path = require('path');
const crypto = require("crypto");
const excel = require('excel4node');

// DEVUELVE LA PAGINA HORARIO PERSONALIZADO
router.get("/horarioPersonalizado", (req, res) => {
    res.render("horariosPersonalizado.html");
});

function buildDaysAndHours(workbook,worksheet) {

    const style = workbook.createStyle({
        alignment:{
            horizontal:'center'
        },
        font:{
            bold: true
        }
    })

    //cell(startRow, startColumn, [[endRow, endColumn], isMerged]);
    worksheet.cell(1,2).string('Lunes').style(style);
    worksheet.cell(1,3).string('Martes').style(style);
    worksheet.cell(1,4).string('Miercoles').style(style);
    worksheet.cell(1,5).string('Jueves').style(style);
    worksheet.cell(1,6).string('Viernes').style(style);

    worksheet.cell(2,1).string('07:00').style(style);
    worksheet.cell(3,1).string('07:30').style(style);
    worksheet.cell(4,1).string('08:00').style(style);
    worksheet.cell(5,1).string('08:30').style(style);
    worksheet.cell(6,1).string('09:00').style(style);
    worksheet.cell(7,1).string('09:30').style(style);
    worksheet.cell(8,1).string('10:00').style(style);
    worksheet.cell(9,1).string('10:30').style(style);
    worksheet.cell(10,1).string('11:00').style(style);
    worksheet.cell(11,1).string('11:30').style(style);
    worksheet.cell(12,1).string('12:00').style(style);
    worksheet.cell(13,1).string('12:30').style(style);
    worksheet.cell(14,1).string('13:00').style(style);
    worksheet.cell(15,1).string('13:30').style(style);
    worksheet.cell(16,1).string('14:00').style(style);
    worksheet.cell(17,1).string('14:30').style(style);
    worksheet.cell(18,1).string('15:00').style(style);
    worksheet.cell(19,1).string('15:30').style(style);
    worksheet.cell(20,1).string('16:00').style(style);
    worksheet.cell(21,1).string('16:30').style(style);
    worksheet.cell(22,1).string('17:00').style(style);
    worksheet.cell(23,1).string('17:30').style(style);
    worksheet.cell(24,1).string('18:00').style(style);
    worksheet.cell(25,1).string('18:30').style(style);
    worksheet.cell(26,1).string('19:00').style(style);
    worksheet.cell(27,1).string('19:30').style(style);
    worksheet.cell(28,1).string('20:00').style(style);
    worksheet.cell(29,1).string('20:30').style(style);
    worksheet.cell(30,1).string('21:00').style(style);
    worksheet.cell(31,1).string('21:30').style(style);
    worksheet.cell(32,1).string('22:00').style(style);
    worksheet.cell(33,1).string('22:30').style(style);
    worksheet.cell(34,1).string('23:00').style(style);
}

function buildExcel(req,res) {   
    const nameFile = crypto.randomBytes(20).toString('hex')+".xlsx";

    var workbook = new excel.Workbook();
    var worksheet = workbook.addWorksheet('HORARIOS');

    buildDaysAndHours(workbook,worksheet);
    


    workbook.write(nameFile,res);
}

// CAMBIAR ESTA RUTA POR POST
router.get("/horarioPersonalizado/download", (req, res) => {
    // A ESTA FUNCION LE DEBERIAN LLEGAR LOS NOMBRES Y HORARIOS DE LAS MATERIAS POR UN BODY
    buildExcel(req,res);
});

module.exports = router;