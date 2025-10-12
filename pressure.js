const resultView = document.getElementById('pressureResults');    
const unitSelection = document.getElementById('pressureUnit');
const inputField = document.getElementById('pressureInput');

const units = [
    {id : 'kpa', name: 'kPa', multFromPa: 1e-3},
    {id : 'bar', name: 'bar', multFromPa: 1e-5},
    {id : 'psi', name: 'psi', multFromPa: 0.00014504},
    {id : 'atm', name: 'atm', multFromPa: 9.8692e-6},
    {id : 'mmHg', name: 'mmHg', multFromPa: 7.5006e-3},
    {id : 'mpa', name: 'MPa', multFromPa: 1e-6},    
    {id : 'pa', name: 'Pa', multFromPa: 1},
]

initializePressure();
function initializePressure() {
    units.forEach(unit => {
        const option = document.createElement('option');
        option.value = unit.id;
        option.text = unit.name;
        unitSelection.appendChild(option);
    });
    unitSelection.addEventListener('change', updatePressure);
    inputField.addEventListener('input', updatePressure);
    inputField.value = 1;
    updatePressure();
}

function updatePressure() {
    const unitIndex = unitSelection.selectedIndex;
    const valuePa = inputField.value / units[unitIndex].multFromPa;
    resultString = '';
    units.forEach((unit, index) => {
        const convertedValue = valuePa * unit.multFromPa;
        resultString += `${formatPressureSmart(convertedValue, unit.name)}<br>`;
    });
    resultView.innerHTML = resultString;
}

/**
 * Форматирует значение давления (или любого числа)
 * без лишних нулей и с нормальной читаемостью.
 * Created by ChatGPT.
 * @param {number} value — значение (в нужной единице)
 * @param {string} unit — строка единицы ("Па", "бар", "кПа", ...)
 * @returns {string} красиво отформатированная строка
 */
function formatPressureSmart(value, unit = '') {
  if (!isFinite(value)) return '—'; // защита от NaN/Infinity

  // если очень большое или маленькое число — научный формат
  if (Math.abs(value) >= 1e6 || (Math.abs(value) < 1e-3 && value !== 0)) {
    return value.toExponential(3).replace(/\.?0+e/, 'e') + (unit ? ' ' + unit : '');
  }

  // если число целое — просто как есть
  if (Number.isInteger(value)) {
    return value.toString() + (unit ? ' ' + unit : '');
  }

  // иначе — округляем до разумной точности и убираем хвост нулей
  let str = value.toFixed(6); // максимум 6 знаков после запятой
  str = str.replace(/(\.\d*?[1-9])0+$/, '$1'); // убираем нули
  str = str.replace(/\.0+$/, ''); // убираем .0
  return str + (unit ? ' ' + unit : '');
}