async function loadingData() {
    try {
        const dataResponse = await fetch('data.json');
        const data = await dataResponse.json();

        const configResponse = await fetch('config.json');
        const config = await configResponse.json();

        return { data, config };
    } catch (error) {
        console.error("Ошибка загрузки данных:", error);
        alert("Не удалось загрузить данные. Пожалуйста, попробуйте позже.");
        return { data: [], config: [] }; // Возвращаем пустые массивы в случае ошибки
    }
}

function fillInTheData(data, config) {
    const materialSelect = document.getElementById('material');
    const pipeSelect = document.getElementById('pipe');
    const strengthSelect = document.getElementById('strength');

    data.forEach(item => {
        if (item.type === 'list') {
            const option = document.createElement('option');
            option.value = item.name;
            option.textContent = item.name;
            materialSelect.appendChild(option);
        } else if (item.type === 'pipe') {
            const option = document.createElement('option');
            option.value = item.name;
            option.textContent = item.name;
            pipeSelect.appendChild(option);
        }
    });

    config.forEach(item => {
        if (item.type === 'frame') {
            const option = document.createElement('option');
            option.value = item.key;
            option.textContent = item.name;
            strengthSelect.appendChild(option);
        }
    });
}

function calc(data, config) {
    const width = parseFloat(document.getElementById('width').value);
    const length = parseFloat(document.getElementById('length').value);
    const selectedMaterial = data.find(item => item.name === document.getElementById('material').value);
    const selectedPipe = data.find(item => item.name === document.getElementById('pipe').value);
    const selectedStrength = config.find(item => item.key === document.getElementById('strength').value);

    const area = width * length;
    const cellSize = selectedStrength.step; // Пример расчета ячейки
    const sheetsCount = Math.ceil(area / (selectedMaterial.width * 1)); // Площадь листа 1м2
    const pipeLength = (2 * (width + length)) / selectedStrength.step; // Длина трубы
    const screwsCount = Math.ceil(area * (config.find(item => item.type === 'fix' && item.key === selectedMaterial.material).value));

    displayResults(area, cellSize, sheetsCount, pipeLength, screwsCount, selectedMaterial, selectedPipe);
}

function displayResults(area, cellSize, sheetsCount, pipeLength, screwsCount, selectedMaterial, selectedPipe) {
    document.getElementById('area').textContent = `Площадь изделия: ${area.toFixed(2)} м²`;
    document.getElementById('cell-size').textContent = `Размер ячейки: ${cellSize.toFixed(2)} м`;

    const tbody = document.getElementById('materials-table').querySelector('tbody');
    tbody.innerHTML = '';

    const materialRow = `<tr>
        <td>${selectedMaterial.name}</td>
        <td>${selectedMaterial.unit}</td>
        <td>${sheetsCount}</td>
        <td>${(sheetsCount * selectedMaterial.price).toFixed(2)}</td>
    </tr>`;
    tbody.innerHTML += materialRow;

    const pipeRow = `<tr>
        <td>${selectedPipe.name}</td>
        <td>${selectedPipe.unit}</td>
        <td>${pipeLength.toFixed(2)}</td>
        <td>${(pipeLength * selectedPipe.price).toFixed(2)}</td>
    </tr>`;
    tbody.innerHTML += pipeRow;

    const row = `<tr>
        <td>Саморез</td>
        <td>шт</td>
        <td>${screwsCount}</td>
        <td>${(screwsCount * 1.1).toFixed(2)}</td>
    </tr>`;
    tbody.innerHTML += row;

    const total = (sheetsCount * selectedMaterial.price) + (pipeLength * selectedPipe.price) + (screwsCount * 1.1);
    document.getElementById('total').textContent = `Итого: ${total.toFixed(2)}`;
}

document.getElementById('calculate').addEventListener('click', async () => {
    const { data, config } = await loadingData();
    if (validateInputs()) { // Добавлено условие для валидации
        calc(data, config);
    }
});

window.onload = async () => {
    const { data, config } = await loadingData();
    fillInTheData(data, config);
};
function validateInputs() {
    const width = parseFloat(document.getElementById('width').value);
    const length = parseFloat(document.getElementById('length').value);
    
    if (isNaN(width) || width < 5 || width > 25) {
        alert("Ширина должна быть числом от 5 до 25.");
        return false;
    }
    
    if (isNaN(length) || length < 5 || length > 50) {
        alert("Длина должна быть числом от 5 до 50.");
        return false;
    }
    
    return true;
}
document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
});
document.getElementById('reset-button').addEventListener('click', () => {
    // Очистка полей ввода
    document.getElementById('width').value = '';
    document.getElementById('length').value = '';
    
    // Сброс выпадающих списков
    document.getElementById('material').selectedIndex = 0;
    document.getElementById('pipe').selectedIndex = 0;
    document.getElementById('strength').selectedIndex = 0;

    // Очистка результатов
    const tbody = document.getElementById('materials-table').querySelector('tbody');
    tbody.innerHTML = '';
    document.getElementById('total').textContent = 'Итого: ';


});
