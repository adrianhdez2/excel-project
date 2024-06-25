export class Excel { // --> Clase Excel recibe los datos del documento original
    constructor(contentExcel) {
        this.contentExcel = contentExcel
    }

    header() { // --> Retorna la fila de los titulos
        return this.contentExcel[0]
    }

    rows() { // --> Retorna las fila de los demas datos
        return new RowCollection(this.contentExcel.slice(1, this.contentExcel.length))
    }
}

export class RowCollection {  // --> Recibe las filas de datos
    constructor(rows) {
        this.rows = rows
    }

    first() {  // --> Devuelve la primera fila de los datos
        return new Row(this.rows[0])
    }

    get(index = 0) {  // --> Devuelve todas las filas (por defecto la fila 0)
        return new Row(this.rows[index])
    }

    count() {  // --> Devuelve el total de filas
        return this.rows.length
    }
}

export class Row { // --> Retorna la fila
    constructor(row) {
        this.row = row
    }
}

export class FormatExcel { // --> Dar formato al documento Excel
    constructor(content) {
        this.content = content
    }

    formatNumber(){
        return this.content.map(row => row.map(cell => {
            if (typeof cell === 'string' && !isNaN(cell)) { // --> Validar si es un string y no un numero
                return Number(cell)
            }
            return cell
        }))
    }
}

export class ExcelViewer {  // Clase para cargar en el HTML (table) los datos del Excel
    static viewer(tableID, excel) {
        const table = document.getElementById(tableID)

        excel.header().forEach(title => {
            table.querySelector("thead>tr").innerHTML += `<th>${title}</th>`
        })

        for (let index = 0; index < excel.rows().count(); index++) {
            const row = excel.rows().get(index)
            const tbody = table.querySelector("tbody")
            const tr = document.createElement('tr')

            for (let j = 0; j < row.row.length; j++) {
                if (typeof row.row[j] === 'number') {
                    tr.innerHTML += `<td><input type="button" value="${row.row[j]}" class="button-selectable"/></td>`
                } else {
                    tr.innerHTML += `<td>${row.row[j]}</td>`
                }
            }

            tbody.append(tr)
        }
    }
}

export class TableClear { // --> Limpiar la tabla
    static clear(tableID) {
        const table = document.getElementById(tableID)
        table.querySelector("thead>tr").innerHTML = ''
        table.querySelector("tbody").innerHTML = ''
    }
}