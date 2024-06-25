import { Excel, ExcelViewer, FormatExcel, TableClear } from "./classes.js"
const $excelFile = document.getElementById('excel-file')
const $btnLoadDocument = document.getElementById('load-document')
const $labelName = document.querySelector("#select-excel-file span")
const tableID = 'excel-table'
let loading = false

$excelFile.onchange = function () {
    $labelName.textContent = $excelFile.files[0].name
    $btnLoadDocument.removeAttribute('disabled')
}

$btnLoadDocument.onclick = async function () {
    if ($excelFile.files.length <= 0) return // --> Retornar si no hay archivos seleccionadas

    loadText()

    TableClear.clear(tableID) // --> Limpiar la tabla antes de cargar el documento

    let content = await readXlsxFile($excelFile.files[0])
    content = new FormatExcel(content).formatNumber() // --> Corregir formato de string a numeros

    const excel = new Excel(content)
    ExcelViewer.viewer(tableID, excel)

    loadText()

    const $buttonsExcelData = document.querySelectorAll('.button-selectable')
    $buttonsExcelData.forEach(buttonData => {
        buttonData.addEventListener("click", (e) => {
            const { target } = e

            console.log(target.value);
        })
    })
}

function loadText() {
    loading = !loading
    const loadingTag = '<span class="loading"></span>'

    if (loading) {
        $btnLoadDocument.setAttribute('disabled', true)
        $btnLoadDocument.textContent = ''
        $btnLoadDocument.innerHTML = loadingTag
        return
    }

    $btnLoadDocument.removeAttribute('disabled')
    $btnLoadDocument.textContent = 'Cargar'
}
