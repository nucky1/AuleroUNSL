getFiltros();//Llama al getFiltros, esto se ejecuta cada vez que horarios carrera ejecuta el script de esta hoja, OJO

var facultades = new Map(); //Mapa de facultades - lo lleno en cargarFiltros
anios = new Map(); //Mapa de Carreras - cantAños - lo lleno en cargarCarreras

//---------------------- TODO LO QUE EMPIECE CON GET  =  PETICIONES A API------------------------
async function getFiltros(){
    let responseJSON = await fetch('http://localhost:3000/getDatosFiltros')
    .then(function(response) { //Trae los filtros en el parametro "response" 
        return response.json(); //Retorno como JSON los datos de la API
    });
    cargarFiltros(responseJSON); // Con el awayt espero a que responda, despues llamo a cargarFiltros
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
//-------------------------- METODOS LLAMADOS DESDE EL FRONT ------------------------------------
function cargarCarreras(){ 
    let selector = document.getElementById('fac');
    let selectorCarreras = document.getElementById('carr');
    let facSelect = selector.options[selector.selectedIndex].text;//Get Texto seleccionado
    let arrayCarreras = facultades.get(facSelect); //Arreglo de carreras by claveNombre
    selectorCarreras.options.length = 0;
    for(i=0;i<arrayCarreras.length;i++){
        anios.set(arrayCarreras[i].nombre,arrayCarreras[i].cantAnios); //lleno el Mapa anios GLOBAL
        let opcion = document.createElement('option'); //Creo el objeto opción 
        opcion.text = arrayCarreras[i].nombre; //Le setteo el valor del nombre de la carrera 
        selectorCarreras.add(opcion); //Añado la opcion al selector de carreras
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


//-------------------------------METODOS EJEMPLOS, AUN NO SIRVEN ------------------------------------
function getHorarios(){
    fetch('http://localhost:3000/horariosCarrera/facultad/FCFNyM/carrera/IngeWeb/anio/2020/periodo/1ro')
    .then(function(response) {
        return response.json();
    })
    .then(function(myJson) {
        console.log(myJson);
    }); //HACE PETICION ASYNC A API
}


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
