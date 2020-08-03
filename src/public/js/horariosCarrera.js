getFiltros();//Llama al getFiltros, esto se ejecuta cada vez que horarios carrera ejecuta el script de esta hoja, OJO
var facultades = new Map(); //Mapa de facultades - lo lleno en cargarFiltros
anios = new Map(); //Mapa de Carreras - cantAños - lo lleno en cargarCarreras

//---------------------- TODO LO QUE EMPIECE CON GET  =  PETICIONES A API------------------------
async function getFiltros(){
    let responseJSON = await fetch('getDatosFiltros')
    .then(function(response) { //Trae los filtros en el parametro "response" 
        return response.json(); //Retorno como JSON los datos de la API
    });
    cargarFiltros(responseJSON); // Con el awayt espero a que responda, despues llamo a cargarFiltros
}
async function getHorariosByFiltros(){
    document.getElementById("ContenedorHorarios").innerHTML = "";
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
    let peticionGet = "horariosCarrera/facultad/"+facSelect+"/carrera/"+carrSelect+"/anio/"+anioSelect+"/periodo/"+cuatriSelect;

    if(facSelect && carrSelect && anioSelect && cuatriSelect){
        let responseJSON = await fetch(peticionGet)
        .then(function(response) { //Trae los filtros en el parametro "response" 
            return response.json(); //Retorno como JSON los datos de la API
        });
    
        if(responseJSON.length==0){
            alert("ATENCIÓN. No existen horarios con las caracteristicas señaladas.");
        }else{
            cargarMateriasFiltradas(responseJSON); // Con el awayt espero a que responda, despues llamo a cargarFiltros
        }
    }else{
        alert("ERROR. Seleccione correctamente los campos de busqueda.");
    }
    
    
}
function cargarFiltros(filtros){ 
    let selector = document.getElementById('fac'); //Obtengo el objeto del comboBox o "Selector" del front
    for(i=0;i<filtros.length;i++){ 
        facultades.set(filtros[i].nombre,filtros[i].carreras); //lleno el Mapa facultades GLOBAL
        let opcion = document.createElement('option'); //Creo el objeto opción 
        opcion.text = filtros[i].nombre; //Le setteo el valor del nombre de la carrera 
        selector.add(opcion); //Añado la opcion al selector de facultades
    }
}
function cargarMateriasFiltradas(materias){
    console.log(materias);
    for(i=0;i<materias.length;i++){
        console.log(materias.length); 
        crearBloqueMateria(materias[i].periodo,materias[i].nombre,materias[i].reservas); 
        console.log("salio for " + i +" "+ materias.length);
    }
} 
//Esta es la funcion llenar tabla, basicamente "averigue y pregunte, solamente se puede generar de esta forma el HTML"
//En los frameworks como ANGULAR Y REACT,ETC creo que hay alternativas pero bueno, estamos como estamos - igual anda joya
function crearBloqueMateria(periodo, nombre, listaAulas) {
    for(j=0;j<listaAulas.length;j++){
        let period = "";
        if (periodo == "anual") period = ' ('+periodo+')';
        codigoHTML = "<div class='panel panel-default bg3'>" ; //Cerrar este Div
        codigoHTML+="\n <div class='panel-heading bg3'>";// Encabezado con el nombre de la materia
        codigoHTML+="\n   <h2 class='titulo-materia'>"+ nombre+ period + "</h2>"; // Nombre Materia
        codigoHTML+="\n </div>";
        //Cuerpo con la tabla de horarios
        codigoHTML+= "\n <div class='panel-body'>";
        codigoHTML+= "\n<table class='table'>";
        codigoHTML+= "\n<thead>"; 
        codigoHTML+= "\n  <tr>";
        codigoHTML+= "\n    <th>Aula</th>";
        codigoHTML+= "\n    <th>Edificio</th>";
        codigoHTML+= "\n    <th>Día</th>";
        codigoHTML+= "\n    <th>Horario</th>";
        codigoHTML+= "\n  </tr>";
        codigoHTML+= "\n</thead>";
        codigoHTML+= "\n <tbody>"
        codigoHTML+= "\n<div class='collapse'></div>";
        console.log(listaAulas.length+"asd");
        console.log("Entra 2do for ");
        codigoHTML+="\n<tr>";
        codigoHTML+= "\n<td>"+listaAulas[j].aula.nombre+" - "+listaAulas[j].aula.numero+"</td>";
        codigoHTML+= "\n<td>"+listaAulas[j].aula.edificio.nombre+"</td>";
        codigoHTML += "\n<td>" + listaAulas[j].dia + "</td>";
        let horaIn = listaAulas[j].horaInicio;
        let horaFin = listaAulas[j].horaFin;
        codigoHTML += "\n<td>" + horaIn / 100 + ':' + horaIn % 100 + " - " + horaFin / 100 + ':' + horaFin % 100+"</td>";
        codigoHTML+= "\n</tr>";
        codigoHTML+= "              </tbody>";
        codigoHTML+= "\n        </table>";
        codigoHTML+= "\n    </div>";       
        codigoHTML+= "\n</div>";
    }
    
    document.getElementById("ContenedorHorarios").innerHTML += codigoHTML;
}
//-------------------------- METODOS LLAMADOS DESDE EL FRONT ------------------------------------
function cargarCarreras(){ 
    
    
    let selector = document.getElementById('fac');
    let selectorCarreras = document.getElementById('carr');
    let facSelect = selector.options[selector.selectedIndex].text;//Get Texto seleccionado
    let arrayCarreras = facultades.get(facSelect); //Arreglo de carreras by claveNombre
    if(arrayCarreras.length > 0){
        let boton = document.getElementById("lupa");
        boton.removeAttribute('disabled'); //habilito el boton para buscar
        // boton.setAttribute('disabled', "true");
        selectorCarreras.options.length = 0;
        document.getElementById('anio').options.length = 0;
        for(i=0;i<arrayCarreras.length;i++){
            anios.set(arrayCarreras[i].nombre,arrayCarreras[i].cantAnios); //lleno el Mapa anios GLOBAL
            let opcion = document.createElement('option'); //Creo el objeto opción 
            opcion.text = arrayCarreras[i].nombre; //Le setteo el valor del nombre de la carrera 
            selectorCarreras.add(opcion); //Añado la opcion al selector de carreras
        }
        cargarAnios();
    }else{
        alert("ATENCIÓN. No existen carreras en la facultad seleccionada.")
    }
    
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
}
//--------------------------------------------FIN METODOS LLAMADOS DESDE EL FRONT--------------------
//---------------------------------------------------------------------------------------------------
//-------------------------------METODOS EJEMPLOS, AUN NO SIRVEN ------------------------------------
function llenarTabla(filas,idTabla) {
    let tabla = document.getElementById(idTabla);
    

    //Eliminamos las filas:
    for (let index = tabla.rows.length-1; index > 0 ; index--) {
        tabla.deleteRow(index);        
    }

    //insertamos filas
    filas.forEach(fila => {
        fila = tabla.insertRow(-1);
        for (i = 0; i < fila.length; i++) {
            let celda = fila.insertCell(i);
            celda.appendChild(document.createTextNode(fila[i]));
        }
    });
}