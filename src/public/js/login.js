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
    let responseJSON = await fetch('http://192.168.0.10:3000/checkLogin', {
          method: 'POST', // or 'PUT'
          body: JSON.stringify(data), // data can be `string` or {object}!
          headers:{ // NO SE PA QUE SIRVE 
            'Content-Type': 'application/json' // NO SE PA QUE SIRVE  
          }
        }).then(function(response) { //Trae los filtros en el parametro "response" 
            return response.json(); //Retorno como JSON los datos de la API
        })
        .catch(error => console.error('Error:', error)) 
    let tokenn = {
      token: responseJSON.token
    }
    localStorage.setItem("token", JSON.stringify(tokenn));
    console.log(JSON.stringify(tokenn));

}
