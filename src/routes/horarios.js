const express = require("express");
const router = express.Router();
const morgan = require("morgan");
const path = require("path");
const crypto = require("crypto");
const excel = require("excel4node");

var diasMapa = {
  Lunes: 2,
  Martes: 3,
  Miercoles: 4,
  Jueves: 5,
  Viernes: 6,
  Sabado: 7,
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
  worksheet.cell(1, diasMapa["Lunes"]).string("Lunes").style(style);
  worksheet.cell(1, diasMapa["Martes"]).string("Martes").style(style);
  worksheet.cell(1, diasMapa["Miercoles"]).string("Miercoles").style(style);
  worksheet.cell(1, diasMapa["Jueves"]).string("Jueves").style(style);
  worksheet.cell(1, diasMapa["Viernes"]).string("Viernes").style(style);
  worksheet.cell(1, diasMapa["Sabado"]).string("Sábado").style(style);

  worksheet.cell(2, 1).string("07:00").style(style);
  worksheet.cell(3, 1).string("07:30").style(style);
  worksheet.cell(4, 1).string("08:00").style(style);
  worksheet.cell(5, 1).string("08:30").style(style);
  worksheet.cell(6, 1).string("09:00").style(style);
  worksheet.cell(7, 1).string("09:30").style(style);
  worksheet.cell(8, 1).string("10:00").style(style);
  worksheet.cell(9, 1).string("10:30").style(style);
  worksheet.cell(10, 1).string("11:00").style(style);
  worksheet.cell(11, 1).string("11:30").style(style);
  worksheet.cell(12, 1).string("12:00").style(style);
  worksheet.cell(13, 1).string("12:30").style(style);
  worksheet.cell(14, 1).string("13:00").style(style);
  worksheet.cell(15, 1).string("13:30").style(style);
  worksheet.cell(16, 1).string("14:00").style(style);
  worksheet.cell(17, 1).string("14:30").style(style);
  worksheet.cell(18, 1).string("15:00").style(style);
  worksheet.cell(19, 1).string("15:30").style(style);
  worksheet.cell(20, 1).string("16:00").style(style);
  worksheet.cell(21, 1).string("16:30").style(style);
  worksheet.cell(22, 1).string("17:00").style(style);
  worksheet.cell(23, 1).string("17:30").style(style);
  worksheet.cell(24, 1).string("18:00").style(style);
  worksheet.cell(25, 1).string("18:30").style(style);
  worksheet.cell(26, 1).string("19:00").style(style);
  worksheet.cell(27, 1).string("19:30").style(style);
  worksheet.cell(28, 1).string("20:00").style(style);
  worksheet.cell(29, 1).string("20:30").style(style);
  worksheet.cell(30, 1).string("21:00").style(style);
  worksheet.cell(31, 1).string("21:30").style(style);
  worksheet.cell(32, 1).string("22:00").style(style);
  worksheet.cell(33, 1).string("22:30").style(style);
  worksheet.cell(34, 1).string("23:00").style(style);
}

function buildExcel(req, res) {
  const nameFile = crypto.randomBytes(20).toString("hex") + ".xlsx";

  var workbook = new excel.Workbook();
  var worksheet = workbook.addWorksheet("HORARIOS");

  buildDaysAndHours(workbook, worksheet);
  var semana = new Map();

  //  (2,2) es la celda inicial
  /*
        FORMA DEL RES.BODY:
        {
            "horario":[
                    {
                        "nombre": "Nombre de la materia.",
                        "horarios": [
                            {
                                "diaSemana": "Lunes",
                                "horaInicio": "09:00",
                                "horaFin": "10:00"
                            }
                        ]
                    }
                ]
        }

         */

  req.body.horario.forEach((materia) => {
    materia.horarios.forEach((horaDia) => {
      if (horaDia.diaSemana in semana) {
        semana.set(
          horaDia.diaSemana,
          semana.get(horaDia.diaSemana).push({
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
          horasMapa[materia.horaFin], // FILA
          diasMapa[dia], // COLUMNA
          true // MERGE
        )
        .string(materia.nombre);
    });
  }

  //workbook.write(nameFile, res); DESCOMENTAR ESTO CUANDO ESTÉ LA PARTE DEL FRONT
  workbook.write(nameFile);
  res.sendStatus(200);
}

router.post("/horarioPersonalizado/download", (req, res) => {
  buildExcel(req, res);
});

module.exports = router;
