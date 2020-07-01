async function redirectListadoReservas(){ 
    var misCabeceras = new Headers();
    //misCabeceras.append('Content-Type','application/json'); 
    //misCabeceras.append('Accept','application/json'); 
    if(localStorage.getItem("token")){
        let token = localStorage.getItem("token");
        console.log(token); // 
        misCabeceras.append("token", token);
    }    
    let responseJSON = await fetch('http://localhost:3000/verificarDocente/pagina/verReservas',{
        method: 'GET', // or 'PUT'
        headers: misCabeceras, 
      })
    .then(function (response) { //Trae los filtros en el parametro "response"    
        if(response.status == 404){
            window.location.href = '/login';
        }   
        else{
          return response.text() //Retorno como JSON los datos de la API
        }
    })
    if(responseJSON.status != 404){
        window.location.href = responseJSON;
    }
}
async function redirectReservarAula(){  
    var misCabeceras = new Headers();
    //misCabeceras.append('Content-Type','application/json'); 
    //misCabeceras.append('Accept','application/json'); 
    if(localStorage.getItem("token")){ //si hay un token almacenado 
        let token = localStorage.getItem("token"); // traigo el token
        misCabeceras.append("token", token); //lo agrego en el heather
    }    
    let responseJSON = await fetch('http://localhost:3000/verificarDocente/pagina/reservarAula',{
        method: 'GET', // or 'PUT'
        headers: misCabeceras,  //Mando el header
      })
      .then(function (response) { // Me trae 404 entonces no me logueé
      if(response.status == 404){
          window.location.href = '/login'; //Me manda al lovi
      }else if(response.status == 200){ //Si esta loggeado 200 = OK 
          return response.text(); 
      }
  })
      window.location.href = responseJSON; //Redirijo a la url correspondiente traida desde API
}

async function redirectAutorizarReservas(){
    var misCabeceras = new Headers();
    //misCabeceras.append('Content-Type','application/json'); 
    //misCabeceras.append('Accept','application/json'); 
    if(localStorage.getItem("token")){
        let token = localStorage.getItem("token");
        console.log(token); // 
        misCabeceras.append("token", token);
    }    
    let responseJSON = await fetch('http://localhost:3000/verificarAdmin',{
        method: 'GET', // or 'PUT'
        headers: misCabeceras, 
      })
      .then(function (response) { //Trae los filtros en el parametro "response"    
      if(response.status == 404){ // Esto significa que la API no loggeo al usuario 
          window.location.href = '/login'; //Entonces lo manda a iniciar sesion
      }else{
        return response.text() //Retorno como JSON los datos de la API 
      }
    })
    if(responseJSON.status != 404){ // Si es diferente de 404 o si le viene un 200 creo o un codigo de ok esta bien loggeado lo mando a la url que corresponda, si es un 200 lo mandamos y si mno deberiamos imprimirlo o algo asi 
        window.location.href = responseJSON; // Lo mando a la pagina ( URL ) que le pedi la cuestion. 
    }
}