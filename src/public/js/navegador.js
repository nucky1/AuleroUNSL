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
    if(localStorage.getItem("token")){
        let token = localStorage.getItem("token");
        console.log(token); // 
        misCabeceras.append("token", token);
    }    
    let responseJSON = await fetch('http://localhost:3000/verificarDocente/pagina/reservarAula',{
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
      if(response.status == 404){
          console.log("hola");
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