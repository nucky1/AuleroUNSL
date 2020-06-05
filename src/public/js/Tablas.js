

function llenarTabla() {
    let tabla = document.getElementById('table');
    

    //Eliminamos las filas:
    for (let index = tabla.rows.length-1; index > 0 ; index--) {
        tabla.deleteRow(index);        
    }

    //insertamos aulas
    aulas.forEach(aula => {
        let fila = tabla.insertRow(-1);

        let celda = fila.insertCell(0);
        celda.appendChild(document.createTextNode(''));

        celda = fila.insertCell(1);
        celda.appendChild(document.createTextNode(''));

        celda = fila.insertCell(2);
        celda.appendChild(document.createTextNode('blaaaaaaa'));
    });


}