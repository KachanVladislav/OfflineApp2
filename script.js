const logoButton = document.getElementById('logoButton');
const menu = document.getElementById('sideMenu');
const overlay = document.getElementById('overlay');

const tabs = [
    {id : 'pressure', name: 'Перевод давления', element : null},
    {id : 'todo', name: 'TODO-лист', element : null},
    {id : 'settingsTab', name: 'Настройки', element : null},
    {id : 'about', name: 'О приложении', element : null},
]

tabs.forEach(tab => {
    tab.element = document.getElementById(tab.id);
    // <div class="menu-item">Главная</div>
    const menuItem = document.createElement('div');
    menuItem.setAttribute('class', 'menu-item');
    menuItem.setAttribute('id', tab.id);
    menuItem.textContent = tab.name;
    menu.appendChild(menuItem);
});

logoButton.addEventListener('click', () => {    
    const isOpen = menu.classList.toggle('open');
    overlay.classList.toggle('hidden', !isOpen);
});

overlay.addEventListener('click', () => {
  menu.classList.remove('open');
  overlay.classList.add('hidden');
});

menu.addEventListener('click', (e) => {
  if (e.target.classList.contains('menu-item')) {
    showTab(e.target.id);
  }
});

function showTab(tabId) {
    tabs.forEach(tab => {
        tab.element.style.display = (tab.id === tabId) ? 'block' : 'none';
    });
    menu.classList.remove('open');
    overlay.classList.add('hidden');
}

showTab('todo');
