

//getReservas();


async function getReservas() {
    if(localStorage.getItem("token")){
        let token = localStorage.getItem("token");
        console.log(token); 
    }
    let responseJSON = await fetch('http://localhost:3000/allReservas',{
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
function updateReservaAdmin(idAula,estado){
    if(localStorage.getItem("token")){
        let token = localStorage.getItem("token");
        console.log(token); 
    }
    let responseJSON = await fetch('http://localhost:3000/updateReserva',{
        method: 'POST', 
        body:{
            idAula : idAula,
            estado : estado
        },
        headers:{ // NO SE PA QUE SIRVE 
          'token': token // NO SE PA QUE SIRVE  
        }
      }).then(function (response) { //Trae los filtros en el parametro "response" 
            return response.json(); //Retorno como JSON los datos de la API
        });
}
function cargarTablaAdmin(reservas){
    let container = document.getElementById("containerListado");
    let primerCuatri = "<h3 class='subtitulo'>1er Cuatrimestre</h3><br></br>";
    let segundoCuatri = "<h3 class='subtitulo'>2do Cuatrimestre</h3><br></br>";
    let anuales = "<h3 class='subtitulo'>Anuales</h3><br></br>";
    let beforeinfo = "<table class='table table-hover'>"
    +"<thead>"
    +"<tr>"
    +    "<th>Aula</th>"
    +    "<th>Día</th>"
    +    "<th>Horario</th>"
    +    "<th>Materia</th>"
    +    "<th>Docente</th>"
    +"</tr>"
    +"</thead>"
    +"</table>"
    +"<tbody>" + '<div class="acordion-heading">' +
        '<tr class="accordion-toggle" data-toggle="collapse" href="#collapse';
    let fincolapsar = '">';
    let afterInfoAula = '</tr>' +
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
        '<button type="button" class="btn btn-line mb-2" onclick="updateReservaAdmin(';
    
    let endFilabeforeId2 = ',AUTORIZADA)">Rechazar reserva</button>' +
    '<button type="button" class="btn btn-line mb-2" onclick="updateReservaAdmin('
    let endFila = ',AUTORIZADA")>Autorizar reserva</button>' +
        '</div>' +
        '</div >' +
        '</td >' +
        '</tr >';
    //llenamos las materias de primer cuatri
    container.innerHTML += primerCuatri;
    var reservas2Cuatri;
    var indice = 0;
    for (let index in reservas) {
        if(reservas[index].materia.periodo != "primer cuatrimestre"){
            reservas2Cuatri.push(reserva[index]);
        }else{
            let infoAula = '<td>' + reservas[index].aula.nombre +' '+ reservas[index].aula.numero+ '</td>';
            infoAula += '<td>' + parseInt(reservas[index].inicio/100) +":"+parseInt(reservas[index].inicio%100) +"-"+ parseInt(reservas[index].fin/100)+":"+parseInt(reservas[index].inicio%100)+ '</td>';
            infoAula += '<td>' + reservas[index].materia.nombre + '</td>';
            infoAula += '<td>' + reservas[index].docente.nombre + '</td>';
            let extrasAula = ''; 
            for (let ind in reservas[index].aula.extras) {
                extrasAula += beforeExtra + reservas[index].aula.extras[ind].extra + afterExtra;
            }
            container.innerHTML += beforeinfo + index + fincolapsar + infoAula + afterInfoAula + indice + finColapsedos + extrasAula + endFilabeforeId + aulas[index].id +endFilabeforeId2+aulas[index].id+ endFila;
            indice++;
        }
    }
    //las del segundo
    container.innerHTML += segundoCuatri;
    var reservasAnual;
    for (let index in reservas2Cuatri) {
        if(reservas2Cuatri[index].materia.periodo != "anual"){
            reservasAnual.push(reservas2Cuatri[index]);
        }else{
            let infoAula = '<td>' + reservas2Cuatri[index].aula.nombre +' '+ reservas2Cuatri[index].aula.numero+ '</td>';
            infoAula += '<td>' + parseInt(reservas2Cuatri[index].inicio/100) +":"+parseInt(reservas2Cuatri[index].inicio%100) +"-"+ parseInt(reservas2Cuatri[index].fin/100)+":"+parseInt(reservas2Cuatri[index].inicio%100)+ '</td>';
            infoAula += '<td>' + reservas2Cuatri[index].materia.nombre + '</td>';
            infoAula += '<td>' + reservas2Cuatri[index].docente.nombre + '</td>';
            let extrasAula = ''; 
            for (let ind in reservas2Cuatri[index].aula.extras) {
                extrasAula += beforeExtra + reservas2Cuatri[index].aula.extras[ind].extra + afterExtra;
            }
            container.innerHTML += beforeinfo + index + fincolapsar + infoAula + afterInfoAula + indice + finColapsedos + extrasAula + endFilabeforeId + aulas[index].id +endFilabeforeId2+aulas[index].id+ endFila;
            indice++;
        }
    }
    // las aunales
    container.innerHTML += anuales;
    var reservasAnual;
    for (let index in reservasAnual) {
        let infoAula = '<td>' + reservasAnual[index].aula.nombre +' '+ reservasAnual[index].aula.numero+ '</td>';
        infoAula += '<td>' + parseInt(reservasAnual[index].inicio/100) +":"+parseInt(reservasAnual[index].inicio%100) +"-"+ parseInt(reservasAnual[index].fin/100)+":"+parseInt(reservasAnual[index].inicio%100)+ '</td>';
        infoAula += '<td>' + reservasAnual[index].materia.nombre + '</td>';
        infoAula += '<td>' + reservasAnual[index].docente.nombre + '</td>';
        let extrasAula = ''; 
        for (let ind in reservasAnual[index].aula.extras) {
            extrasAula += beforeExtra + reservasAnual[index].aula.extras[ind].extra + afterExtra;
        }
        container.innerHTML += beforeinfo + index + fincolapsar + infoAula + afterInfoAula + indice + finColapsedos + extrasAula + endFilabeforeId + aulas[index].id +endFilabeforeId2+aulas[index].id+ endFila;
        indice++;
    }
    
}