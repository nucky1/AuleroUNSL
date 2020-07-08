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
        }).then(function(response) { 
              return response.json(); //Retorno como JSON los datos de la API
            
        }).catch(function(reason) {
          console.log(reason);
          setError(1);
       });
        //la primera me tira cuando hay 404.. la segunda es por si acaso, y la tercera por el ensure token
    if(responseJSON != undefined && responseJSON.status != 404 && responseJSON.status != 403){
      localStorage.setItem("token", responseJSON.token); // Guardo token en localstorage
      localStorage.setItem("username",responseJSON.user.usuario);// Guardo usuario en localstorage 
      location.reload();
    }
}

function setError(i){
  span = document.getElementById("spanError");
  span.style.opacity = i;
}
//POP UP
var btnAbrirPopup = document.getElementById('btn-abrir-popup'),
	overlay = document.getElementById('overlay'),
	popup = document.getElementById('popup'),
	btnCerrarPopup = document.getElementById('btn-cerrar-popup');

function abrir(){
  console.log("abrir");
  overlay.classList.add('active');
  popup.classList.add('active');
}
function cerrar(){
  console.log("cerrar");
	overlay.classList.remove('active');
	popup.classList.remove('active');
}
