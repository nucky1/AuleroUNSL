async function cancelarReservaDocente(id) {
  let token;
  if (localStorage.getItem("token")) {
    token = localStorage.getItem("token");
  }
  const responseJSON = await fetch(
    "http://localhost:3000/cancelarReserva/id/" + id,
    {
      method: "GET", // or 'PUT'
      headers: {
        // NO SE PA QUE SIRVE
        token: token, // NO SE PA QUE SIRVE
      },
    }
  ).then(function (response) {
    console.log(response)
    return response;
    //alert("Reserva Eliminada, por favor recargue la pagina.");
  });
  if(response.status != 404){
    location.reload();
  }
}
