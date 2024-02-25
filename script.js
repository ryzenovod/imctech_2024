document.getElementById('input-excel').addEventListener('change', function(e) {
    var reader = new FileReader();
    reader.onload = function(e) {
        var data = e.target.result;
        var workbook = XLSX.read(data, { type: 'binary' });

        var sheetName = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[sheetName];

        // Преобразуем данные из листа Excel в массив JavaScript
        var jsonData = XLSX.utils.sheet_to_json(worksheet);

        console.log("Прочитанные данные:", jsonData);

        // Вызываем функцию построения графика, передавая данные
        buildChart(jsonData);
    };

    reader.onerror = function(ex) {
        console.log(ex);
    };

    reader.readAsBinaryString(e.target.files[0]);
});

function buildChart(data) {
    var labels = data.map(function(entry) { return entry['ФИО']; }); // Массив с именами студентов
    var criteria = Object.keys(data[0]).slice(1); // Массив с номерами критериев

    console.log("Имена студентов:", labels);
    console.log("Номера критериев:", criteria);

    var datasets = criteria.map(function(criterion, index) {
        return {
            label: 'Критерий ' + (index + 1),
            data: data.map(function(entry) { return entry[criterion]; }),
            fill: false,
            borderColor: `rgb(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255})`
        };
    });

    console.log("Датасеты для графика:", datasets);

    new Chart(document.getElementById('chart'), {
        type: 'line', // Или 'bar', 'radar' и т.д. в зависимости от желаемого типа диаграммы
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

