
getFiltros();//Llama al getFiltros, esto se ejecuta cada vez que horarios carrera ejecuta el script de esta hoja, OJO
var facultades = new Map(); //Mapa de facultades - lo lleno en cargarFiltros
var anios = new Map(); //Mapa de Carreras - cantAños - lo lleno en cargarCarreras
var horarios = new Map();
var horarioSelected = new Map(); // mapa con la materia
//---------------------- TODO LO QUE EMPIECE CON GET  =  PETICIONES A API------------------------
async function getFiltros(){
    let responseJSON = await fetch('http://localhost:3000/getDatosFiltros')
    .then(function(response) { //Trae los filtros en el parametro "response" 
        return response.json(); //Retorno como JSON los datos de la API
    });
    cargarFiltros(responseJSON); // Con el awayt espero a que responda, despues llamo a cargarFiltros
}
function cargarFiltros(filtros){
    console.log(filtros);
    let selector = document.getElementById('fac'); //Obtengo el objeto del comboBox o "Selector" del front
    for(i=0;i<filtros.length;i++){ 
        facultades.set(filtros[i].nombre,filtros[i].carreras); //lleno el Mapa facultades GLOBAL
        let opcion = document.createElement('option'); //Creo el objeto opción 
        opcion.text = filtros[i].nombre; //Le setteo el valor del nombre de la carrera 
        selector.add(opcion); //Añado la opcion al selector de facultades
    }
}
function cargarCarreras(){ 
    // boton.setAttribute('disabled', "true");
    let selector = document.getElementById('fac');
    let selectorCarreras = document.getElementById('carr');
    let facSelect = selector.options[selector.selectedIndex].text;//Get Texto seleccionado
    let arrayCarreras = facultades.get(facSelect); //Arreglo de carreras by claveNombre
    selectorCarreras.options.length = 0;
    document.getElementById('anio').options.length = 0;
    for(i=0;i<arrayCarreras.length;i++){
        anios.set(arrayCarreras[i].nombre,arrayCarreras[i].cantAnios); //lleno el Mapa anios GLOBAL
        let opcion = document.createElement('option'); //Creo el objeto opción 
        opcion.text = arrayCarreras[i].nombre; //Le setteo el valor del nombre de la carrera 
        selectorCarreras.add(opcion); //Añado la opcion al selector de carreras
    }
    cargarAnios();
}

function cargarAnios(){
    let selector = document.getElementById('carr');
    let selectorAnio = document.getElementById('anio'); 
    let carrSelect = selector.options[selector.selectedIndex].text;//Get Texto seleccionado
    let cantAnios = anios.get(carrSelect); //Arreglo de carreras by claveNombre
    selectorAnio.options.length = 0;
    for(i=0;i<cantAnios;i++){
        let opcion = document.createElement('option'); //Creo el objeto opción 
        opcion.text = i+1; //Le setteo el valor del nombre de la carrera 
        selectorAnio.add(opcion); //Añado la opcion al selector fac
    }
    pedirMaterias();
}
async function pedirMaterias(){
    //get facultad
    let selector = document.getElementById('fac'); 
    let facSelect = selector.options[selector.selectedIndex].text;
    //get Carrera
    let selectorCarr = document.getElementById('carr'); 
    let carrSelect = selectorCarr.options[selectorCarr.selectedIndex].text;
    //get Anio
    let selectorAnio = document.getElementById('anio'); 
    let anioSelect = selectorAnio.options[selectorAnio.selectedIndex].text;
    //get Periodo
    let selectorCuatri = document.getElementById('cuatri'); 
    let cuatriSelect = selectorCuatri.options[selectorCuatri.selectedIndex].text; 
    let peticionGet = "http://localhost:3000/horariosCarrera/facultad/"+facSelect+"/carrera/"+carrSelect+"/anio/"+anioSelect+"/periodo/"+cuatriSelect;
    console.log(peticionGet);
    let responseJSON = await fetch(peticionGet)
    .then(function(response) { //Trae los filtros en el parametro "response" 
        return response.json(); //Retorno como JSON los datos de la API
    });
    cargarMateriasFiltradas(responseJSON); // Con el awayt espero a que responda, despues llamo a cargarFiltros
}
function cargarMateriasFiltradas(materia){ 
    let boton = document.getElementById("agregar");
    boton.removeAttribute('disabled'); //habilito el boton para buscar
    let selectorMateria = document.getElementById('materia'); 
    selectorMateria.options.length = 0;
    for(i=0;i<materia.length;i++){
        horarios.set(materia[i].nombre,materia[i]);
        let opcion = document.createElement('option'); //Creo el objeto opción 
        opcion.text = materia[i].nombre; //Le setteo el valor del nombre de la carrera 
        selectorMateria.add(opcion); //Añado la opcion al selector de carreras
    }
}
function agregarMateria(){
    //guardamos las materias
    let selector = document.getElementById('materia'); 
    let materiaSelect = selector.options[selector.selectedIndex].text; 
    materia = horarios.get(materiaSelect);
    if(!horarioSelected.has(materia.nombre)){
        horarioSelected.set(materia.nombre,materia);
        fila(materia);
        console.log(horarioSelected);
    }
}


function eliminarMateria(id,nombre){
    let div = document.getElementById(id);
    let form = document.getElementById('materiasForm');
    form.removeChild(div);
    horarioSelected.delete(nombre);
}
function fila(materia){
    let filaNueva = '<div class="entry" id = "'+materia.id+'">'+
                        '<label class="etiqueta" for="anio">Año: </label>'+
                        '<select class="form-control campo" id="anio" name="anios[]">'+
                        '<option>'+materia.anio+'</option>'+
                        '</select>'+

                        '<label class="etiqueta" for="carr">Materia: </label>'+
                        '<select class="form-control campo" name="materias[]">'+
                        '<option>'+materia.nombre+'</option>'+
                        '</select>'+

                        '<button class="btn btn-search" type="button" onclick="eliminarMateria('+materia.id+',\''+materia.nombre+'\')">'+
                            '<span class="glyphicon glyphicon-minus"></span>'+
                        '</button>'+
                    '</span>'+
                    '</div>';
    let form = document.getElementById('materiasForm');
    form.innerHTML += filaNueva;
}
// mas cortito
function limpiarCampos(){

}
//Esta es la funcion llenar tabla, basicamente "averigue y pregunte, solamente se puede generar de esta forma el HTML"
//En los frameworks como ANGULAR Y REACT,ETC creo que hay alternativas pero bueno, estamos como estamos - igual anda joya
function mostrarHorario() {
  //  if (periodo == "anual") period = ' ('+periodo+')';
  for (var [key, value] of horarioSelected) {
    alert(key + " = " + value);
  }
    let listaMaterias = horarioSelected.values();
    codigoHTML="";
    for (var [nombMat, value] of horarioSelected) {
        console.log(nombMat + " = " + value.reservas[0].aula);
        console.log("que onda");
        codigoHTML+= "<div class='panel panel-default bg3'>" ; //Cerrar este Div
        codigoHTML+="\n <div class='panel-heading bg3'>";// Encabezado con el nombre de la materia
        codigoHTML+="\n   <h2 class='titulo-materia'>"+ nombMat+ "</h2>"; // Nombre Materia
        codigoHTML+="\n </div>";
    // Cuerpo con la tabla de horarios
        codigoHTML+= "\n <div class='panel-body'>";
        codigoHTML+= "\n<table class='table'>";
        codigoHTML+= "\n<thead>"; 
        codigoHTML+= "\n  <tr>";
        codigoHTML+= "\n    <th>Aula</th>";
        codigoHTML+= "\n    <th>Día</th>";
        codigoHTML+= "\n    <th>Horario</th>";
        codigoHTML+= "\n  </tr>";
        codigoHTML+= "\n</thead>";
        codigoHTML+= "\n <tbody>"
        codigoHTML+= "\n<div class='collapse'></div>";  
    //Aca empezaba el for
        codigoHTML+="\n<tr>";
        codigoHTML+= "\n<td>"+value.reservas[0].aula.nombre+" - "+value.reservas[0].aula.numero+"</td>";
        codigoHTML += "\n<td>" + value.reservas[0].dia + "</td>";
        let horaIn = value.reservas[0].horaInicio;
        let horaFin = value.reservas[0].horaFin;
        codigoHTML += "\n<td>" + Math.floor( horaIn / 100 )+ ':' + horaIn % 100 + " - " + Math.floor( horaFin / 100 )+ ':' + horaFin % 100+"</td>";
        codigoHTML+= "\n</tr>";
        codigoHTML+= "              </tbody>";
        codigoHTML+= "\n        </table>";
        codigoHTML+= "\n    </div>";       
        codigoHTML+= "\n</div>";
    }
    document.getElementById("ContenedorHorarios").innerHTML = codigoHTML;
}

async function descargarHorario(){
    var horario = [];
    for (var [nombMat, value] of horarioSelected) { // nombremateria, materia 
        var objeto = {nombre: nombMat, horarios: []};
        value.reservas.forEach(reserva => {
            objeto.horarios.push({
                diaSemana: reserva.dia,
                horaInicio:Math.floor(reserva.horaInicio / 100)+":"+Math.floor(reserva.horaInicio % 100),
                horaFin: Math.floor(reserva.horaFin / 100)+":"+Math.floor(reserva.horaFin % 100)
            }) 
        });
        horario.push(objeto);
    }
    console.log(horario); // a hacer post
    let responseJSON = await fetch('/horarioPersonalizado/download', {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(horario), // data can be `string` or {object}!
        headers:{ // NO SE PA QUE SIRVE 
          'Content-Type': 'application/json;charset=utf-8' // NO SE PA QUE SIRVE pero sino no funca 
        }
      }).then(function(response) { 
            return response.text(); //Retorno como JSON los datos de la API
          
      }).catch(function(reason) {
        console.log(reason);
        setError(1);
     });
     downloadHorarios(responseJSON);
}

async function downloadHorarios(path){
    let responseJSON = await fetch('http://localhost:3000/horarioPersonalizado/download/path/'+path)
    .then(function(response) { //Trae los filtros en el parametro "response" 
        return response; //Retorno como JSON los datos de la API
    });
    alert("El archivo esta creado en la carpeta raiz del proyecto. con el conmbre: "+path);
}