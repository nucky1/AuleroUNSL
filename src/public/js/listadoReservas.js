
getReservas();

async function getReservas() {
    let token;
    if(localStorage.getItem("token")){
        token = localStorage.getItem("token");
        console.log(token); 
    }
    let responseJSON = await fetch('reservaDocente',{
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
        '<button type="button" class="btn btn-line mb-2" data-toggle="modal" data-target="#cancelarReserva" onclick="';
   let endFila = '>Eliminar Reserva</button>'  +
        '</div>' +
        '</div >' +
        '</td >' +
        '</tr >';
    let codeHtml;
    let endFilabeforeId2 = '>Eliminar Reserva</button>'  +
    '<button type="button" class="btn btn-line mb-2" data-toggle="modal" data-target="#comentarAula" onclick="';
    let endFila2 = '>Comentar Aula</button>'  +
      '</div>' +
      '</div >' +
      '</td >' +
      '</tr >';
    for (let index in reservas) {
        let infoReserva = '<td>' + reservas[index].aula.nombre +' '+ reservas[index].aula.numero+ '</td>';
        infoReserva += '<td>' + reservas[index].dia + '</td>';
        //HORARIO
        let horaIn = reservas[index].horaInicio;
        let horaFin = reservas[index].horaFin;
        infoReserva += '<td>' + Math.floor(horaIn / 100) + ':' + Math.floor(horaIn % 100) + " - " + Math.floor(horaFin / 100) + ':' + Math.floor(horaFin % 100)+'</td>';
        
        infoReserva += '<td>' + reservas[index].materia[0].nombre + '</td>';
        infoReserva += '<td>' + reservas[index].periodo + '</td>';
        infoReserva += '<td>' + reservas[index].estado + '</td>';
        let extrasAula = ''; 
        for (let ind in reservas[index].aula.extras) {
            extrasAula += beforeExtra + reservas[index].aula.extras[ind].extra + afterExtra;
        }
        if(reservas[index].estado == 'FINALIZADA'){
          tabla.innerHTML += beforeInfoReserva + index + fincolapsar + infoReserva + afterInfoReserva + index + finColapsedos + extrasAula + endFilabeforeId + "popUpCancelar("+reservas[index].id+")\"" + endFilabeforeId2 + "popUpComentar("+reservas[index].aula.id+","+reservas[index].docente.id+")\"" + endFila2;
        }else{
          tabla.innerHTML += beforeInfoReserva + index + fincolapsar + infoReserva + afterInfoReserva + index + finColapsedos + extrasAula + endFilabeforeId + "popUpCancelar("+reservas[index].id+")\"" + endFila;
        }
        
    }
}
//variables para
var idReserva;
var idAula;
var idDocente;
function popUpComentar(idA,idD){
  idAula = idA;
  idDocente = idD;
  let popUp = document.getElementById("comentarAula");
  popUp.setAttribute("aria-hidden", "false");
}
function popUpCancelar(id){
  idReserva = id;
  let popUp = document.getElementById("cancelarReserva");
  popUp.setAttribute("aria-hidden", "false");
}

//Eliminar reserva
async function cancelarReservaDocente() {
    let token;
    if (localStorage.getItem("token")) {
      token = localStorage.getItem("token");
    }
    data = {id: idReserva};
    const responseJSON = await fetch(
      "cancelarReserva",
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
    }else{
      showError("Ocurrio un error al cancelar la reserva");
    }
  }
//Comentar aula
async function comentarAula() {
  let textArea = document.getElementById("comentario");
  if(textArea.value.trim() === ""){
    showError("El comentario no puede ser vacio o solo espacios en blanco.");
  }else{
    let token;
    if (localStorage.getItem("token")) {
      token = localStorage.getItem("token");
    }
    data = {idAula : idAula, idDoc : idDocente,comentario : textArea.value};
    const responseJSON = await fetch(
      "comentarAula",
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
      showSuccess();
    }else{
      showError("Ocurrio un error al enviar su comentario.");
    }
    textArea.value = "";
  }
}
function showError(error){
  document.getElementById("textError").innerHTML = '<span class="badge badge-danger" style="background: #f15e5e; margin-right:20px;"><i class="material-icons">&#xE5CD;</i></span>'+ error;
  $("#cartelFail").modal();
  setTimeout(function(){ 
    $("#cartelFail").modal('hide');
  }, 2000);
}
function showSuccess(){
  $("#cartelOk").modal();
  setTimeout(function(){ 
    $("#cartelOk").modal('hide');
  }, 2000);
}

  
