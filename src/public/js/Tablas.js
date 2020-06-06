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