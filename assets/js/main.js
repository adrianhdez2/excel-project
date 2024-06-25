import { Excel, ExcelViewer, FormatExcel, TableClear } from "./classes.js"
const $excelFile = document.getElementById('excel-file')
const $btnLoadDocument = document.getElementById('load-document')
const $labelName = document.querySelector("#select-excel-file span")
const $sheetSelect = document.getElementById('sheet-select');
const $sheetSelectContainer = document.querySelector('.select-excel-sheets')
const tableID = 'excel-table'
let sheetNames = null
let workbook = null
let loading = false

$excelFile.onchange = async function () {
    $labelName.textContent = $excelFile.files[0].name
    $btnLoadDocument.removeAttribute('disabled')
}

function loadSheet(workbook, sheetName) {
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });


    const formattedData = new FormatExcel(jsonData).formatNumber()// --> Corregir formato de string a números

    const excel = new Excel(formattedData)
    ExcelViewer.viewer(tableID, excel)
}

$btnLoadDocument.onclick = async function () {
    if ($excelFile.files.length <= 0) return // --> Retornar si no hay archivos seleccionadas

    loadText()

    TableClear.clear(tableID) // --> Limpiar la tabla antes de cargar el documento

    const data = await $excelFile.files[0].arrayBuffer();
    workbook = XLSX.read(data, { type: 'array' });
    sheetNames = workbook.SheetNames;

    if (sheetNames.length > 1) {
        createSelect()

        loadSheet(workbook, sheetNames[0]); // Cargar la primera hoja por defecto
    } else {
        $sheetSelect.style.display = 'none';
        loadSheet(workbook, sheetNames[0]);
    }

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

function createSelect() {
    $sheetSelectContainer.style.display = 'flex';
    $sheetSelect.innerHTML = ''; // Limpiar select previo
    sheetNames.forEach(sheetName => {
        const option = document.createElement('option');
        option.value = sheetName;
        option.textContent = sheetName;
        $sheetSelect.appendChild(option);
    });

    $sheetSelect.onchange = () => {
        TableClear.clear(tableID);
        loadSheet(workbook, $sheetSelect.value);
    };
}
