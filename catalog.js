// Данные машин (временно, потом заменим на данные с сервера)
const carsData = [
    {
        id: 1,
        brand: "Nissan",
        model: "Skyline R34 GT-R",
        year: 1999,
        price: 12500000,
        bodyType: "Купе",
        engine: "2.6L RB26DETT",
        power: "280 л.с.",
        description: "Легендарный японский спорткар, икона JDM культуры.",
        image: "img/skyline-r-34-GT-R (1).jpg",
        has3d: true,
        buyLink: "https://auto.drom.ru/nissan/skyline_gt-r/generation10/"
    },
    {
        id: 2,
        brand: "Toyota",
        model: "Supra MK4",
        year: 1998,
        price: 6000000,
        bodyType: "Купе",
        engine: "3.0L 2JZ-GTE",
        power: "320 л.с.",
        description: "Знаменитый благодаря фильму 'Форсаж'.",
        image: "img/supra-mk4 (1).jpg",
        has3d: true,
        buyLink: "https://auto.drom.ru/toyota/supra/generation4/restyling1/"
    },
    {
        id: 3,
        brand: "Mazda",
        model: "RX-7 FD3S",
        year: 1995,
        price: 3500000,
        bodyType: "Купе",
        engine: "1.3L 13B-REW",
        power: "255 л.с.",
        description: "Роторный двигатель, уникальный дизайн.",
        image: "img/mazda-rx7 (1).jpg",
        has3d: true,
        buyLink: "https://auto.drom.ru/mazda/rx-7/generation3/"
    },
    {
        id: 4,
        brand: "Honda",
        model: "Civic Type R EK9",
        year: 1997,
        price: 1500000,
        bodyType: "Хэтчбек",
        engine: "1.6L B16B",
        power: "185 л.с.",
        description: "Первый Civic с маркировкой Type R.",
        image: "img/civic-type-r-ek9 (1).jpg",
        has3d: true,
        buyLink: "https://auto.drom.ru/honda/civic_type_r/generation1/"
    },
    {
        id: 5,
        brand: "Subaru",
        model: "Impreza WRX STI",
        year: 2000,
        price: 1300000,
        bodyType: "Седан",
        engine: "2.0L EJ207",
        power: "280 л.с.",
        description: "Легенда раллийных соревнований.",
        image: "img/imreza-wrx-sti (1).jpg",
        has3d: true,
        buyLink: "https://auto.drom.ru/subaru/impreza_wrx_sti/generation2/restyling0/"
    },
    {
        id: 6,
        brand: "Mitsubishi",
        model: "Lancer Evolution VI",
        year: 1999,
        price: 2000000,
        bodyType: "Седан",
        engine: "2.0L 4G63T",
        power: "280 л.с.",
        description: "Томми Мякинен edition.",
        image: "img/lancer-evo-6 (1).jpg",
        has3d: true,
        buyLink: "https://auto.drom.ru/mitsubishi/lancer_evolution/generation6/"
    },
    {
        id: 7,
        brand: "Nissan",
        model: "Silvia S15",
        year: 2001,
        price: 4200000,
        bodyType: "Купе",
        engine: "2.0L SR20DET",
        power: "250 л.с.",
        description: "Культовый дрифт-кар.",
        image: "img/silvia-s15 (1).jpg",
        has3d: true,
        buyLink: "https://auto.drom.ru/nissan/silvia/generation7/"
    },
    {
        id: 8,
        brand: "Toyota",
        model: "Chaser JZX100",
        year: 1998,
        price: 700000,
        bodyType: "Седан",
        engine: "2.5L 1JZ-GTE",
        power: "280 л.с.",
        description: "Легенда японских улиц.",
        image: "img/chaser-jzx100 (1).jpg",
        has3d: false,
        buyLink: "https://auto.drom.ru/toyota/chaser/generation6/"
    },
    {
        id: 9,
        brand: "Honda",
        model: "NSX NA1",
        year: 1993,
        price: 10000000,
        bodyType: "Купе",
        engine: "3.0L C30A",
        power: "270 л.с.",
        description: "Японский суперкар с алюминиевым кузовом.",
        image: "img/nsx (1).jpg",
        has3d: true,
        buyLink: "https://auto.drom.ru/honda/nsx/generation1/"
    },
    {
        id: 10,
        brand: "Nissan",
        model: "180SX",
        year: 1996,
        price: 2750000,
        bodyType: "Купе",
        engine: "1.8L SR20DET",
        power: "205 л.с.",
        description: "Популярный дрифт-кар и проект для тюнинга.",
        image: "img/180sx (1).jpg",
        has3d: true,
        buyLink: "https://auto.drom.ru/nissan/180sx/"
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

// Функция форматирования цены
function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU').format(price);
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
                <div class="car-price">${formatPrice(car.price)} ₽</div>
                <div class="car-actions">
                    <a href="item.html?id=${car.id}" class="btn btn-primary">Подробнее</a>
                    <a href="${car.buyLink}" target="_blank" class="btn btn-buy">Купить</a>
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
    const car = carsData.find(c => c.id === carId);
    if (car) {
        alert(`"${car.brand} ${car.model}" добавлена в избранное!`);
    }
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