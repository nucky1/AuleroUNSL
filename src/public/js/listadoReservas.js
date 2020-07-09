
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
        '<td colspan = "5" style = "padding: 0; border-top-style: none;">' +
        '<div id="collapse';
    let finColapsedos = '" class="collapse">' +
        '<div class="expansible">' +
        '<ul class="list-inline">';
    let beforeExtra = '<li><span class="glyphicon glyphicon-check icon-check"></span>';
    let afterExtra = '</li>';
    let endFilabeforeId = '</ul>' +
        '</div >' +
        '<div class="botones text-right">' +
        '<button type="button" class="btn btn-line mb-2" data-toggle="modal" data-target="#flipFlop" onclick="';
    
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
        infoReserva += '<td>' + Math.floor(horaIn / 100) + ':' + Math.floor(horaIn % 100) + " - " + Math.floor(horaFin / 100) + ':' + Math.floor(horaFin % 100)+'</td>';
        
        infoReserva += '<td>' + reservas[index].materia[0].nombre + '</td>';
        infoReserva += '<td>' + reservas[index].estado + '</td>';
        let extrasAula = ''; 
        for (let ind in reservas[index].aula.extras) {
            extrasAula += beforeExtra + reservas[index].aula.extras[ind].extra + afterExtra;
        }
        console.log(reservas[index].id)
        tabla.innerHTML += beforeInfoReserva + index + fincolapsar + infoReserva + afterInfoReserva + index + finColapsedos + extrasAula + endFilabeforeId + "cancelarReservaDocente("+reservas[index].id+")\"" + endFila;
    }
}

//Eliminar reserva
async function cancelarReservaDocente(id) {
    let token;
    if (localStorage.getItem("token")) {
      token = localStorage.getItem("token");
    }
    data = {id: id};
    const responseJSON = await fetch(
      "http://localhost:3000/cancelarReserva",
      {
        method: "POST", // or 'PUT'
        body:JSON.stringify(data),
        headers: {
          // NO SE PA QUE SIRVE
          'token': token, // NO SE PA QUE SIRVE
          'Content-Type': 'application/json;charset=utf-8' // Sin esto no envia el body
        },
      }
    ).then(function (response) {
      console.log(response)
      return response;
      //alert("Reserva Eliminada, por favor recargue la pagina.");
    });
    if(responseJSON.status != 404){
      location.reload();
    }
  }
  