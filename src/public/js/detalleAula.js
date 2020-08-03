getDatos();
var id;
async function getDatos() {
    let responseJSON = await fetch('primeraVezDetallesAula')
        .then(function (response) { //Trae los filtros en el parametro "response" 
            return response.json(); //Retorno como JSON los datos de la API
        });
    cargarDatos(responseJSON); // Con el awayt espero a que responda, despues llamo a cargarFiltros
}
async function getComentarios(){
    let responseJSON = await fetch('allComentarios/id/:id')
    .then(function (response) { //Trae los filtros en el parametro "response" 
        return response.json(); //Retorno como JSON los datos de la API
    });
    cargarComentarios(responseJSON); // Con el awayt espero a que responda, despues llamo a cargarFiltros
}
function cargarComentarios(comentarios){
    //funcion de carga
    console.log(comentarios);
}

function cargarDatos(aula) {
    let nombre = document.getElementById('NombreAula');
    let edif = document.getElementById('nombreEdif');
    let capacidad = document.getElementById('capacidad');
    let ubicacion = document.getElementById('ubicacion');
    let listaExtras = document.getElementById('listaExtras');
    id = aula[0].id;
    nombre.innerText = aula[0].nombre + ' ' + aula[0].numero;
    edif.innerText = aula[0].edificio.nombre;
    capacidad.innerText = aula[0].capacidad;
    ubicacion.innerText = aula[0].ubicacion;
    let beforeExtra = '<li><span class="glyphicon glyphicon-check icon-check"></span>';
    for (let index in aula[0].extras) {
        listaExtras.innerHTML += beforeExtra + aula[0].extras[index].extra + '</li>';
    }
    getComentarios();
}
async function getHorarios() {
    let select = document.getElementById('periodo');
    let periodo = select.options[select.selectedIndex].text;
    if (periodo.includes('1er')) {
        periodo = 'primer cuatrimestre';
    } else {
        periodo = 'segundo cuatrimestre';
    }
    let responseJSON = await fetch('getHorariosReserva/id/'+id+'/periodo/'+periodo)
        .then(function (response) { //Trae los filtros en el parametro "response" 
            return response.json(); //Retorno como JSON los datos de la API
        });
    llenarTabla(responseJSON); // Con el awayt espero a que responda, despues llamo a cargarFiltros
}



function llenarTabla(aula) {
    let tabla = document.getElementById('tablaHorarios');
    let thead = ['horario','lunes', 'martes', 'miercoles', 'jueves', 'viernes'];

    //Eliminamos las filas:
    for (let index = tabla.rows.length-1; index > 0 ; index--) {
        tabla.deleteRow(index);        
    }
    //creamos un mapa con las reservas (clave dia, valores materias que reservan con su respectiva hora inicio y fin)
    let mapaReserva = new Map();
    aula[0].reservas.forEach(index => {
        if (mapaReserva.has(index.dia)) {
            let value = {
                inicio: index.horaInicio,
                fin: index.horaFin,
                materia: index.materia[0].nombre
            }
            let valores = mapaReserva.get(index.dia);
            valores.push(value);
            mapaReserva.set(index.dia, valores);
        } else {
            let value = {
                inicio: index.horaInicio,
                fin: index.horaFin,
                materia: index.materia[0].nombre
            }
            mapaReserva.set(index.dia, [value]);
        }
    });
    const horarios = ["8:00",'8:30','9:00','9:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30'];
    

    for (let indexFila = 0; indexFila < horarios.length; indexFila++) {
        fila = tabla.insertRow(-1);
        let celda = fila.insertCell(0);
        var temp = horarios[indexFila];
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