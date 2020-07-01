
cargarDatosEstaticos(); 
//getFiltrosReservarAula();


async function getFiltroReservarAula() {
    if(localStorage.getItem("token")){
        let token = localStorage.getItem("token"); 
        misCabeceras.append("token", token);
    }
    let responseJSON = await fetch('http://localhost:3000/reservaAula',{ //URL de getFiltrosReserva
        method: 'GET', // or 'PUT'
        headers: misCabeceras, 
      })
      .then(function (response) { //Trae los filtros en el parametro "response"    
      if(response.status == 404){ // Esto significa que la API no loggeo al usuario 
          window.location.href = '/login'; //Entonces lo manda a iniciar sesion
      }else if(response.status == 200){
        return response.JSON(); //Retorno como JSON los datos de la API 
      }else{
          console.log(response.text());
      }
    })
    cargarDatosFiltros(responseJSON);
}

function cargarDatosFiltros(edificios){ // asumo que recibo un arreglo de nombres de edificios
    let selector = document.getElementById('edif'); 
    for(i=0;i<edificios.length;i++){
       // facultades.set(filtros[i].nombre,filtros[i].carreras); //lleno el Mapa facultades GLOBAL // Esto es para crear un mapa pero no se que onda si para que lo uzo
        let opcion = document.createElement('option'); //Creo el objeto opción del selector 
        opcion.text = edificios[i]; //Le setteo el valor del nombre del edificio
        selector.add(opcion); // 
    }
}

//Carga los datos que son iguales en todos lados del front
function cargarDatosEstaticos(){
    let selector = document.getElementById('dias');  // Dias de la semana
    let dias = ["Lunes", "Martes","Miércoles","Jueves","Viernes","Sábado"];   
    let periodo = ["1er Cuatrimestre","2do Cuatrimestre","Anual"];   
    let opcion; 
    var horasDisponibles = new Map(); 
    var cantidadHorasReservas = new Map(); //Mapa de Carreras - cantAños - lo lleno en cargarCarreras
    for(i=0;i<6;i++){
        opcion = document.createElement('option');
        opcion.text = dias[i];
        selector.add(opcion);
    }
    selector = document.getElementById('hInicio'); // Hora de inicio Reserva 
    for(i=1;i<23;i++){
        horasDisponibles.set(i+".00 hs",i*100);
        opcion = document.createElement('option');
        opcion.text = i+".00 hs";
        selector.add(opcion);
        if(i!=23){
            horasDisponibles.set(i+".30 hs",i*100+30);
            opcion = document.createElement('option');
            opcion.text = i+".30 hs";                      2
            selector.add(opcion);
        }
    }
    selector = document.getElementById('hCant');  // Cantidad de horas Reserva
    for(i=1;i<6;i++){
        cantidadHorasReservas.set(i+".00 hs",i*100);
        opcion = document.createElement('option');
        opcion.text = i+".00 hs";
        selector.add(opcion);
        if(i!=5){
            cantidadHorasReservas.set(i+".30 hs",i*100+30);
            opcion = document.createElement('option');
            opcion.text = i+".30 hs";
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
    let horaInicio = horasDisponibles.get(selector.options[selector.selectedIndex].text);    
    selector = document.getElementById('hCant'); 
    let horaFin = cantidadHorasReservas.get(selector.options[selector.selectedIndex].text);
    return (horaInicio+HoraFin)<= 2300; //Controlo que no sea mas de las 23 hs     
}

function buscarAulas(){
    if(controlCampos()){
        let selector = document.getElementById('edif');  
        let edificio=selector.options[selector.selectedIndex].text; //Valor edificio
        selector = document.getElementById('dias'); 
        let dia =selector.options[selector.selectedIndex].text; //Valor dia
        selector = document.getElementById('hInicio'); 
        let horaInicio = horasDisponibles.get(selector.options[selector.selectedIndex].text);//Valor hora de inicio de la reserva
        selector = document.getElementById('hCant'); 
        let cantHoras= cantidadHorasReservas.get(selector.options[selector.selectedIndex].text);//Valor cantidad de horas 
        selector = document.getElementById('cap'); 
        let capacidad=selector.options[selector.selectedIndex].text;//Valor capacidad del aula
        selector = document.getElementById('per');  
        let periodo =selector.options[selector.selectedIndex].text;//Valor periodo academico
        //Tengo que hacer el get 
        var misCabeceras = new Headers();
        if(localStorage.getItem("token")){ //si hay un token almacenado 
            let token = localStorage.getItem("token"); // traigo el token
            misCabeceras.append("token", token); //lo agrego en el heather
        }    
        let responseJSON = await fetch('http://localhost:3000/buscarAulaReserva/edificio/'+edificio+'/dia/'+dia+'/horaInicio/'+horaInicio+'/cantHoras/'+cantHoras+'/capacidad/'+capacidad+'/periodo/'+periodo,{
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
        //Tengo que cargar el html con las aulas del json que me llega responseJSON
        //Fin get
        cargarListaAulas(responseJSON);
    }else{
        //Deberiamos mostrarle un cartel que no se puede pasr de las 23 hs ... 
    }
}

function cargarListaAulas(aulas){
    console.log(aulas); //bueno depende el JSON que me llegue 
    codigoHTML = "";
    for(i=0;i<aulas.length;i++){
        codigoHTML+="\n<tr>";
        codigoHTML+= "\n<td>"+listaAulas[i].aula.nombre+" - "+listaAulas[i].aula.numero+"</td>";
        codigoHTML+= "\n<td>"+listaAulas[i].aula.edificio.nombre+"</td>";
        codigoHTML += "\n<td>" + listaAulas[i].capacidad + "</td>";
        codigoHTML += "\n<td>" + listaAulas[i].ubicacion +"</td>";
        codigoHTML += "\n<td><input type='radio' id='1' name='aula' value=''></td>";
        codigoHTML+= "\n</tr>";
    }
    document.getElementById('tbody').innerHTML = codigoHTML;
}
