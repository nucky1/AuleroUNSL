

getReservas();


async function getReservas() {
    let token;
    if(localStorage.getItem("token")){
        token = localStorage.getItem("token");
        console.log(token); 
    }
    let responseJSON = await fetch('allReservas',{
        method: 'GET', // or 'PUT'
        headers:{ // NO SE PA QUE SIRVE 
          'token': token // NO SE PA QUE SIRVE  
        }
      })
        .then(function (response) { //Trae los filtros en el parametro "response" 
            return response.json(); //Retorno como JSON los datos de la API
        });
        cargarTablaAdmin(responseJSON); // Con el awayt espero a que responda, despues llamo a cargarFiltros
}
var res;
var est;
function openPopUp(reserva,estado){
    res = reserva;
    est = estado;
}
async function updateReservaAdmin(){
    let token;
    if(localStorage.getItem("token")){
        token = localStorage.getItem("token");
        console.log(token); 
    }
    var data = {
        idReserva : res,
        estado : est
    };
    console.log(data);
    console.log(JSON.stringify(data));
    let responseJSON = await fetch('updateReserva',{
        method: 'POST', 
        body: JSON.stringify(data),
        headers:{ // NO SE PA QUE SIRVE 
          'token': token, // NO SE PA QUE SIRVE  
          'Content-Type': 'application/json;charset=utf-8' // Sin esto no envia el body
        }
      }).then(function (response) { //Trae los filtros en el parametro "response" 
            return response;
        });
        if(responseJSON.status != 200){
            if(est == "RECHAZADA"){
                showError("Ocurrio un error al rechazar la reserva.");
            }else{
                showError("Ocurrio un error al autorizar la reserva.");
            }
          }else{
            if(est == "RECHAZADA"){
                showSuccess("La reserva fue rechazada.");
            }else{
                showSuccess("La reserva fue autorizada.");
            }
          }

}
function cargarTablaAdmin(reservas){
    let container = document.getElementById("containerListado");
    if(reservas.length <= 0){
        container.innerHTML += "<h3 class='subtitulo'>No hay reservas hasta el momento</h3><br></br>";
        return;
    }
    let primerCuatri = "<h3 class='subtitulo'>1er Cuatrimestre</h3><br></br>";
    let segundoCuatri = "<h3 class='subtitulo'>2do Cuatrimestre</h3><br></br>";
    let anuales = "<h3 class='subtitulo'>Anuales</h3><br></br>";
    let autorizadas = "<h3 class='subtitulo'>Autorizadas</h3><br></br>";
    let rechazadas ="<h3 class='subtitulo'>Rechazadas</h3><br></br>";
    let afterSubtitle = "<table class='table table-hover'>"
    +"<thead>"
    +"<tr>"
    +    "<th>Aula</th>"
    +    "<th>Día</th>"
    +    "<th>Horario</th>"
    +    "<th>Materia</th>"
    +    "<th>Docente</th>"
    +"</tr>"
    +"</thead>"
    +"<tbody>" ;
    let beforeinfo = '<div class="acordion-heading">' +
        '<tr class="accordion-toggle" data-toggle="collapse" href="#collapse';
    let fincolapsar = '">';
    let afterInfoAula = '</tr>' +
        '</div >' +
        '<tr>' +
        '<td colspan = "5" style = "padding: 0; border-top-style: none;">' +
        '<div id="collapse';
    let finColapsedos = '" class="collapse">' +
        '<br>' +
        '<div class="botones text-right">' +
        '<button type="button" class="btn btn-line mb-2" data-toggle="modal" data-target="#cancelarReserva" onclick="openPopUp(';
    
    let endFilabeforeId2 = ',\'RECHAZADA\')">Rechazar reserva</button>' +
    '<button type="button" class="btn btn-line mb-2" data-toggle="modal" data-target="#autorizarReserva" onclick="openPopUp('
    let endFila = ',\'AUTORIZADA\')">Autorizar reserva</button>' +
        '</div>' +
        '</div>' +
        '</td>' +
        '</tr>';
    let endTable =" </tbody>" 
    +"</table>";
    //llenamos las materias de primer cuatri
    let listaReservas = "";
    var reservas2Cuatri = [];
    var reservasAutorizadas =[];
    var reservasRechazadas =[];
    var reservasAnual = [];
    var indice = 0;
    for (let index in reservas) {
        switch(reservas[index].estado){
            case 'AUTORIZADA':{
                reservasAutorizadas.push(reservas[index]);
                break;
            }
            case 'RECHAZADA':{
                reservasRechazadas.push(reservas[index]);
                break;
            }
            case 'PENDIENTE':{
                if(reservas[index].materia[0].periodo != "primer cuatrimestre"){
                    reservas2Cuatri.push(reservas[index]);
                }else{
                    let infoAula = '<td>' + reservas[index].aula.nombre +' '+ reservas[index].aula.numero+ '</td>';
                    infoAula += '<td>' + reservas[index].dia + '</td>'
                    infoAula += '<td>' + parseInt(reservas[index].horaInicio/100) +":"+parseInt(reservas[index].horaInicio%100) +"-"+ parseInt(reservas[index].horaFin/100)+":"+parseInt(reservas[index].horaFin%100)+ '</td>';
                    infoAula += '<td>' + reservas[index].materia[0].nombre + '</td>';
                    infoAula += '<td>' + reservas[index].docente.nombre + " "+ reservas[index].docente.apellido + '</td>';
                    listaReservas += beforeinfo + indice + fincolapsar + infoAula + afterInfoAula + indice + finColapsedos + reservas[index].id +endFilabeforeId2+reservas[index].id+ endFila;
                    indice++;
                }
            }
        }
    }
    if(listaReservas != "") 
        container.innerHTML +=primerCuatri+ afterSubtitle + listaReservas + endTable;
    //las del segundo
    if(reservas2Cuatri.length > 0){
        listaReservas = "";
        container.innerHTML += segundoCuatri;
        for (let index in reservas2Cuatri) {
            if(reservas2Cuatri[index].materia[0].periodo != "anual"){
                reservasAnual.push(reservas2Cuatri[index]);
            }else{
                let infoAula = '<td>' + reservas2Cuatri[index].aula.nombre +' '+ reservas2Cuatri[index].aula.numero+ '</td>';
                infoAula += '<td>' + reservas2Cuatri[index].dia + '</td>'
                infoAula += '<td>' + parseInt(reservas2Cuatri[index].horaInicio/100) +":"+parseInt(reservas2Cuatri[index].horaInicio%100) +"-"+ parseInt(reservas2Cuatri[index].horaFin/100)+":"+parseInt(reservas2Cuatri[index].horaFin%100)+ '</td>';
                infoAula += '<td>' + reservas2Cuatri[index].materia[0].nombre + '</td>';
                infoAula += '<td>' + reservas2Cuatri[index].docente.nombre + " "+ reservas2Cuatri[index].docente.apellido + '</td>';
                listaReservas += beforeinfo + indice + fincolapsar + infoAula + afterInfoAula + indice + finColapsedos + reservas2Cuatri[index].id +endFilabeforeId2+reservas2Cuatri[index].id+ endFila;
                indice++;
            }
        }
        container.innerHTML += afterSubtitle + listaReservas + endTable;
    }
    // las aunales
    if(reservasAnual.length > 0){
        listaReservas = "";
        container.innerHTML += anuales;
        for (let index in reservasAnual) {
            let infoAula = '<td>' + reservasAnual[index].aula.nombre +' '+ reservasAnual[index].aula.numero+ '</td>';
            infoAula += '<td>' + reservasAnual[index].dia + '</td>'
            infoAula += '<td>' + parseInt(reservasAnual[index].horaInicio/100) +":"+parseInt(reservasAnual[index].horaInicio%100) +"-"+ parseInt(reservasAnual[index].horaFin/100)+":"+parseInt(reservasAnual[index].horaFin%100)+ '</td>';
            infoAula += '<td>' + reservasAnual[index].materia[0].nombre + '</td>';
            infoAula += '<td>' + reservasAnual[index].docente.nombre + " "+ reservasAnual[index].docente.apellido + '</td>';       
            listaReservas += beforeinfo + indice + fincolapsar + infoAula + afterInfoAula + indice + finColapsedos + reservasAnual[index].id +endFilabeforeId2+reservasAnual[index].id+ endFila;
            indice++;
        }
        container.innerHTML += afterSubtitle + listaReservas + endTable;
    }
    cargarAutorizadasRechazadas(reservasAutorizadas,reservasRechazadas);
}
function cargarAutorizadasRechazadas(reservasAutorizadas,reservasRechazadas){
    let container = document.getElementById("containerListado");
    let autorizadas = "<br></br><h3 class='subtitulo'>Autorizadas</h3><br></br>";
    let rechazadas ="<br></br><h3 class='subtitulo'>Rechazadas</h3><br></br>";
    let afterSubtitle = "<table class='table table-hover'>"
    +"<thead>"
    +"<tr>"
    +    "<th>Aula</th>"
    +    "<th>Día</th>"
    +    "<th>Horario</th>"
    +    "<th>Materia</th>"
    +    "<th>Docente</th>"
    +    "<th>Periodo</th>"
    +"</tr>"
    +"</thead>"
    +"<tbody>" ;
    let beforeinfo = '<tr> ';
    let afterInfoAula = '</tr>' ;
    let endTable =" </tbody>" 
    +"</table>";
    
    var indice = 0;
    if(reservasAutorizadas.length > 0){
        listaReservas = "";
        container.innerHTML += autorizadas;
        for (let index in reservasAutorizadas) {
            let infoAula = '<td>' + reservasAutorizadas[index].aula.nombre +' '+ reservasAutorizadas[index].aula.numero+ '</td>';
            infoAula += '<td>' + reservasAutorizadas[index].dia + '</td>'
            infoAula += '<td>' + parseInt(reservasAutorizadas[index].horaInicio/100) +":"+parseInt(reservasAutorizadas[index].horaInicio%100) +"-"+ parseInt(reservasAutorizadas[index].horaFin/100)+":"+parseInt(reservasAutorizadas[index].horaFin%100)+ '</td>';
            infoAula += '<td>' + reservasAutorizadas[index].materia[0].nombre + '</td>';
            infoAula += '<td>' + reservasAutorizadas[index].docente.nombre + " "+ reservasAutorizadas[index].docente.apellido + '</td>';
            infoAula += '<td>' + reservasAutorizadas[index].materia[0].periodo + '</td>';
            listaReservas += beforeinfo + infoAula + afterInfoAula;
            indice++;
        }
        container.innerHTML += afterSubtitle + listaReservas + endTable;
    }
    if(reservasRechazadas.length <= 0)
        return;
    listaReservas = "";
    container.innerHTML += rechazadas;
    for (let index in reservasRechazadas) {
        let infoAula = '<td>' + reservasRechazadas[index].aula.nombre +' '+ reservasRechazadas[index].aula.numero+ '</td>';
        infoAula += '<td>' + reservasRechazadas[index].dia + '</td>'
        infoAula += '<td>' + parseInt(reservasRechazadas[index].horaInicio/100) +":"+parseInt(reservasRechazadas[index].horaInicio%100) +"-"+ parseInt(reservasRechazadas[index].horaFin/100)+":"+parseInt(reservasRechazadas[index].horaFin%100)+ '</td>';
        infoAula += '<td>' + reservasRechazadas[index].materia[0].nombre + '</td>';
        infoAula += '<td>' + reservasRechazadas[index].docente.nombre + " "+ reservasRechazadas[index].docente.apellido + '</td>';
        infoAula += '<td>' + reservasAutorizadas[index].materia[0].periodo + '</td>';
        listaReservas += beforeinfo + infoAula + afterInfoAula;
        indice++;
    }
    container.innerHTML += afterSubtitle + listaReservas + endTable;
}
function showError(error){
    document.getElementById("textError").innerHTML = '<span class="badge badge-danger" style="background: #f15e5e; margin-right:20px;"><i class="material-icons">&#xE5CD;</i></span>'+error;
    $("#cartelFail").modal();
    setTimeout(function(){ 
      $("#cartelFail").modal('hide');
    }, 2000);
  }
  function showSuccess(text){
    document.getElementById("textOk").innerHTML = '<span class="badge badge-success" style="background: #82ce34; margin-right:20px;"><i class="material-icons">&#xE876;</i></span>'+text;
    $("#cartelOk").modal();
    setTimeout(function(){ 
      $("#cartelOk").modal('hide');
      location.reload();
    }, 2000);
  }
