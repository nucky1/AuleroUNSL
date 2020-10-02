//-----------VARIABLES GLOBALES

var funcion; //SIRVE PARA SABER SOBRE QUE TABLA SE TRABAJA, ASI COMO QUE TIPO DE POPUP DESPLEGAR
var pag = 0; //paginacion de tabla
var limit = 10;//cantidad de filas por tabla
var id; //guarda el id para eliminar/modificar 
//----------SUPER CHECKBOX
function atr(){
	// Activate tooltip
	$('[data-toggle="tooltip"]').tooltip();
	
	// Select/Deselect checkboxes
	var checkbox = $('table tbody input[type="checkbox"]');
	$("#selectAll").click(function(){
		if(this.checked){
			checkbox.each(function(){
				this.checked = true;                        
			});
		} else{
			checkbox.each(function(){
				this.checked = false;                        
			});
		} 
	});
	checkbox.click(function(){
		if(!this.checked){
			$("#selectAll").prop("checked", false);
		}
	});
}
//----------LINK GET A BD
function getPagina(pagina){
    pag = pagina;
    switch(funcion){
        case "admin":{
            getDatosAdmin(false);
            break;
        };
        case "Docente":{
            getDatosDocente(false);
            break;
        };
        case "Facultad":{
            getDatosAdmin(false);
            break;
        };
        case "Carrera":{
            getDatosCarrera(false);
            break;
        };
        case "Materia":{
            getDatosMateria(false);
            break;
        };
    }
} 
function getSigPagina(){
    pag++;
    switch(funcion){
        case "admin":{
            getDatosAdmin(false);
            break;
        };
        case "Docente":{
            getDatosDocente(false);
            break;
        };
        case "Facultad":{
            getDatosAdmin(false);
            break;
        };
        case "Carrera":{
            getDatosCarrera(false);
            break;
        };
        case "Materia":{
            getDatosMateria(false);
            break;
        };
    }
}
function getAntPage(){
    pag--;
    switch(funcion){
        case "admin":{
            getDatosAdmin(false);
            break;
        };
        case "Docente":{
            getDatosDocente(false);
            break;
        };
        case "Facultad":{
            getDatosAdmin(false);
            break;
        };
        case "Carrera":{
            getDatosCarrera(false);
            break;
        };
        case "Materia":{
            getDatosMateria(false);
            break;
        };
    }
}

//---- FUNCIONES FETCH PARA DATOS DE TABLA
async function getDatosAdmin(flag){
    if(flag){
        pag = 0;
    }
    funcion = "admin";
    let responseJSON = await fetch('getDatosAdmin/limit/'+limit+'/pag/'+pag)
        .then(function (response) { //Trae los filtros en el parametro "response" 
            return response.json(); //Retorno como JSON los datos de la API
        });
    cargarTablaAdmin(responseJSON); // Con el awayt espero a que responda, despues llamo a cargarFiltros
}

async function getDatosDocente(flag){
    if(flag){
        pag = 0;
    }
    funcion = "Docente";
    let responseJSON = await fetch('getDatosDocente/limit/'+limit+'/pag/'+pag)
        .then(function (response) { //Trae los filtros en el parametro "response" 
            return response.json(); //Retorno como JSON los datos de la API
        });
    cargarTablaDocente(responseJSON); // Con el awayt espero a que responda, despues llamo a cargarFiltros
}
async function getDatosEdificio(){
    if(flag){
        pag = 0;
    }
    funcion = "Docente";
    let responseJSON = await fetch('getDatosDocente/limit/'+limit+'/pag/'+pag)
        .then(function (response) { //Trae los filtros en el parametro "response" 
            return response.json(); //Retorno como JSON los datos de la API
        });
    cargarTablaEdificio(responseJSON); // Con el awayt espero a que responda, despues llamo a cargarFiltros
}
async function getDatosAula(){
    if(flag){
        pag = 0;
    }
    funcion = "Docente";
    let responseJSON = await fetch('getDatosDocente/limit/'+limit+'/pag/'+pag)
        .then(function (response) { //Trae los filtros en el parametro "response" 
            return response.json(); //Retorno como JSON los datos de la API
        });
    cargarTablaAula(responseJSON); // Con el awayt espero a que responda, despues llamo a cargarFiltros
}
async function getDatosFacultad(flag){
    if(flag){
        pag = 0;
    }
    funcion = "Facultad";
    let responseJSON = await fetch('getDatosFacultad/limit/'+limit+'/pag/'+pag)
        .then(function (response) { //Trae los filtros en el parametro "response" 
            return response.json(); //Retorno como JSON los datos de la API
        });
    cargarTablaFacultad(responseJSON); // Con el awayt espero a que responda, despues llamo a cargarFiltros
}
async function getDatosCarrera(){
    if(flag){
        pag = 0;
    }
    funcion = "Carrera";
    let responseJSON = await fetch('getDatosCarrera/limit/'+limit+'/pag/'+pag)
        .then(function (response) { //Trae los filtros en el parametro "response" 
            return response.json(); //Retorno como JSON los datos de la API
        });
    cargarTablaCarrera(responseJSON); // Con el awayt espero a que responda, despues llamo a cargarFiltros
}
async function getDatosMateria(flag){
    if(flag){
        pag = 0;
    }
    funcion = "Materia";
    let responseJSON = await fetch('getDatosMateria/limit/'+limit+'/pag/'+pag)
        .then(function (response) { //Trae los filtros en el parametro "response" 
            return response.json(); //Retorno como JSON los datos de la API
        });
    cargarTablaMateria(responseJSON); // Con el awayt espero a que responda, despues llamo a cargarFiltros
}

//--------- CARGA DE TABLAS

function cargarTablaAdmin(administradores){
    let tabla = document.getElementById("table");
    tabla.setAttribute("styñe","opacity: 0;")
    //----PEDIMOS LOS OBJETOS DEL HTML QUE SON DINAMICOS----//
    let nombreTabla = document.getElementById("nombreTabla");
    nombreTabla.innerHTML = "Administradores"; //--NOMBRE DE LA TABLA
    let tableHeader = document.getElementById("thead");
    let tableBody = document.getElementById("tbody");
    let paginacion = document.getElementById("paginacion");
    paginacion.setAttribute("styñe","opacity: 0;");
//----COLOCAMOS LOS TITULOS EN COLUMNAS DE LA TABLA---//
    tableHeader.innerHTML = '<tr>'+
                                '<th>'+
                                    '<span class="custom-checkbox">'+
                                        '<input type="checkbox" id="selectAll">'+
                                        '<label for="selectAll"></label>'+
                                    '</span>'+
                                '</th>'+
                                '<th>usuario</th>'+
                                '<th>Nombre</th>'+
                                '<th>dni</th>'+
                                '<th>legajo</th>'+
                                '<th>Acciones</th>'+
                            '</tr>';
//---- SI NO HAY NADA AVISAMOS CON UN CARTEL ---//
    if(administradores.count == 0){
        showError("No hay administradores cargados");
        tableBody.innerHTML = "";
        return;
    }
//---- CARGAMOS LAS FILAS DE LA TABLA ---//
    let filas = "";
    for (let index in administradores.rows) {
        filas += '<tr>'+
            '<td>'+
                '<span class="custom-checkbox">'+
                    '<input type="checkbox" id="checkbox'+index+'" name="options[]" value="'+administradores.rows[index].administrador.id+'">'+
                    '<label for="checkbox1"></label>'+
                '</span>'+
            '</td>'+
            '<td>'+administradores.rows[index].username+'</td>'+
            '<td>'+administradores.rows[index].administrador.nombre+" "+administradores.rows[index].administrador.apellido+'</td>'+
            '<td>'+administradores.rows[index].administrador.dni+'</td>'+
            '<td>'+administradores.rows[index].administrador.legajo+'</td>'+
            '<td>'+
                '<a href="javascript:openPopUp('+administradores.rows[index].administrador.id+')" class="edit" data-target ="#createOrUpdate"  data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>'+
                '<a href="javascript:openPopUp('+administradores.rows[index].administrador.id+')" class="delete" data-target ="#eliminar" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>'+
            '</td>'+
        '</tr>';
    }
    tableBody.innerHTML = filas;
//---- COLOCAMOS LA CANTIDAD DE PAGINAS---//
    let pagination = '<div class="hint-text">Showing <b>'+limit+'</b> out of <b>'+administradores.count+'</b> entries</div>'+
                                '<ul class="pagination">';
    if(pag == 0){
        pagination += '<li class="page-item disabled" id="anterior"><a href="javascript:getAntPage()">Anterior</a></li>';
    }else{
        pagination += '<li class="page-item" id="anterior"><a href="javascript:getAntPage()">Anterior</a></li>';
    }
    for(let i = 1 ; i <=  Math.ceil(administradores.count/limit); i++ ){
        if(i == pag+1){
            pagination += '<li class="page-item active"><a href="javascript:getPagina('+(i-1)+')" class="page-link">'+i+'</a></li>';
        }else{
            pagination += '<li class="page-item"><a href="javascript:getPagina('+(i-1)+')" class="page-link">'+i+'</a></li>';
        }
                   
                
    }
    console.log(Math.ceil(administradores.count/limit));
    console.log(pag+1);
    if(pag+1 >= Math.ceil(administradores.count/limit)){
        pagination += '<li class="page-item disabled" id="siguiente"><a href="javascript:getSigPagina()" class="page-link">Siguiente</a></li>';
    }else{
        pagination += '<li class="page-item" id="siguiente"><a href="javascript:getSigPagina()" class="page-link">Siguiente</a></li>';
    }
    pagination += "</ul>";
    paginacion.innerHTML = pagination;
    atr();
}

function cargarTablaDocente(docentes){
    let tabla = document.getElementById("table");
    tabla.setAttribute("styñe","opacity: 0;")
    //----PEDIMOS LOS OBJETOS DEL HTML QUE SON DINAMICOS----//
    let nombreTabla = document.getElementById("nombreTabla");
    nombreTabla.innerHTML = "Docentes"; //--NOMBRE DE LA TABLA
    let tableHeader = document.getElementById("thead");
    let tableBody = document.getElementById("tbody");
    let paginacion = document.getElementById("paginacion");
    paginacion.setAttribute("styñe","opacity: 0;");
//----COLOCAMOS LOS TITULOS EN COLUMNAS DE LA TABLA---//
    tableHeader.innerHTML = '<tr>'+
                                '<th>'+
                                    '<span class="custom-checkbox">'+
                                        '<input type="checkbox" id="selectAll">'+
                                        '<label for="selectAll"></label>'+
                                    '</span>'+
                                '</th>'+
                                '<th>usuario</th>'+
                                '<th>Nombre</th>'+
                                '<th>dni</th>'+
                                '<th>legajo</th>'+
                                '<th>Acciones</th>'+
                            '</tr>';
//---- SI NO HAY NADA AVISAMOS CON UN CARTEL ---//
    if(docentes.count == 0){
        showError("No hay docentes cargados");
        tableBody.innerHTML = "";
        return;
    }
//---- CARGAMOS LAS FILAS DE LA TABLA ---//
    let filas = "";
    for (let index in docentes.rows) {
        filas += '<tr>'+
            '<td>'+
                '<span class="custom-checkbox">'+
                    '<input type="checkbox" id="checkbox'+index+'" name="options[]" value="'+docentes.rows[index].docente.id+'">'+
                    '<label for="checkbox1"></label>'+
                '</span>'+
            '</td>'+
            '<td>'+docentes.rows[index].username+'</td>'+
            '<td>'+docentes.rows[index].docente.nombre+" "+docentes.rows[index].docente.apellido+'</td>'+
            '<td>'+docentes.rows[index].docente.dni+'</td>'+
            '<td>'+docentes.rows[index].docente.legajo+'</td>'+
            '<td>'+
                '<a href="javascript:openPopUp('+docentes.rows[index].docente.id+')" class="edit" data-target ="#createOrUpdate"  data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>'+
                '<a href="javascript:openPopUp('+docentes.rows[index].docente.id+')" class="delete" data-target ="#eliminar" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>'+
            '</td>'+
        '</tr>';
    }
    tableBody.innerHTML = filas;
//---- COLOCAMOS LA CANTIDAD DE PAGINAS ---//
    let pagination = '<div class="hint-text">Showing <b>'+limit+'</b> out of <b>'+docentes.count+'</b> entries</div>'+
                                '<ul class="pagination">';
    if(pag == 0){
        pagination += '<li class="page-item disabled" id="anterior"><a href="javascript:getAntPage()">Anterior</a></li>';
    }else{
        pagination += '<li class="page-item" id="anterior"><a href="javascript:getAntPage()">Anterior</a></li>';
    }
    for(let i = 1 ; i <=  Math.ceil(docentes.count/limit); i++ ){
        if(i == pag+1){
            pagination += '<li class="page-item active"><a href="javascript:getPagina('+(i-1)+')" class="page-link">'+i+'</a></li>';
        }else{
            pagination += '<li class="page-item"><a href="javascript:getPagina('+(i-1)+')" class="page-link">'+i+'</a></li>';
        }
                   
                
    }
    if(pag+1 == Math.ceil(docentes.count/limit)){
        pagination += '<li class="page-item disabled" id="siguiente"><a href="javascript:getSigPagina()" class="page-link">Siguiente</a></li>';
    }else{
        pagination += '<li class="page-item" id="siguiente"><a href="javascript:getSigPagina()" class="page-link">Siguiente</a></li>';
    }
    pagination += "</ul>";
    paginacion.innerHTML = pagination;
    atr();
}
function cargarTablaAula(aulas){
        let tabla = document.getElementById("table");
        tabla.setAttribute("styñe","opacity: 0;") 
    //----PEDIMOS LOS OBJETOS DEL HTML QUE SON DINAMICOS----//
     let nombreTabla = document.getElementById("nombreTabla");
     nombreTabla.innerHTML = "Aulas"; //--NOMBRE DE LA TABLA
     let tableHeader = document.getElementById("thead");
     let tableBody = document.getElementById("tbody");
     let paginacion = document.getElementById("paginacion");
    paginacion.setAttribute("styñe","opacity: 0;");
 //----COLOCAMOS LOS TITULOS EN COLUMNAS DE LA TABLA---//
     tableHeader.innerHTML = '<tr>'+
                                 '<th>'+
                                     '<span class="custom-checkbox">'+
                                         '<input type="checkbox" id="selectAll">'+
                                         '<label for="selectAll"></label>'+
                                     '</span>'+
                                 '</th>'+
                                 '<th>Nombre</th>'+
                                 '<th>Edificio</th>'+
                                 '<th>Capacidad</th>'+
                                 '<th>Ubicación</th>'+
                             '</tr>';
 //---- SI NO HAY NADA AVISAMOS CON UN CARTEL ---//
     if(aulas.count == 0){
         showError("No hay aulas cargados");
         tableBody.innerHTML = "";
         return;
     }
 //---- CARGAMOS LAS FILAS DE LA TABLA ---//
     let filas = "";
     for (let index in aulas.rows) {
         filas += '<tr>'+
             '<td>'+
                 '<span class="custom-checkbox">'+
                     '<input type="checkbox" id="checkbox'+index+'" name="options[]" value="'+aulas.rows[index].docente.id+'">'+
                     '<label for="checkbox1"></label>'+
                 '</span>'+
             '</td>'+
             '<td>'+aulas.rows[index].nombre+" "+aulas.rows[index].numero+'</td>'+
             '<td>'+aulas.rows[index].edificio.nombre+'</td>'+
             '<td>'+aulas.rows[index].capacidad+'</td>'+
             '<td>'+aulas.rows[index].ubicacion+'</td>'+
             '<td>'+
                 '<a href="javascript:openPopUp('+aulas.rows[index].id+')" class="edit" data-target ="#createOrUpdate"  data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>'+
                 '<a href="javascript:openPopUp('+aulas.rows[index].id+')" class="delete" data-target ="#eliminar" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>'+
             '</td>'+
         '</tr>';
     }
     tableBody.innerHTML = filas;
 //---- COLOCAMOS LA CANTIDAD DE PAGINAS ---//
     let pagination = '<div class="hint-text">Showing <b>'+limit+'</b> out of <b>'+aulas.count+'</b> entries</div>'+
                                 '<ul class="pagination">';
     if(pag == 0){
         pagination += '<li class="page-item disabled" id="anterior"><a href="javascript:getAntPage()">Anterior</a></li>';
     }else{
         pagination += '<li class="page-item" id="anterior"><a href="javascript:getAntPage()">Anterior</a></li>';
     }
     for(let i = 1 ; i <=  Math.ceil(aulas.count/limit); i++ ){
         if(i == pag+1){
             pagination += '<li class="page-item active"><a href="javascript:getPagina('+(i-1)+')" class="page-link">'+i+'</a></li>';
         }else{
             pagination += '<li class="page-item"><a href="javascript:getPagina('+(i-1)+')" class="page-link">'+i+'</a></li>';
         }
                    
                 
     }
     if(pag+1 == Math.ceil(aulas.count/limit)){
         pagination += '<li class="page-item disabled" id="siguiente"><a href="javascript:getSigPagina()" class="page-link">Siguiente</a></li>';
     }else{
         pagination += '<li class="page-item" id="siguiente"><a href="javascript:getSigPagina()" class="page-link">Siguiente</a></li>';
     }
     pagination += "</ul>";
     paginacion.innerHTML = pagination;
     atr();
}
function cargarTablaEdificio(edificios){
        let tabla = document.getElementById("table");
        tabla.setAttribute("styñe","opacity: 0;")
    //----PEDIMOS LOS OBJETOS DEL HTML QUE SON DINAMICOS----//
    let nombreTabla = document.getElementById("nombreTabla");
    nombreTabla.innerHTML = "Edificio"; //--NOMBRE DE LA TABLA
    let tableHeader = document.getElementById("thead");
    let tableBody = document.getElementById("tbody");
    let paginacion = document.getElementById("paginacion");
    paginacion.setAttribute("styñe","opacity: 0;");
//----COLOCAMOS LOS TITULOS EN COLUMNAS DE LA TABLA---//
    tableHeader.innerHTML = '<tr>'+
                                '<th>'+
                                    '<span class="custom-checkbox">'+
                                        '<input type="checkbox" id="selectAll">'+
                                        '<label for="selectAll"></label>'+
                                    '</span>'+
                                '</th>'+
                                '<th>Nombre</th>'+
                                '<th>Dirección</th>'+
                            '</tr>';
//---- SI NO HAY NADA AVISAMOS CON UN CARTEL ---//
    if(edificios.count == 0){
        showError("No hay edificios cargados");
        tableBody.innerHTML = "";
        return;
    }
//---- CARGAMOS LAS FILAS DE LA TABLA ---//
    let filas = "";
    for (let index in edificios.rows) {
        filas += '<tr>'+
            '<td>'+
                '<span class="custom-checkbox">'+
                    '<input type="checkbox" id="checkbox'+index+'" name="options[]" value="'+edificios.rows[index].docente.id+'">'+
                    '<label for="checkbox1"></label>'+
                '</span>'+
            '</td>'+
            '<td>'+edificios.rows[index].nombre+'</td>'+
            '<td>'+edificios.rows[index].direccion+'</td>'+
            '<td>'+
                '<a href="javascript:openPopUp('+edificios.rows[index].id+')" class="edit" data-target ="#createOrUpdate"  data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>'+
                '<a href="javascript:openPopUp('+edificios.rows[index].id+')" class="delete" data-target ="#eliminar" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>'+
            '</td>'+
        '</tr>';
    }
    tableBody.innerHTML = filas;
//---- COLOCAMOS LA CANTIDAD DE PAGINAS ---//
    let pagination = '<div class="hint-text">Showing <b>'+limit+'</b> out of <b>'+edificios.count+'</b> entries</div>'+
                                '<ul class="pagination">';
    if(pag == 0){
        pagination += '<li class="page-item disabled" id="anterior"><a href="javascript:getAntPage()">Anterior</a></li>';
    }else{
        pagination += '<li class="page-item" id="anterior"><a href="javascript:getAntPage()">Anterior</a></li>';
    }
    for(let i = 1 ; i <=  Math.ceil(edificios.count/limit); i++ ){
        if(i == pag+1){
            pagination += '<li class="page-item active"><a href="javascript:getPagina('+(i-1)+')" class="page-link">'+i+'</a></li>';
        }else{
            pagination += '<li class="page-item"><a href="javascript:getPagina('+(i-1)+')" class="page-link">'+i+'</a></li>';
        }
                   
                
    }
    if(pag+1 == Math.ceil(edificios.count/limit)){
        pagination += '<li class="page-item disabled" id="siguiente"><a href="javascript:getSigPagina()" class="page-link">Siguiente</a></li>';
    }else{
        pagination += '<li class="page-item" id="siguiente"><a href="javascript:getSigPagina()" class="page-link">Siguiente</a></li>';
    }
    pagination += "</ul>";
    paginacion.innerHTML = pagination;
    atr();
}
function cargarTablaFacultad(facultades){
    let tabla = document.getElementById("table");
    tabla.setAttribute("styñe","opacity: 0;")
    //----PEDIMOS LOS OBJETOS DEL HTML QUE SON DINAMICOS----//
    let nombreTabla = document.getElementById("nombreTabla");
    nombreTabla.innerHTML = "Facultades"; //--NOMBRE DE LA TABLA
    let tableHeader = document.getElementById("thead");
    let tableBody = document.getElementById("tbody");
    let paginacion = document.getElementById("paginacion");
    paginacion.setAttribute("styñe","opacity: 0;");
//----COLOCAMOS LOS TITULOS EN COLUMNAS DE LA TABLA---//
    tableHeader.innerHTML = '<tr>'+
                                '<th>'+
                                    '<span class="custom-checkbox">'+
                                        '<input type="checkbox" id="selectAll">'+
                                        '<label for="selectAll"></label>'+
                                    '</span>'+
                                '</th>'+
                                '<th>Nombre</th>'+
                                '<th>Acciones</th>'+
                            '</tr>';
//---- SI NO HAY NADA AVISAMOS CON UN CARTEL ---//
    if(facultades.count == 0){
        showError("No hay facultades cargadas");
        tableBody.innerHTML = "";
        return;
    }
//---- CARGAMOS LAS FILAS DE LA TABLA ---//
    let filas = "";
    for (let index in facultades.rows) {
        filas += '<tr>'+
            '<td>'+
                '<span class="custom-checkbox">'+
                    '<input type="checkbox" id="checkbox'+index+'" name="options[]" value="'+facultades.rows[index].id+'">'+
                    '<label for="checkbox1"></label>'+
                '</span>'+
            '</td>'+
            '<td>'+facultades.rows[index].nombre+'</td>'+
            '<td>'+
                '<a href="javascript:openPopUp('+facultades.rows[index].id+')" class="edit" data-target ="#createOrUpdate"  data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>'+
                '<a href="javascript:openPopUp('+facultades.rows[index].id+')" class="delete" data-target ="#eliminar" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>'+
            '</td>'+
        '</tr>';
    }
    tableBody.innerHTML = filas;
//---- COLOCAMOS LA CANTIDAD DE PAGINAS ---//
    let pagination = '<div class="hint-text">Showing <b>'+limit+'</b> out of <b>'+facultades.count+'</b> entries</div>'+
                                '<ul class="pagination">';
    if(pag == 0){
        pagination += '<li class="page-item disabled" id="anterior"><a href="javascript:getAntPage()">Anterior</a></li>';
    }else{
        pagination += '<li class="page-item" id="anterior"><a href="javascript:getAntPage()">Anterior</a></li>';
    }
    for(let i = 1 ; i <=  Math.ceil(facultades.count/limit); i++ ){
        if(i == pag+1){
            pagination += '<li class="page-item active"><a href="javascript:getPagina('+(i-1)+')" class="page-link">'+i+'</a></li>';
        }else{
            pagination += '<li class="page-item"><a href="javascript:getPagina('+(i-1)+')" class="page-link">'+i+'</a></li>';
        }
                   
                
    }
    if(pag+1 == Math.ceil(facultades.count/limit)){
        pagination += '<li class="page-item disabled" id="siguiente"><a href="javascript:getSigPagina()" class="page-link">Siguiente</a></li>';
    }else{
        pagination += '<li class="page-item" id="siguiente"><a href="javascript:getSigPagina()" class="page-link">Siguiente</a></li>';
    }
    pagination += "</ul>";
    paginacion.innerHTML = pagination;
    atr();
}


function cargarTablaCarrera(carreras){
    let tabla = document.getElementById("table");
    tabla.setAttribute("styñe","opacity: 0;")
    //----PEDIMOS LOS OBJETOS DEL HTML QUE SON DINAMICOS----//
    let nombreTabla = document.getElementById("nombreTabla");
    nombreTabla.innerHTML = "Carrera"; //--NOMBRE DE LA TABLA
    let tableHeader = document.getElementById("thead");
    let tableBody = document.getElementById("tbody");
    let paginacion = document.getElementById("paginacion");
    paginacion.setAttribute("styñe","opacity: 0;");
//----COLOCAMOS LOS TITULOS EN COLUMNAS DE LA TABLA---//
    tableHeader.innerHTML = '<tr>'+
                                '<th>'+
                                    '<span class="custom-checkbox">'+
                                        '<input type="checkbox" id="selectAll">'+
                                        '<label for="selectAll"></label>'+
                                    '</span>'+
                                '</th>'+
                                '<th>Nombre</th>'+
                                '<th>cantidad de Años</th>'+
                                '<th>Acciones</th>'+
                            '</tr>';
//---- SI NO HAY NADA AVISAMOS CON UN CARTEL ---//
    if(carreras.count == 0){
        showError("No hay carreras cargadas");
        tableBody.innerHTML = "";
        return;
    }
//---- CARGAMOS LAS FILAS DE LA TABLA ---//
    let filas = "";
    for (let index in carreras.rows) {
        filas += '<tr>'+
            '<td>'+
                '<span class="custom-checkbox">'+
                    '<input type="checkbox" id="checkbox'+index+'" name="options[]" value="'+carreras.rows[index].id+'">'+
                    '<label for="checkbox1"></label>'+
                '</span>'+
            '</td>'+
            '<td>'+carreras.rows[index].nombre+'</td>'+
            '<td>'+carreras.rows[index].cantAnios+'</td>'+
            '<td>'+
                '<a href="javascript:openPopUp('+carreras.rows[index].id+')" class="edit" data-target ="#createOrUpdate"  data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>'+
                '<a href="javascript:openPopUp('+carreras.rows[index].id+')" class="delete" data-target ="#eliminar" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>'+
            '</td>'+
        '</tr>';
    }
tableBody.innerHTML = filas;
//---- COLOCAMOS LA CANTIDAD DE PAGINAS ---//
    let pagination = '<div class="hint-text">Showing <b>'+limit+'</b> out of <b>'+carreras.count+'</b> entries</div>'+
                                '<ul class="pagination">';
    if(pag == 0){
        pagination += '<li class="page-item disabled" id="anterior"><a href="#">Anterior</a></li>';
    }else{
        pagination += '<li class="page-item" id="anterior"><a href="javascript:getAntPage()">Anterior</a></li>';
    }
    for(let i = 1 ; i <=  Math.ceil(carreras.count/limit); i++ ){
        if(i == pag+1){
            pagination += '<li class="page-item active"><a href="javascript:getPagina('+(i-1)+')" class="page-link">'+i+'</a></li>';
        }else{
            pagination += '<li class="page-item"><a href="javascript:getPagina('+(i-1)+')" class="page-link">'+i+'</a></li>';
        }
                
                
    }
    if(pag+1 == Math.ceil(carreras.count/limit)){
        pagination += '<li class="page-item disabled" id="siguiente"><a href="#" class="page-link">Siguiente</a></li>';
    }else{
        pagination += '<li class="page-item" id="siguiente"><a href="javascript:getSigPagina()" class="page-link">Siguiente</a></li>';
    }
    pagination += "</ul>";
    paginacion.innerHTML = pagination;
    atr();

}
function cargarTablaMateria(materias){
    let tabla = document.getElementById("table");
    tabla.setAttribute("styñe","opacity: 0;")
    //----PEDIMOS LOS OBJETOS DEL HTML QUE SON DINAMICOS----//
    let nombreTabla = document.getElementById("nombreTabla");
    nombreTabla.innerHTML = "Materia"; //--NOMBRE DE LA TABLA
    let tableHeader = document.getElementById("thead");
    let tableBody = document.getElementById("tbody");
    let paginacion = document.getElementById("paginacion");
    paginacion.setAttribute("styñe","opacity: 0;");
//----COLOCAMOS LOS TITULOS EN COLUMNAS DE LA TABLA---//
    tableHeader.innerHTML = '<tr>'+
                                '<th>'+
                                    '<span class="custom-checkbox">'+
                                        '<input type="checkbox" id="selectAll">'+
                                        '<label for="selectAll"></label>'+
                                    '</span>'+
                                '</th>'+
                                '<th>Codigo</th>'+
                                '<th>Nombre</th>'+
                                '<th>Periodo</th>'+
                                '<th>Año</th>'+
                                '<th>Acciones</th>'+
                            '</tr>';
//---- SI NO HAY NADA AVISAMOS CON UN CARTEL ---//
    if(materias.count == 0){
        showError("No hay materias cargadas");
        tableBody.innerHTML = "";
        return;
    }
//---- CARGAMOS LAS FILAS DE LA TABLA ---//
    let filas = "";
    for (let index in materias.rows) {
        filas += '<tr>'+
            '<td>'+
                '<span class="custom-checkbox">'+
                    '<input type="checkbox" id="checkbox'+index+'" name="options[]" value="'+materias.rows[index].id+'">'+
                    '<label for="checkbox1"></label>'+
                '</span>'+
            '</td>'+
            '<td>'+materias.rows[index].cod+'</td>'+
            '<td>'+materias.rows[index].nombre+'</td>'+
            '<td>'+materias.rows[index].periodo+'</td>'+
            '<td>'+materias.rows[index].anio+'</td>'+
            '<td>'+
                '<a href="javascript:openPopUp('+materias.rows[index].id+')" class="edit" data-target ="#createOrUpdate"  data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>'+
                '<a href="javascript:openPopUp('+materias.rows[index].id+')" class="delete" data-target ="#eliminar" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>'+
            '</td>'+
        '</tr>';
    }
    tableBody.innerHTML = filas;
//---- COLOCAMOS LA CANTIDAD DE PAGINAS ---//
    let pagination = '<div class="hint-text">Showing <b>'+limit+'</b> out of <b>'+materias.count+'</b> entries</div>'+
                                '<ul class="pagination">';
    if(pag == 0){
        pagination += '<li class="page-item disabled" id="anterior"><a href="javascript:getAntPage()">Anterior</a></li>';
    }else{
        pagination += '<li class="page-item" id="anterior"><a href="javascript:getAntPage()">Anterior</a></li>';
    }
    for(let i = 1 ; i <=  Math.ceil(materias.count/limit); i++ ){
        if(i == pag+1){
            pagination += '<li class="page-item active"><a href="javascript:getPagina('+(i-1)+')" class="page-link">'+i+'</a></li>';
        }else{
            pagination += '<li class="page-item"><a href="javascript:getPagina('+(i-1)+')" class="page-link">'+i+'</a></li>';
        }
                
                
    }
    if(pag+1 == Math.ceil(materias.count/limit)){
        pagination += '<li class="page-item disabled" id="siguiente"><a href="javascript:getSigPagina()" class="page-link">Siguiente</a></li>';
    }else{
        pagination += '<li class="page-item" id="siguiente"><a href="javascript:getSigPagina()" class="page-link">Siguiente</a></li>';
    }
    pagination += "</ul>";
    paginacion.innerHTML = pagination;
    atr();

}

//-----------FUNCIONES EXTRA
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
      console.log("aca deberia recargar");
      location.reload();
    }, 2000);
}

function openPopUp(idparams){
    id = idparams;
    console.log(id);
    switch(funcion){
        case "admin":{
            getDatosAdmin(false);
            break;
        };
        case "Docente":{
            getDatosDocente(false);
            break;
        };
        case "Facultad":{
            getDatosAdmin(false);
            break;
        };
        case "Carrera":{
            getDatosCarrera(false);
            break;
        };
        case "Materia":{
            getDatosMateria(false);
            break;
        };
    }
} 