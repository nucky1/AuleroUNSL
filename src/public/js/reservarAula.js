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
    let responseJSON = await fetch('http://localhost:3000/filtrosReserva',{ //URL de getFiltrosReserva
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
function controlCampos(){
    let selector = document.getElementById('hInicio'); 
    let horaInicio = horasDisponiblesMap.get(selector.options[selector.selectedIndex].text);    
    selector = document.getElementById('hCant'); 
    let cantHoras = cantidadHorasReservasMap.get(selector.options[selector.selectedIndex].text);
    
    selector = document.getElementById('cap'); 
    let capacidad=selector.value;
    return (horaInicio+cantHoras)<= 2300 && (capacidad>0) ; //Controlo que no sea mas de las 23 hs     
}
async function buscarAulas(){
    if(controlCampos()){
        //GETTEO LOS VALORES DE LAS AULAS A BUSCAR
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
        per =selector.options[selector.selectedIndex].text;//Valor periodo academico - VARIABLE GLOBAL
        //FIN GETTEO - EMPIEZA COMUNICACION API
        var misCabeceras = new Headers();         
        if(localStorage.getItem("token")){ //si hay un token almacenado 
            let token = localStorage.getItem("token"); // traigo el token
            misCabeceras.append("token", token); //lo agrego en el heather
        }    
        let responseJSON = await fetch('http://localhost:3000/buscarAulaReserva/edificio/'+edificio+'/dia/'+day+'/horaInicio/'+horaI+'/cantHoras/'+cantH+'/capacidad/'+capacidad+'/periodo/'+per,{
            method: 'GET', // or 'PUT'
            headers: misCabeceras,  //Mando el header
          })
          .then(function (response) { // Me trae 404 entonces no me logueé
          if(response.status == 404){
              window.location.href = '/login'; //Me manda al lovi
          }else if(response.status == 200){ //Si esta loggeado 200 = OK 
              return response.json(); 
          }
      })
        //Fin get
        cargarListaAulas(responseJSON);
    }else{
        //let volver2 = document.getElementById('vovler2');
        //volver2.click();
        alert("ERROR. Coloque correctamente los campos.");
        window.location.reload()
    }
}

function cargarListaAulas(listaAulas){
    console.log(listaAulas); //bueno depende el JSON que me llegue  
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
        +"      <button class='btn btn-line ml-auto js-btn-prev' type='button' title='Prev' id='vovler2'>Volver</button>"
        +"      <button class='btn btn-bold ml-auto js-btn-next' type='button' title='Next' onclick='getMaterias()'>Siguiente</button>"
        +"  </div>"
        +"</div>";
    document.getElementById('panelSelecAula').innerHTML = codigoHTML;
}

 
async function getMaterias(){
    if(getAulaSeleccionada()>-1){
        var misCabeceras = new Headers();
        if(localStorage.getItem("token")){
            let token = localStorage.getItem("token"); 
            misCabeceras.append("token", token);
        }
        let responseJSON = await fetch('http://localhost:3000/buscarMateras/periodo/'+per,{ //URL de buscarMateras
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
        alert("Debe seleccionar al menos una materia.");
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
                return response.json(); //Retorno como JSON los datos de la API
              
          }).catch(function(reason) {
            console.log(reason);
            //setError(1);
         });
         console.log(responseJSON);
         console.log("Deberiamos mostrarle un cartel, la reserva se ha dado correctamente");
         //Hacer algo con la respuesta 
        // window.location.href = '/listadoReservas';


    }else{
        //Retar al chabon
        console.log("Deberiamos mostrarle un cartel, la reserva se ha dado INcorrectamente");
    }
}

function setCodigo(){
    let combo = document.getElementById('nombMateria');
    combo = combo.options[combo.selectedIndex].text; 
    let textoCod = document.getElementById('codMateria');
    textoCod.value = materiasMap.get(combo);
}

