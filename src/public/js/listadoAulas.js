var mapaUbicaciones = new Map();
getFiltros();
async function getFiltros() {
  let responseJSON = await fetch("getFiltrosAulas").then(
    function (response) {
      //Trae los filtros en el parametro "response"
      return response.json(); //Retorno como JSON los datos de la API
    }
  );
  cargarFiltros(responseJSON); // Con el awayt espero a que responda, despues llamo a cargarFiltros
}
function cargarFiltros(filtros) {
  let selector = document.getElementById("edif");
  //eliminamos las opciones anteriores
  selector.options.length = 0;
  //opcion para todas las aulas de todos los edificios
  let opcion = document.createElement("option");
  opcion.text = "todos";
  selector.add(opcion);
  let limit = filtros.length;
  //a�adimos los nombres de edificios
  for (let index in filtros) {
    let opcion = document.createElement("option");
    let setUbi = new Set();
    for (let ind in filtros[index].aulas) {
      setUbi.add(filtros[index].aulas[ind].ubicacion);
    }
    mapaUbicaciones.set(filtros[index].nombre, setUbi); //un mapa con el set de anterior accediendo mediante el nombre del edificio
    opcion.text = filtros[index].nombre;
    selector.add(opcion);
  }
}

function cargarUbicacion() {
  let selector = document.getElementById("edif");
  let selectorUbicaciones = document.getElementById("ubic");
  let edifSelect = selector.options[selector.selectedIndex].text; //Get Texto seleccionado
  //eliminamos las opciones anteriores
  selectorUbicaciones.options.length = 0;
  //opcion para todas las aulas de todos los edificios
  let opcion = document.createElement("option");
  opcion.text = "todos";
  selectorUbicaciones.add(opcion);
  if (edifSelect == "todos") {
    return;
  }
  //a�adimos las ubicaciones de aulas en ese edificio
  let ubicaciones = mapaUbicaciones.get(edifSelect);
  ubicaciones.forEach((value) => {
    let opcion = document.createElement("option");
    opcion.text = value;
    selectorUbicaciones.add(opcion);
  });
}
async function getAulas() {
  let selector = document.getElementById("edif");
  let edificio = selector.options[selector.selectedIndex].text;
  let capacidad = document.getElementById("capac").value;
  selector = document.getElementById("ubic");
  let ubicacion = selector.options[selector.selectedIndex].text;
  let extras = "all";
  console.log(
    edificio +
      "/capacidad/" +
      capacidad +
      "/ubicacion/" +
      ubicacion +
      "/extras/" +
      extras
  );
  if (capacidad >= 0 && capacidad <= 500) {
    let responseJSON = await fetch(
      "listadoAulas/edificio/" +
        edificio +
        "/capacidad/" +
        capacidad +
        "/ubicacion/" +
        ubicacion +
        "/extras/" +
        extras
    ).then(function (response) {
      //Trae los filtros en el parametro "response"
      return response.json(); //Retorno como JSON los datos de la API
    });

    if (responseJSON.length == 0) {
      showWarning("No hay aulas de estas caracteristicas.");
    } else {
      cargarTabla(responseJSON); // Con el awayt espero a que responda, despues llamo a cargarFiltros
    }
  } else {
    showError("Seleccione correctamente la capacidad del aula.");
  }
}
function showError(error){
  document.getElementById("textError").innerHTML = '<span class="badge badge-danger" style="background: #f15e5e; margin-right:20px;"><i class="material-icons">&#xE5CD;</i></span>'+ error;
  $("#cartelFail").modal();
  setTimeout(function(){ 
    $("#cartelFail").modal('hide');
  }, 2000);
}
function showWarning(error){
  document.getElementById("textError").innerHTML = '<span class="badge badge-pill badge-warning" style="background: #FFFF00;color: black; margin-right:20px;"><i class="material-icons">&#xe002;</i></span>'+ error;
  $("#cartelFail").modal();
  setTimeout(function(){ 
    $("#cartelFail").modal('hide');
  }, 2000);
}
function cargarTabla(aulas) {
  let tabla = document.getElementById("tbody");
  //eliminamos las filas
  for (let index = tabla.rows.length - 1; index > -1; index--) {
    tabla.deleteRow(index);
  }
  let beforeInfoAula =
    '<div class="acordion-heading">' +
    '<tr class="accordion-toggle" data-toggle="collapse" href="#collapse';
  let fincolapsar = '">';
  let afterInfoAula =
    "</tr>" +
    "</div >" +
    "<tr>" +
    '<td colspan = "4" style = "padding: 0; border-top-style: none;">' +
    '<div id="collapse';
  let finColapsedos =
    '" class="collapse">' +
    '<div class="expansible">' +
    '<ul class="list-inline">';
  let beforeExtra =
    '<li><span class="glyphicon glyphicon-check icon-check"></span>';
  let afterExtra = "</li>";
  let endFilabeforeId =
    "</ul>" +
    "</div >" +
    '<div class="botones text-right">' +
    '<button type="button" class="btn btn-line mb-2" onclick="verDetallesAula(';

  let endFila =
    ")\">Ver detalles</button>" +
    '<button type="button" class="btn btn-line mb-2" onclick = "redirectReservarAula()">Reservar</button>' +
    "</div>" +
    "</div >" +
    "</td >" +
    "</tr >";
  let codeHtml;
  for (let index in aulas) {
    let infoAula =
      "<td>" + aulas[index].nombre + " " + aulas[index].numero + "</td>";
    infoAula += "<td>" + aulas[index].edificio.nombre + "</td>";
    infoAula += "<td>" + aulas[index].capacidad + "</td>";
    infoAula += "<td>" + aulas[index].ubicacion + "</td>";
    let extrasAula = "";
    for (let ind in aulas[index].extras) {
      extrasAula += beforeExtra + aulas[index].extras[ind].extra + afterExtra;
    }
    tabla.innerHTML +=
      beforeInfoAula +
      index +
      fincolapsar +
      infoAula +
      afterInfoAula +
      index +
      finColapsedos +
      extrasAula +
      endFilabeforeId +
      aulas[index].id +
      endFila;
  }
}
function verDetallesAula(idAula){
  localStorage.setItem("idAula",idAula);
  location.href= "detallesAula";
}