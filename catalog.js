// Элементы DOM
const carsGrid = document.getElementById('cars-grid');
const loadingElement = document.getElementById('loading');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const filterBrand = document.getElementById('filter-brand');
const filterYear = document.getElementById('filter-year');
const filterBody = document.getElementById('filter-body');
const resetFiltersBtn = document.getElementById('reset-filters');

// Текущие фильтры и данные
let currentFilters = {
    brand: '',
    year: '',
    body: '',
    search: ''
};
let carsData = [];

// Инициализация каталога
document.addEventListener('DOMContentLoaded', function() {
    loadCarsFromAPI();
    setupEventListeners();
});

// Загрузка машин из API
async function loadCarsFromAPI() {
    showLoading();
    try {
        const response = await fetch('api/cars.php');
        const result = await response.json();
        
        if (result.success) {
            carsData = result.data;
            renderCars(carsData);
            populateBrandFilter();
        } else {
            console.error('Error loading cars:', result.message);
            showError('Ошибка загрузки данных. Пожалуйста, обновите страницу.');
        }
    } catch (error) {
        console.error('Fetch error:', error);
        showError('Ошибка соединения с сервером.');
    } finally {
        hideLoading();
    }
}

// Заполняем фильтр брендов из данных
function populateBrandFilter() {
    const brands = [...new Set(carsData.map(car => car.brand))].sort();
    
    // Очищаем существующие опции (кроме первой)
    while (filterBrand.options.length > 1) {
        filterBrand.remove(1);
    }
    
    // Добавляем бренды из БД
    brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        filterBrand.appendChild(option);
    });
}

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
    }, 300);
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
                    `<div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f8f9fa; color: #6c757d;">
                        ${car.brand} ${car.model}
                    </div>`
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
async function addToFavorites(carId) {
    // Проверяем авторизацию (временная реализация)
    const isLoggedIn = checkAuthStatus();
    
    if (!isLoggedIn) {
        alert('Для добавления в избранное необходимо войти в систему.');
        window.location.href = 'login.html';
        return;
    }
    
    try {
        // Отправляем запрос на сервер для добавления в избранное
        const response = await fetch('api/favorites.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                car_id: carId,
                action: 'add'
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            const car = carsData.find(c => c.id === carId);
            if (car) {
                showNotification(`"${car.brand} ${car.model}" добавлена в избранное!`, 'success');
            }
        } else {
            showNotification('Ошибка при добавлении в избранное', 'error');
        }
    } catch (error) {
        console.error('Error adding to favorites:', error);
        showNotification('Ошибка соединения с сервером', 'error');
    }
}

// Проверка статуса авторизации (временная реализация)
function checkAuthStatus() {
    // Пока проверяем наличие токена в localStorage
    // Позже заменим на полноценную проверку сессии
    return localStorage.getItem('auth_token') !== null;
}

// Показать уведомление
function showNotification(message, type = 'info') {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Добавляем стили для уведомления
    if (!document.querySelector('.notification-styles')) {
        const styles = document.createElement('style');
        styles.className = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: white;
                padding: 1rem;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                border-left: 4px solid #007bff;
                z-index: 10000;
                max-width: 300px;
                animation: slideIn 0.3s ease;
            }
            .notification-success { border-left-color: #28a745; }
            .notification-error { border-left-color: #dc3545; }
            .notification-warning { border-left-color: #ffc107; }
            .notification-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .notification-close {
                background: none;
                border: none;
                font-size: 1.2rem;
                cursor: pointer;
                margin-left: 1rem;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Автоматически удаляем через 5 секунд
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Показать ошибку
function showError(message) {
    carsGrid.innerHTML = `
        <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #666;">
            <h3>${message}</h3>
            <button onclick="loadCarsFromAPI()" class="btn btn-primary" style="margin-top: 1rem;">Попробовать снова</button>
        </div>
    `;
}

// Показать индикатор загрузки
function showLoading() {
    loadingElement.classList.add('show');
}

// Скрыть индикатор загрузки
function hideLoading() {
    loadingElement.classList.remove('show');
}

// Функция для обновления данных (можно вызывать извне)
function refreshData() {
    loadCarsFromAPI();
}