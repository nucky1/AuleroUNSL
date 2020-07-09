const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const excel = require("excel4node");

var diasMapa = {
  lunes: 2,
  martes: 3,
  miercoles: 4,
  jueves: 5,
  viernes: 6,
  sabado: 7,
};

var horasMapa = {
  "07:00": 2,
  "07:30": 3,
  "08:00": 4,
  "08:30": 5,
  "09:00": 6,
  "09:30": 7,
  "10:00": 8,
  "10:30": 9,
  "11:00": 10,
  "11:30": 11,
  "12:00": 12,
  "12:30": 13,
  "13:00": 14,
  "13:30": 15,
  "14:00": 16,
  "14:30": 17,
  "15:00": 18,
  "15:30": 19,
  "16:00": 20,
  "16:30": 21,
  "17:00": 22,
  "17:30": 23,
  "18:00": 24,
  "18:30": 25,
  "19:00": 26,
  "19:30": 27,
  "20:00": 28,
  "20:30": 29,
  "21:00": 30,
  "21:30": 31,
  "22:00": 32,
  "22:30": 33,
  "23:00": 30,
};

// DEVUELVE LA PAGINA HORARIO PERSONALIZADO
router.get("/horarioPersonalizado", (req, res) => {
  res.render("horariosPersonalizado.html");
});

function buildDaysAndHours(workbook, worksheet) {
  const style = workbook.createStyle({
    alignment: {
      horizontal: "center",
    },
    font: {
      bold: true,
    },
  });

  //cell(startRow, startColumn, [[endRow, endColumn], isMerged]);
  worksheet.cell(1, diasMapa["lunes"]).string("Lunes").style(style);
  worksheet.cell(1, diasMapa["martes"]).string("Martes").style(style);
  worksheet.cell(1, diasMapa["miercoles"]).string("Miercoles").style(style);
  worksheet.cell(1, diasMapa["jueves"]).string("Jueves").style(style);
  worksheet.cell(1, diasMapa["viernes"]).string("Viernes").style(style);
  worksheet.cell(1, diasMapa["sabado"]).string("Sábado").style(style);

  worksheet.cell(2, 1).string("07:00 a 07:30").style(style);
  worksheet.cell(3, 1).string("07:30 a 08:00").style(style);
  worksheet.cell(4, 1).string("08:00 a 08:30").style(style);
  worksheet.cell(5, 1).string("08:30 a 09:00").style(style);
  worksheet.cell(6, 1).string("09:00 a 09:30").style(style);
  worksheet.cell(7, 1).string("09:30 a 10:00").style(style);
  worksheet.cell(8, 1).string("10:00 a 10:30").style(style);
  worksheet.cell(9, 1).string("10:30 a 11:00").style(style);
  worksheet.cell(10, 1).string("11:00 a 11:30").style(style);
  worksheet.cell(11, 1).string("11:30 a 12:00").style(style);
  worksheet.cell(12, 1).string("12:00 a 12:30").style(style);
  worksheet.cell(13, 1).string("12:30 a 13:00").style(style);
  worksheet.cell(14, 1).string("13:00 a 13:30").style(style);
  worksheet.cell(15, 1).string("13:30 a 14:00").style(style);
  worksheet.cell(16, 1).string("14:00 a 14:30").style(style);
  worksheet.cell(17, 1).string("14:30 a 15:00").style(style);
  worksheet.cell(18, 1).string("15:00 a 15:30").style(style);
  worksheet.cell(19, 1).string("15:30 a 16:00").style(style);
  worksheet.cell(20, 1).string("16:00 a 16:30").style(style);
  worksheet.cell(21, 1).string("16:30 a 17:00").style(style);
  worksheet.cell(22, 1).string("17:00 a 17:30").style(style);
  worksheet.cell(23, 1).string("17:30 a 18:00").style(style);
  worksheet.cell(24, 1).string("18:00 a 18:30").style(style);
  worksheet.cell(25, 1).string("18:30 a 19:00").style(style);
  worksheet.cell(26, 1).string("19:00 a 19:30").style(style);
  worksheet.cell(27, 1).string("19:30 a 20:00").style(style);
  worksheet.cell(28, 1).string("20:00 a 20:30").style(style);
  worksheet.cell(29, 1).string("20:30 a 21:00").style(style);
  worksheet.cell(30, 1).string("21:00 a 21:30").style(style);
  worksheet.cell(31, 1).string("21:30 a 22:00").style(style);
  worksheet.cell(32, 1).string("22:00 a 22:30").style(style);
  worksheet.cell(33, 1).string("22:30 a 23:00").style(style);
}

function buildExcel(req, res) {
  const nameFile = crypto.randomBytes(20).toString("hex") + ".xlsx";

  var workbook = new excel.Workbook();
  var worksheet = workbook.addWorksheet("HORARIOS");

  buildDaysAndHours(workbook, worksheet);
  var semana = new Map();
  req.body.forEach((materia) => {
    materia.horarios.forEach((horaDia) => {
      if (horaDia.diaSemana in semana) {
        semana.set(
          horaDia.diaSemana,
          semana[horaDia.diaSemana].push({
            nombre: materia.nombre,
            horaInicio: horaDia.horaInicio,
            horaFin: horaDia.horaFin,
          })
        );
      } else {
        semana[horaDia.diaSemana] = [
          {
            nombre: materia.nombre,
            horaInicio: horaDia.horaInicio,
            horaFin: horaDia.horaFin,
          },
        ];
      }
    });
  });

  for (var dia in semana) {
    semana[dia].forEach((materia) => {
      worksheet
        .cell(
          horasMapa[materia.horaInicio], // FILA
          diasMapa[dia], // COLUMNA
          horasMapa[materia.horaFin]-1, // FILA
          diasMapa[dia], // COLUMNA
          true // MERGE
        )
        .string(materia.nombre)
        .style({
          alignment: {
            horizontal: "center",
            vertical: "center",
            wrapText: true,
          },
          border: {
            left: {
              style: 'medium',
            },
            right: {
              style: 'medium',
            },
            top: {
              style: 'medium',
            },
            bottom: {
              style: 'medium',
            },
          },
        });
    });
  }

  workbook.write(nameFile, res);
}

router.post("/horarioPersonalizado/download", (req, res) => {
  buildExcel(req, res);
});

module.exports = router;
