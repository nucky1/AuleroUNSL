
getReservas();

async function getReservas() {
    let token;
    if(localStorage.getItem("token")){
        token = localStorage.getItem("token");
        console.log(token); 
    }
    let responseJSON = await fetch('http://localhost:3000/reservaDocente',{
        method: 'GET', // or 'PUT'
        headers:{ // NO SE PA QUE SIRVE 
          'token': token // NO SE PA QUE SIRVE  
        }
      })
        .then(function (response) { //Trae los filtros en el parametro "response" 
            return response.json(); //Retorno como JSON los datos de la API
        });
        cargarTablaReservas(responseJSON); // Con el awayt espero a que responda, despues llamo a cargarFiltros
}





function cargarTablaReservas(reservas) {
    let tabla = document.getElementById('tbody');
    //eliminamos las filas
    for (let index = tabla.rows.length -1; index > -1; index--) {
        tabla.deleteRow(index);
    }

    let beforeInfoReserva = '<div class="acordion-heading">' +
        '<tr class="accordion-toggle" data-toggle="collapse" href="#collapse';
    let fincolapsar = '">';
    let afterInfoReserva = '</tr>' +
        '</div >' +
        '<tr>' +
        '<td colspan = "4" style = "padding: 0; border-top-style: none;">' +
        '<div id="collapse';
    let finColapsedos = '" class="collapse">' +
        '<div class="expansible">' +
        '<ul class="list-inline">';
    let beforeExtra = '<li><span class="glyphicon glyphicon-check icon-check"></span>';
    let afterExtra = '</li>';
    let endFilabeforeId = '</ul>' +
        '</div >' +
        '<div class="botones text-right">' +
        '<button type="button" class="btn btn-line mb-2" onclick="location.href=\'eliminarReserva/id/';
    
    let endFila = '>Eliminar Reserva</button>'  +
        '</div>' +
        '</div >' +
        '</td >' +
        '</tr >';
    let codeHtml;

    for (let index in reservas) {
        let infoReserva = '<td>' + reservas[index].aula.nombre +' '+ reservas[index].aula.numero+ '</td>';
        infoReserva += '<td>' + reservas[index].dia + '</td>';
        //HORARIO
        let horaIn = reservas[index].horaInicio;
        let horaFin = reservas[index].horaFin;
        infoReserva += '<td>' + horaIn / 100 + ':' + horaIn % 100 + " - " + horaFin / 100 + ':' + horaFin % 100+'</td>';
        console.log(reservas[index]);
        infoReserva += '<td>' + reservas[index].materia[0].nombre + '</td>';
        infoReserva += '<td>' + reservas[index].estado + '</td>';
        let extrasAula = ''; 
        for (let ind in reservas[index].aula.extras) {
            extrasAula += beforeExtra + reservas[index].aula.extras[ind].extra + afterExtra;
        }
        tabla.innerHTML += beforeInfoReserva + index + fincolapsar + infoReserva + afterInfoReserva + index + finColapsedos + extrasAula + endFilabeforeId + reservas[index].id + endFila;
    }
}