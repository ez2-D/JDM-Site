// Данные машин (временно, потом заменим на данные с сервера)
const carsData = [
    {
        id: 1,
        brand: "Nissan",
        model: "Skyline R34 GT-R",
        year: 1999,
        price: 18500000,
        bodyType: "Coupe",
        engine: "2.6L RB26DETT",
        power: "280 л.с.",
        description: "Легендарный японский спорткар, икона JDM культуры.",
        image: "images/skyline-r34.jpg",
        has3d: true
    },
    {
        id: 2,
        brand: "Toyota",
        model: "Supra MK4",
        year: 1998,
        price: 7800000,
        bodyType: "Coupe",
        engine: "3.0L 2JZ-GTE",
        power: "320 л.с.",
        description: "Знаменитый благодаря фильму 'Форсаж'.",
        image: "images/supra-mk4.jpg",
        has3d: true
    },
    {
        id: 3,
        brand: "Mazda",
        model: "RX-7 FD3S",
        year: 1995,
        price: 2600000,
        bodyType: "Coupe",
        engine: "1.3L 13B-REW",
        power: "255 л.с.",
        description: "Роторный двигатель, уникальный дизайн.",
        image: "images/rx7-fd.jpg",
        has3d: false
    },
    {
        id: 4,
        brand: "Honda",
        model: "Civic Type R EK9",
        year: 1997,
        price: 1700000,
        bodyType: "Hatchback",
        engine: "1.6L B16B",
        power: "185 л.с.",
        description: "Первый Civic с маркировкой Type R.",
        image: "images/civic-ek9.jpg",
        has3d: false
    },
    {
        id: 5,
        brand: "Subaru",
        model: "Impreza WRX STI",
        year: 2000,
        price: 1500000,
        bodyType: "Sedan",
        engine: "2.0L EJ207",
        power: "280 л.с.",
        description: "Легенда раллийных соревнований.",
        image: "images/impreza-sti.jpg",
        has3d: false
    },
    {
        id: 6,
        brand: "Mitsubishi",
        model: "Lancer Evolution VI",
        year: 1999,
        price: 1700000,
        bodyType: "Sedan",
        engine: "2.0L 4G63T",
        power: "280 л.с.",
        description: "Томми Мякинен edition.",
        image: "images/evo6.jpg",
        has3d: false
    }
];

// Элементы DOM
const carsGrid = document.getElementById('cars-grid');
const loadingElement = document.getElementById('loading');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const filterBrand = document.getElementById('filter-brand');
const filterYear = document.getElementById('filter-year');
const filterBody = document.getElementById('filter-body');
const resetFiltersBtn = document.getElementById('reset-filters');

// Текущие фильтры
let currentFilters = {
    brand: '',
    year: '',
    body: '',
    search: ''
};

// Инициализация каталога
document.addEventListener('DOMContentLoaded', function() {
    renderCars(carsData);
    setupEventListeners();
});

// Настройка обработчиков событий
function setupEventListeners() {
    filterBrand.addEventListener('change', applyFilters);
    filterYear.addEventListener('change', applyFilters);
    filterBody.addEventListener('change', applyFilters);
    searchBtn.addEventListener('click', applySearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') applySearch();
    });
    resetFiltersBtn.addEventListener('click', resetFilters);
}

// Применение фильтров
function applyFilters() {
    currentFilters.brand = filterBrand.value;
    currentFilters.year = filterYear.value;
    currentFilters.body = filterBody.value;
    
    filterCars();
}

// Поиск
function applySearch() {
    currentFilters.search = searchInput.value.toLowerCase();
    filterCars();
}

// Сброс фильтров
function resetFilters() {
    filterBrand.value = '';
    filterYear.value = '';
    filterBody.value = '';
    searchInput.value = '';
    currentFilters = { brand: '', year: '', body: '', search: '' };
    renderCars(carsData);
}

// Фильтрация машин
function filterCars() {
    showLoading();
    
    // Имитация загрузки с сервера
    setTimeout(() => {
        const filteredCars = carsData.filter(car => {
            const matchesBrand = !currentFilters.brand || car.brand === currentFilters.brand;
            const matchesYear = !currentFilters.year || car.year >= parseInt(currentFilters.year);
            const matchesBody = !currentFilters.body || car.bodyType === currentFilters.body;
            const matchesSearch = !currentFilters.search || 
                                car.model.toLowerCase().includes(currentFilters.search) ||
                                car.brand.toLowerCase().includes(currentFilters.search);
            
            return matchesBrand && matchesYear && matchesBody && matchesSearch;
        });
        
        hideLoading();
        renderCars(filteredCars);
    }, 500);
}

// Отображение машин в сетке
function renderCars(cars) {
    if (cars.length === 0) {
        carsGrid.innerHTML = `
            <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #666;">
                <h3>Машины не найдены</h3>
                <p>Попробуйте изменить параметры фильтров</p>
            </div>
        `;
        return;
    }
    
    carsGrid.innerHTML = cars.map(car => `
        <div class="car-card" data-car-id="${car.id}">
            <div class="car-image">
                ${car.image ? 
                    `<img src="${car.image}" alt="${car.brand} ${car.model}" onerror="this.style.display='none'">` : 
                    `${car.brand} ${car.model}`
                }
                ${car.has3d ? '<div class="3d-badge" style="position: absolute; top: 10px; right: 10px; background: #e10600; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px;">3D</div>' : ''}
            </div>
            <div class="car-info">
                <div class="car-title">${car.brand} ${car.model}</div>
                <div class="car-details">
                    <div>Год: ${car.year}</div>
                    <div>Двигатель: ${car.engine}</div>
                    <div>Мощность: ${car.power}</div>
                    <div>Кузов: ${car.bodyType}</div>
                </div>
                <div class="car-price">₽${car.price.toLocaleString()}</div>
                <div class="car-actions">
                    <a href="item.html?id=${car.id}" class="btn btn-primary">Подробнее</a>
                    <button class="btn btn-secondary" onclick="addToFavorites(${car.id})">В избранное</button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Добавляем обработчики клика на карточки
    document.querySelectorAll('.car-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Если клик не по кнопке, переходим на страницу машины
            if (!e.target.closest('.car-actions')) {
                const carId = this.getAttribute('data-car-id');
                window.location.href = `item.html?id=${carId}`;
            }
        });
    });
}

// Добавление в избранное
function addToFavorites(carId) {
    // Временная реализация - позже свяжем с системой авторизации
    alert(`Машина ${carId} добавлена в избранное!`);
    // Здесь будет логика добавления в избранное
}

// Показать индикатор загрузки
function showLoading() {
    loadingElement.classList.add('show');
}

// Скрыть индикатор загрузки
function hideLoading() {
    loadingElement.classList.remove('show');
}