function getHorarios(){
    fetch('http://localhost:3000/horariosCarrera/facultad/FCFNyM/carrera/IngeWeb/anio/2020/periodo/1ro')
    .then(function(response) {
        return response.json();
    })
    .then(function(myJson) {
        console.log(myJson);
    });
}

function llenarTabla(filas,idTabla) {
    let tabla = document.getElementById(idTabla);
    

    //Eliminamos las filas:
    for (let index = tabla.rows.length-1; index > 0 ; index--) {
        tabla.deleteRow(index);        
    }

    //insertamos filas
    filas.forEach(fila => {
        let fila = tabla.insertRow(-1);
        for (i = 0; i < fila.length; i++) {
            let celda = fila.insertCell(i);
            celda.appendChild(document.createTextNode(fila[i]));
        }
    });
}