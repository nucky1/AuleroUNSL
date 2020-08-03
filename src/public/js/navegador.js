function logout(){
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  window.location.href = '/login';
}

async function redirectListadoReservas(){ 
    var misCabeceras = new Headers();
    //misCabeceras.append('Content-Type','application/json'); 
    //misCabeceras.append('Accept','application/json'); 
    if(localStorage.getItem("token")){
        let token = localStorage.getItem("token");
        console.log(token); // 
        misCabeceras.append("token", token);
    }    
    let responseJSON = await fetch('verificarDocente/pagina/verReservas',{
        method: 'GET', // or 'PUT'
        headers: misCabeceras, 
      })
      .then(function (response) { //Trae los filtros en el parametro "response"    
            if(response.status == 404 || response.status == 403){
                window.location.href = '/login';
            }   
            else{
                return response.text() //Retorno como JSON los datos de la API
            }
        })
        if(responseJSON.status != 404 && responseJSON.status != 403){
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
    let responseJSON = await fetch('verificarDocente/pagina/reservarAula',{
        method: 'GET', // or 'PUT'
        headers: misCabeceras,  //Mando el header
      })
      .then(function (response) { //Trae los filtros en el parametro "response"    
        if(response.status == 404 || response.status == 403){
            window.location.href = '/login';
        }   
        else{
          return response.text() //Retorno como JSON los datos de la API
        }
    })
    if(responseJSON.status != 404 && responseJSON.status != 403){
        window.location.href = responseJSON;
    }
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
    let responseJSON = await fetch('verificarAdmin',{
        method: 'GET', // or 'PUT'
        headers: misCabeceras, 
      })
      .then(function (response) { //Trae los filtros en el parametro "response"    
            if(response.status == 404 || response.status == 403){
                window.location.href = '/login';
            }   
            else{
            return response.text() //Retorno como JSON los datos de la API
            }
        })
        if(responseJSON.status != 404 && responseJSON.status != 403){
            window.location.href = responseJSON;
        }
}