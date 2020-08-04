horasDisponiblesMap = new Map(); 
cantidadHorasReservasMap = new Map(); //Mapa de Carreras - cantAños - lo lleno en cargarCarreras
aulasMap = new Map();
materiasMap = new Map();
var day;
var horaI;
var cantH;
var codMat;
var idDoc;
var per;
getFiltroReservarAula();
cargarDatosEstaticos(); 



async function getFiltroReservarAula() {
    var misCabeceras = new Headers();
    if(localStorage.getItem("token")){
        let token = localStorage.getItem("token"); 
        misCabeceras.append("token", token);
    }
    let responseJSON = await fetch('filtrosReserva',{ //URL de getFiltrosReserva
        method: 'GET', // or 'PUT'
        headers: misCabeceras, 
      })
      .then(function (response) { //Trae los filtros en el parametro "response"  
        if(response.status == 404){ // Esto significa que la API no loggeo al usuario 
            window.location.href = '/login'; //Entonces lo manda a iniciar sesion
        }else if(response.status == 200){ 
            return response.json(); //Retorno como JSON los datos de la API 
        }else{
            console.log(response.text());
        }
    }); 
    cargarDatosFiltros(responseJSON);
}

function cargarDatosFiltros(edificios){ // asumo que recibo un arreglo de nombres de edificios
    let selector = document.getElementById('edif'); 
    for(i=0;i<edificios.length;i++){
        let opcion = document.createElement('option'); //Creo el objeto opción del selector 
        opcion.text = edificios[i].nombre; //Le setteo el valor del nombre del edificio
        selector.add(opcion); // 
    }
}

//Carga los datos que son iguales en todos lados del front
function cargarDatosEstaticos(){
    let selector = document.getElementById('dias');  // Dias de la semana
    let dias = ["lunes", "martes","miercoles","jueves","viernes","sabado"];   
    let periodo = ["primer cuatrimestre","segundo cuatrimestre","Anual"];   
    let opcion;
    for(i=0;i<6;i++){
        opcion = document.createElement('option');
        opcion.text = dias[i];
        selector.add(opcion);
    }
    selector = document.getElementById('hInicio'); // Hora de inicio Reserva 
    for(i=7;i<23;i++){
        horasDisponiblesMap.set(i+":00 hs",i*100);
        opcion = document.createElement('option');
        opcion.text = i+":00 hs";
        selector.add(opcion);
        if(i!=23){
            horasDisponiblesMap.set(i+":30 hs",i*100+30);
            opcion = document.createElement('option');
            opcion.text = i+":30 hs"; 
            selector.add(opcion);
        }
    }
    selector = document.getElementById('hCant');  // Cantidad de horas Reserva
    for(i=1;i<6;i++){
        cantidadHorasReservasMap.set(i+":00 hs",i*100);
        opcion = document.createElement('option');
        opcion.text = i+":00 hs";
        selector.add(opcion);
        if(i!=5){
            cantidadHorasReservasMap.set(i+":30 hs",i*100+30);
            opcion = document.createElement('option');
            opcion.text = i+":30 hs";
            selector.add(opcion);
        }
    }
    selector = document.getElementById('per'); // periodo academico
    for(i=0;i<3;i++){
        opcion = document.createElement('option');
        opcion.text = periodo[i];
        selector.add(opcion);
    }
}

//BOTON SIGUIENTE
function controlHorario(){
    let selector = document.getElementById('hInicio'); 
    let horaInicio = horasDisponiblesMap.get(selector.options[selector.selectedIndex].text);    
    selector = document.getElementById('hCant'); 
    let cantHoras = cantidadHorasReservasMap.get(selector.options[selector.selectedIndex].text);
    return (horaInicio+cantHoras)<= 2300 ; //Controlo que no sea mas de las 23 hs     
}
function controlCapacidad(){
    selector = document.getElementById('cap');
    let capacidad=selector.value; 
    return (capacidad>0) && ((capacidad % 1) == 0);
}

async function buscarAulas(){
    let flag = true;
    let text = "";
    if(!controlHorario()){
        flag = false;
        text = "El horario de finalizacion de clases es mayor a las 23hs.\n";
    }
    if(!controlCapacidad()){
        flag = false;
        text += "La capacidad tiene un valor invalido.";
    }
    //GETTEO LOS VALORES DE LAS AULAS A BUSCAR
    if(flag){
        let selector = document.getElementById('edif');  
        let edificio=selector.options[selector.selectedIndex].text; //Valor edificio
        selector = document.getElementById('dias'); 
        day = selector.options[selector.selectedIndex].text; //Valor dia - VARIABLE GLOBAL
        selector = document.getElementById('hInicio'); 
        horaI = horasDisponiblesMap.get(selector.options[selector.selectedIndex].text);//Valor hora de inicio de la reserva - VARIABLE GLOBAL
        
        selector = document.getElementById('hCant'); 
        cantH= cantidadHorasReservasMap.get(selector.options[selector.selectedIndex].text);//Valor cantidad de horas - VARIABLE GLOBAL
        selector = document.getElementById('cap'); 
        let capacidad=selector.value;//Valor capacidad del aula
        selector = document.getElementById('per');  
        per =selector.options[selector.selectedIndex].text.toLowerCase();//Valor periodo academico - VARIABLE GLOBAL
        //FIN GETTEO - EMPIEZA COMUNICACION API
        var misCabeceras = new Headers();         
        if(localStorage.getItem("token")){ //si hay un token almacenado 
            let token = localStorage.getItem("token"); // traigo el token
            misCabeceras.append("token", token); //lo agrego en el heather
        }    
        let responseJSON = await fetch('buscarAulaReserva/edificio/'+edificio+'/dia/'+day+'/horaInicio/'+horaI+'/cantHoras/'+cantH+'/capacidad/'+capacidad+'/periodo/'+per,{
            method: 'GET', // or 'PUT'
            headers: misCabeceras,  //Mando el header
            })
            .then(function (response) { // Me trae 404 entonces no me logueé
            if(response.status == 404){
                window.location.href = '/login'; //Me manda al lovi
            }else{ //Si esta loggeado 200 = OK 
                return response.json(); 
            }
        })
        //Fin get
        if(responseJSON.length == 0){
            showError("No hay aulas disponibles el dia "+day+" en ese horario");
        }else{
            cargarListaAulas(responseJSON);
            document.getElementById("siguientep1").className = "btn btn-bold ml-auto js-btn-next";//cambia panel
            document.getElementById("siguientep1").onclick = "";
            document.getElementById("siguientep1").click();
        }
    }else{
        showError(text);
    }
}

function cargarListaAulas(listaAulas){
    codigoHTML = "<br><br>"
        +"    <div class='conatiner'>"
        +"      <table class='table'>"
        +"      <thead>"
        +"            <tr>"
        +"                <th>Nombre</th>"
        +"                <th>Edificio</th>"
        +"                <th>Capacidad</th>"
        +"                <th>Ubicación</th>"
        +"                <th></th>"
        +"            </tr>"
        +"            </thead>"
        +"            <tbody>";
        for(i=0;i<listaAulas.length;i++){
            aulasMap.set(i,listaAulas[i].id);//Entonces tengo cada aula de cada fila o boton seleccionado, tranquilamente con una lista se puede pero ya conozco los mapas xD 
            codigoHTML+="\n<tr id=>";
            codigoHTML+= "\n<td>"+listaAulas[i].nombre+" - "+listaAulas[i].numero+"</td>";
            codigoHTML+= "\n<td>"+listaAulas[i].edificio.nombre+"</td>";
            codigoHTML += "\n<td>" + listaAulas[i].capacidad + "</td>";
            codigoHTML += "\n<td>" + listaAulas[i].ubicacion +"</td>";
            codigoHTML += "\n<td><input type='radio' id='"+ i +"' name='aulaSel' value=''></td>";
            codigoHTML+= "\n</tr>";
        }
                //Aca va el for
        codigoHTML+="            </tbody>"
        +"        </table>"
        +"  <div class='botones-step text-right'>"
        +"      <button class='btn btn-line ml-auto js-btn-prev' type='button' title='Prev' id='vovler2' onclick = \"activatebuscarAula()\">Volver</button>"
        +"      <button id = 'siguientep2' class='btn btn-bold mb-2' type='button' title='Next' onclick='getMaterias()'>Siguiente</button>"
        +"  </div>"
        +"</div>";
    document.getElementById('panelSelecAula').innerHTML = codigoHTML;
}
function activatebuscarAula(){
    document.getElementById("siguientep1").className = "btn btn-bold mb-2";//cambia panel
    document.getElementById("siguientep1").setAttribute('onclick','buscarAulas()');
}
async function getMaterias(){
    if(getAulaSeleccionada()>-1){
        document.getElementById("siguientep2").className = "btn btn-bold ml-auto js-btn-next";//cambia panel
        var misCabeceras = new Headers();
        if(localStorage.getItem("token")){
            let token = localStorage.getItem("token"); 
            misCabeceras.append("token", token);
        }
        let responseJSON = await fetch('buscarMateras/periodo/'+per,{ //URL de buscarMateras
            method: 'GET', // or 'PUT'
            headers: misCabeceras, 
        })
        .then(function (response) { //Trae los filtros en el parametro "response"  
            if(response.status == 404){ // Esto significa que la API no loggeo al usuario 
                window.location.href = '/login'; //Entonces lo manda a iniciar sesion
            }else if(response.status == 200){ 
                return response.json(); //Retorno como JSON los datos de la API 
            }else{
                console.log(response.text());
            }
        }); 
        cargarMaterias(responseJSON);
    }else{
        showError("Debe seleccionar un aula.");
    }
}

function cargarMaterias(materias){//Recupero materias
    let selector = document.getElementById('nombMateria');
    selector.options.length = 0;
    for(i=0;i<materias.length;i++){
        let opcion = document.createElement('option'); //Creo el objeto opción del selector 
        opcion.text = materias[i].nombre; //Le setteo el valor del nombre del edificio
        selector.add(opcion); // 
        materiasMap.set(materias[i].nombre,materias[i].cod);
    }
}
function controlCampos2(){
    let codMat = document.getElementById('codMateria');
    return codMat.value != "";
} 

//TE OBTIENE EL ID DEL AULA SELECCIONADA EN LA TABLA DEL STEP 2. 
function getAulaSeleccionada() { 
    var rbutons = document.getElementsByName('aulaSel'); //Arreglo con todos los radio button que se llamen asi "name" no ID 
    for(i=0; i<rbutons.length; i++) { 
        if(rbutons[i].checked) 
            return aulasMap.get(i);
    }
    return -1;
}
async function reservarAula(){
    if(controlCampos2()){
        var misCabeceras = new Headers();
        if(localStorage.getItem("token")){ //si hay un token almacenado 
            let token = localStorage.getItem("token"); // traigo el token
            misCabeceras.append("token", token); //lo agrego en el heather
            misCabeceras.append("Content-Type",'application/json;charset=utf-8');
        }  
        let aulaId = getAulaSeleccionada(); 
        let codMat = document.getElementById('codMateria');
        codMat = codMat.value;
        var data = { //El body que envio 
            dia: day,
            horaInicio : horaI,
            cantHoras : cantH,
            idAula : aulaId,  
            codMateria : codMat,
            periodo : per  
        }; 
        console.log(data);
      let responseJSON = await fetch('/insertReserva', {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(data), // data can be `string` or {object}!
            headers: misCabeceras,
          }).then(function(response) { 
                return response; //Retorno como JSON los datos de la API
              
          }).catch(function(reason) {
            console.log(reason);
            //setError(1);
         });
         if(responseJSON.status != 200){
            showError("Ocurrio un error al realizar la reserva.");
          }else{
            showSuccess();
        // window.location.href = '/listadoReservas';
          }

    }else{
        //Retar al chabon
        showError("Debe seleccionar una materia");
    }
}

function setCodigo(){
    let combo = document.getElementById('nombMateria');
    combo = combo.options[combo.selectedIndex].text; 
    let textoCod = document.getElementById('codMateria');
    textoCod.value = materiasMap.get(combo);
}
function showError(error){
    document.getElementById("textError").innerHTML = '<span class="badge badge-danger" style="background: #f15e5e; margin-right:20px;"><i class="material-icons">&#xE5CD;</i></span>'+ error;
    $("#cartelFail").modal();
    setTimeout(function(){ 
      $("#cartelFail").modal('hide');
    }, 2000);
  }
  function showSuccess(){
    $("#cartelOk").modal();
    setTimeout(function(){ 
      $("#cartelOk").modal('hide');
      
      location.reload();
    }, 2000);
  }

