var mapaUbicaciones = new Map();
getFiltros();
async function getFiltros() {
    let responseJSON = await fetch('http://localhost:3000/getFiltrosAulas')
        .then(function (response) { //Trae los filtros en el parametro "response" 
            return response.json(); //Retorno como JSON los datos de la API
        });
    cargarFiltros(responseJSON); // Con el awayt espero a que responda, despues llamo a cargarFiltros
}
function cargarFiltros(filtros) {
    let selector = document.getElementById('edif'); 
    //eliminamos las opciones anteriores
    selector.options.length = 0;
    //opcion para todas las aulas de todos los edificios
    let opcion = document.createElement('option'); 
    opcion.text = 'todos';
    selector.add(opcion);
    //añadimos los nombres de edificios
    for (i = 0; i < filtros.length; i++) {
        let opcion = document.createElement('option'); 
        let setUbicaciones = new Set();
        for (i = 0; i < filtros[i].aulas.length; i++) {
            setUbicaciones.add(filtros[i].aulas.ubicacion); //creamos un set de ubicaciones para el filtro ubicaciones
        }
        mapaUbicaciones.set(filtros[i].nombre, setUbicaciones); //un mapa con el set de anterior accediendo mediante el nombre del edificio
        opcion.text = filtros[i].nombre; 
        selector.add(opcion); 
    }
}
function cargarUbicacion() {
    let selector = document.getElementById('edif');
    let selectorUbicaciones = document.getElementById('ubic');
    let edifSelect = selector.options[selector.selectedIndex].text;//Get Texto seleccionado 
    //eliminamos las opciones anteriores
    selectorUbicaciones.options.length = 0;
    //opcion para todas las aulas de todos los edificios
    let opcion = document.createElement('option');
    opcion.text = 'todos'; 
    selectorUbicaciones.add(opcion);
    if (edifSelect == 'todos') {
        return;
    }
    //añadimos las ubicaciones de aulas en ese edificio
    let ubicaciones = mapaUbicaciones.get(facSelect); 
    ubicaciones.forEach((value) => {
        let opcion = document.createElement('option');
        opcion.text = value;
        selector.add(opcion);
    });
}
async function cargarTabla() {
    let edificio = document.getElementById('edif').options[selector.selectedIndex].text;
    let capacidad = document.getElementById('capac').text;
    let ubicacion = document.getElementById('edif').options[selector.selectedIndex].text;
    let extras = [];
    let responseJSON = await fetch('http://localhost:3000//listadoAulas/edificio/'+edificio+'/capacidad/'+capacidad+'/ubicacion/'+ubicacion+'/extras/'+extras)
        .then(function (response) { //Trae los filtros en el parametro "response" 
            return response.json(); //Retorno como JSON los datos de la API
        });
    cargarFiltros(responseJSON); // Con el awayt espero a que responda, despues llamo a cargarFiltros
}