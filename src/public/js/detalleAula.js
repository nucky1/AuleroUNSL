getDatos();
async function getDatos() {
    let id = localStorage.getItem("idAula");
    let responseJSON = await fetch('getDetalles/id/'+id)
        .then(function (response) { //Trae los filtros en el parametro "response" 
            return response.json(); //Retorno como JSON los datos de la API
        });
    cargarDatos(responseJSON); // Con el awayt espero a que responda, despues llamo a cargarFiltros
}
async function getComentarios(){
    let id = localStorage.getItem("idAula");
    let responseJSON = await fetch('allComentarios/id/'+id)
    .then(function (response) { //Trae los filtros en el parametro "response" 
        return response.json(); //Retorno como JSON los datos de la API
    });
    cargarComentarios(responseJSON); // Con el awayt espero a que responda, despues llamo a cargarFiltros
}

function cargarDatos(aula) {
    let nombre = document.getElementById('NombreAula');
    let edif = document.getElementById('nombreEdif');
    let capacidad = document.getElementById('capacidad');
    let ubicacion = document.getElementById('ubicacion');
    let listaExtras = document.getElementById('listaExtras');
    nombre.innerText = aula[0].nombre + ' ' + aula[0].numero;
    edif.innerText = aula[0].edificio.nombre;
    capacidad.innerText = aula[0].capacidad;
    ubicacion.innerText = aula[0].ubicacion;
    let beforeExtra = '<li><span class="glyphicon glyphicon-check icon-check"></span>';
    for (let index in aula[0].extras) {
        listaExtras.innerHTML += beforeExtra + aula[0].extras[index].extra + '</li>';
    }
    getHorarios();
}
async function getHorarios() {
    let id = localStorage.getItem("idAula");
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
    getComentarios();
}
function cargarComentarios(comentarios){
    console.log(comentarios);
    let comentarioContainer = document.getElementById("comentarioContainer");
    comentarioContainer.innerHTML = '<div class="row">'+
    '<div class="col-xs-6">'+
        '<h2 class="titulo">Comentarios</h2>'+
    '</div>'+
    '</div>';
    let comentario = '<div class="comentarios">'+
                        '<div class="row">'+
                            '<div class="col-xs-1">'+
                                '<div class="comment-info">';
    let afterFecha = '</div>'+
            '</div>'+

            '<div class="col-xs-2">'+
                '<div class="comment-info">';
    let afterDocente = '</div>'+
        '</div>'+
        '<div class="col-xs-8">'+
            '<textarea id="comentario" readonly="readonly" class="form-control">'
    let afterComentario = '</textarea>'+
                            '</div>'+
                        '</div>'+
                    '</div>';
    if(comentarios.length == 0){
        comentarioContainer.innerHTML += "<h4>No hay comentarios de esta aula hasta el momento.</h4>"
    }else{
        comentarios.forEach(element => {
            let d = new Date(element.createdAt);
            let fecha;
            if(d.getHours() == 0){
                fecha = d.getDate() +"/"+ d.getMonth() +"/"+ d.getFullYear()  +" 00:"+ d.getMinutes(); 
            }else{
                fecha = d.getDate() +"/"+ d.getMonth() +"/"+ d.getFullYear()  +" "+ d.getHours()  +":"+ d.getMinutes(); 
            }
            comentarioContainer.innerHTML += comentario + fecha + afterFecha + element.docentes[0].nombre + " "+
            element.docentes[0].apellido + afterDocente + element.texto + afterComentario;
            console.log(comentario + fecha + afterFecha + element.docentes[0].nombre + " "+
            element.docentes[0].apellido + afterDocente + element.texto + afterComentario)
        });
    }
}