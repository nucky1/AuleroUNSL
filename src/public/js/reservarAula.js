async function redirectReservarAula(){ 
    var misCabeceras = new Headers();
    //misCabeceras.append('Content-Type','application/json'); 
    //misCabeceras.append('Accept','application/json'); 
    if(localStorage.getItem("token")){
        let token = localStorage.getItem("token");
        console.log(token); // 
        misCabeceras.append("token", token);
    }    
    let responseJSON = await fetch('http://localhost:3000/reservaAula',{
        method: 'GET', // or 'PUT'
        headers: misCabeceras, 
      })
    .then(function (response) { //Trae los filtros en el parametro "response"    
        console.log(response.url) 
        if(response.status != 404){
            window.history.pushState(null,"",response.url);
        }else{
            window.location.assign('http://localhost:3000/login');
        }        
        return response.text() //Retorno como JSON los datos de la API
    })   
    if(responseJSON.status != 404){
        document.getElementById("html").innerHTML = responseJSON;
    }
    
}