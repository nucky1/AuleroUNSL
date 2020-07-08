
getFiltros();//Llama al getFiltros, esto se ejecuta cada vez que horarios carrera ejecuta el script de esta hoja, OJO
var facultades = new Map(); //Mapa de facultades - lo lleno en cargarFiltros
var anios = new Map(); //Mapa de Carreras - cantAños - lo lleno en cargarCarreras
var horarios = new Map();
var horarioSelected = newMap();
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
function guardarHorario(){
    //guardamos las materias
    let selector = document.getElementById('materia'); 
    let materiaSelect = selector.options[selector.selectedIndex].text; 
    materia = horarios.get(materiaSelect);
    horarioSelected.set(materia.nombre,materia);

}
function limpiarCampos(){

}
// mas cortito
function llenarTabla(materias) {
    let container = document.getElementById('contenedorTabla');
    container.style.opacity = 1;
    let tabla = document.getElementById('tablaHorarios');
    let thead = ['horario','lunes', 'martes', 'miercoles', 'jueves', 'viernes'];

    //Eliminamos las filas:
    for (let index = tabla.rows.length-1; index > 0 ; index--) {
        tabla.deleteRow(index);        
    }
    //creamos un mapa con las reservas (clave dia, valores materias que reservan con su respectiva hora inicio y fin)
    let mapaReserva = new Map();
    materias.forEach(materia =>{
        let nombre = materia.nobre; 
        materia.reservas.forEach(index => {
            if (mapaReserva.has(index.dia)) {
                let value = {
                    inicio: index.horaInicio,
                    fin: index.horaFin,
                    materia: nombre,
                    aula : index.aula.nombre + " "+ index.aula.numero
                }
                let valores = mapaReserva.get(index.dia);
                valores.push(value);
                mapaReserva.set(index.dia, valores);
            } else {
                let value = {
                    inicio: index.horaInicio,
                    fin: index.horaFin,
                    materia: nombre,
                    aula : index.aula.nombre + " "+ index.aula.numero
                }
                mapaReserva.set(index.dia, [value]);
            }
        })
    });
    const horariosConst = ["8:00",'8:30','9:00','9:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30'];
    

    for (let indexFila = 0; indexFila < horariosConst.length; indexFila++) {
        fila = tabla.insertRow(-1);
        let celda = fila.insertCell(0);
        var temp = horariosConst[indexFila];
        celda.appendChild(document.createTextNode(temp));
        const horaSplit = temp.split(':');
        var hora = parseInt(horaSplit[0]+horaSplit[1]);

        for (let columna = 1; columna < thead.length; columna++) {
                    
            celda = fila.insertCell(columna);
            if (mapaReserva.has(thead[columna])) {
                valores = mapaReserva.get(thead[columna].toLowerCase());
                for (let i = 0; i < valores.length; i++) {
                    if (valores[i].inicio <= hora && valores[i].fin >= hora) {
                        celda.appendChild(document.createTextNode(valores[i].materia));
                    } else {
                        celda.appendChild(document.createTextNode('-'));
                    }                    
                }
            } else {
                celda.appendChild(document.createTextNode('-'));
            }
            
        }
    }


}