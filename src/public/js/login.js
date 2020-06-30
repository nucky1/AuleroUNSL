async function iniciarSesion(){
    //get usuario
    let usuario = document.getElementById('user');   
    usuario = usuario.value;
    //get contraseña
    let contra = document.getElementById('pass');  
    contra = contra.value;
    var data = {
          username: usuario,
          password: contra
      }; // IGUAL SIRVE PARA DAR DE ALTA
    let responseJSON = await fetch('/checkLogin', {
          method: 'POST', // or 'PUT'
          body: JSON.stringify(data), // data can be `string` or {object}!
          headers:{ // NO SE PA QUE SIRVE 
            'Content-Type': 'application/json;charset=utf-8' // NO SE PA QUE SIRVE pero sino no funca 
          }
        }).then(function(response) { //Trae los filtros en el parametro "response" 
            return response.json(); //Retorno como JSON los datos de la API
        })
        .catch(error => console.error('Error:', error)) 
    
    localStorage.setItem("token", responseJSON.token);
    console.log(responseJSON.token);
}