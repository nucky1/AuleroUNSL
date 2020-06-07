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
    let limit = filtros.length;
    //añadimos los nombres de edificios
    for (let index in filtros) {
        let opcion = document.createElement('option'); 
        let setUbi = new Set();
        for (let ind in filtros[index].aulas) {
            setUbi.add(filtros[index].aulas[ind].ubicacion);
        }
        mapaUbicaciones.set(filtros[index].nombre, setUbi); //un mapa con el set de anterior accediendo mediante el nombre del edificio
        opcion.text = filtros[index].nombre; 
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
    let ubicaciones = mapaUbicaciones.get(edifSelect); 
    console.log(ubicaciones);
    ubicaciones.forEach((value) => {
        console.log(value);
        let opcion = document.createElement('option');
        opcion.text = value;
        selectorUbicaciones.add(opcion);
    });
}
async function getAulas() {
    let selector = document.getElementById('edif');
    let edificio = selector.options[selector.selectedIndex].text;
    let capacidad = document.getElementById('capac').text;
    selector = document.getElementById('ubic');
    let ubicacion = selector.options[selector.selectedIndex].text;
    let extras = 'all';
    let responseJSON = await fetch('http://localhost:3000//listadoAulas/edificio/'+edificio+'/capacidad/'+capacidad+'/ubicacion/'+ubicacion+'/extras/'+extras)
        .then(function (response) { //Trae los filtros en el parametro "response" 
            return response.json(); //Retorno como JSON los datos de la API
        });
    cargarTabla(responseJSON); // Con el awayt espero a que responda, despues llamo a cargarFiltros
}
function cargarTabla(aulas) {
    let tabla = document.getElementById('tbody');
    let beforeInfoAula = '<div class="acordion-heading">< tr class="accordion-toggle" data - toggle="collapse" href = "#collapseOne" >';
    let afterInfoAula = '</tr></div ><tr><td colspan="4" style="padding: 0; border-top-style: none;"><div id="collapseOne" class="collapse"><div class="expansible"><ul class="list-inline">';
}