

function llenarTabla() {
    let tabla = document.getElementById('table');
    //const aulas = aulascontroller.filtrar

    //Eliminamos las filas:
    for (let index = tabla.rows.length-1; index > 0 ; index--) {
        tabla.deleteRow(index);        
    }

    //insertamos aulas
    //aulas.forEach(aula => {
        let fila = tabla.insertRow(-1);

        let celda = fila.insertCell(0);
        celda.appendChild(document.createTextNode('bla'));

        celda = fila.insertCell(1);
        celda.appendChild(document.createTextNode('blaaa'));

        celda = fila.insertCell(2);
        celda.appendChild(document.createTextNode('blaaaaaaa'));
    //});


}