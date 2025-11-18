// Проверяем авторизацию при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    setupAuthForms();
});

// Проверка статуса авторизации
async function checkAuth() {
    try {
        const response = await fetch('api/auth/check.php');
        const result = await response.json();
        
        if (result.success) {
            updateNavigation(result.user);
        } else {
            updateNavigation(null);
        }
    } catch (error) {
        console.error('Auth check error:', error);
        updateNavigation(null);
    }
}

// Обновление навигации в зависимости от авторизации
function updateNavigation(user) {
    const loginLink = document.getElementById('login-link');
    const profileLink = document.getElementById('profile-link');
    const userInfo = document.getElementById('user-info');
    
    if (user) {
        // Пользователь авторизован
        if (loginLink) loginLink.style.display = 'none';
        if (profileLink) {
            profileLink.style.display = 'block';
            profileLink.textContent = user.username || user.email;
        }
        if (userInfo) {
            userInfo.innerHTML = `
                <span>Привет, ${user.username}!</span>
                <a href="profile.html" class="nav-profile">Профиль</a>
                <button onclick="logout()" class="nav-logout">Выйти</button>
            `;
        }
        
        // Сохраняем информацию о пользователе в localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
        // Пользователь не авторизован
        if (loginLink) loginLink.style.display = 'block';
        if (profileLink) profileLink.style.display = 'none';
        if (userInfo) userInfo.innerHTML = '';
        
        localStorage.removeItem('currentUser');
    }
}

// Настройка форм авторизации
function setupAuthForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
        
        // Проверка совпадения паролей
        const password = document.getElementById('regPassword');
        const confirmPassword = document.getElementById('regConfirmPassword');
        
        if (password && confirmPassword) {
            confirmPassword.addEventListener('input', function() {
                if (password.value !== confirmPassword.value) {
                    confirmPassword.setCustomValidity('Пароли не совпадают');
                } else {
                    confirmPassword.setCustomValidity('');
                }
            });
        }
    }
}

// Обработка входа
async function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        email: formData.get('email'),
        password: formData.get('password')
    };
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Вход...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('api/auth/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showAuthMessage('Вход выполнен успешно!', 'success');
            
            // Сохраняем данные пользователя
            localStorage.setItem('currentUser', JSON.stringify(result.user));
            localStorage.setItem('auth_token', result.token);
            
            // Перенаправляем на главную через 1 секунду
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
            
        } else {
            showAuthMessage(result.message, 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showAuthMessage('Ошибка соединения с сервером', 'error');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Обработка регистрации
async function handleRegister(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        username: formData.get('username'),
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        password: formData.get('password')
    };
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Регистрация...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('api/auth/register.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showAuthMessage(result.message, 'success');
            
            // Перенаправляем на страницу входа через 2 секунды
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            
        } else {
            showAuthMessage(result.message, 'error');
        }
    } catch (error) {
        console.error('Register error:', error);
        showAuthMessage('Ошибка соединения с сервером', 'error');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Выход из системы
async function logout() {
    try {
        // В реальном проекте здесь должен быть запрос на сервер для очистки сессии
        await fetch('api/auth/logout.php', { method: 'POST' });
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        // Очищаем локальное хранилище
        localStorage.removeItem('currentUser');
        localStorage.removeItem('auth_token');
        
        // Обновляем навигацию
        updateNavigation(null);
        
        // Перенаправляем на главную
        window.location.href = 'index.html';
    }
}

// Показать сообщение авторизации
function showAuthMessage(message, type = 'info') {
    const messageElement = document.getElementById('authMessage');
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.className = `auth-message ${type}`;
        messageElement.style.display = 'block';
        
        // Автоматически скрываем успешные сообщения
        if (type === 'success') {
            setTimeout(() => {
                messageElement.style.display = 'none';
            }, 5000);
        }
    }
}

// Проверка авторизации (для других скриптов)
function isAuthenticated() {
    return localStorage.getItem('currentUser') !== null;
}

// Получить текущего пользователя
function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}
// Обработка формы восстановления пароля
function setupPasswordRecovery() {
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    const verifyEmailForm = document.getElementById('verifyEmailForm');
    
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', handleForgotPassword);
    }
    
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', handleResetPassword);
        
        // Получаем токен из URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (token) {
            document.getElementById('resetToken').value = token;
        } else {
            showAuthMessage('Неверная ссылка для сброса пароля', 'error');
        }
        
        // Проверка совпадения паролей
        const newPassword = document.getElementById('newPassword');
        const confirmNewPassword = document.getElementById('confirmNewPassword');
        
        if (newPassword && confirmNewPassword) {
            confirmNewPassword.addEventListener('input', function() {
                if (newPassword.value !== confirmNewPassword.value) {
                    confirmNewPassword.setCustomValidity('Пароли не совпадают');
                } else {
                    confirmNewPassword.setCustomValidity('');
                }
            });
        }
    }
    
    if (verifyEmailForm) {
        verifyEmailForm.addEventListener('submit', handleVerifyEmail);
    }
}

// Запрос на восстановление пароля
async function handleForgotPassword(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        email: formData.get('email')
    };
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('api/auth/forgot-password.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showAuthMessage(result.message, 'success');
            
            // Показываем debug информацию для демонстрации
            if (result.debug_link) {
                const debugInfo = document.getElementById('debugInfo');
                const debugLink = document.getElementById('debugLink');
                if (debugInfo && debugLink) {
                    debugLink.href = result.debug_link;
                    debugLink.textContent = result.debug_link;
                    debugInfo.style.display = 'block';
                }
            }
            
        } else {
            showAuthMessage(result.message, 'error');
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        showAuthMessage('Ошибка соединения с сервером', 'error');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Сброс пароля
async function handleResetPassword(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        token: formData.get('token'),
        password: formData.get('password')
    };
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Смена пароля...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('api/auth/reset-password.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showAuthMessage(result.message, 'success');
            
            // Перенаправляем на страницу входа через 2 секунды
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            
        } else {
            showAuthMessage(result.message, 'error');
        }
    } catch (error) {
        console.error('Reset password error:', error);
        showAuthMessage('Ошибка соединения с сервером', 'error');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Повторная отправка подтверждения email
async function handleVerifyEmail(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        email: formData.get('email')
    };
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('api/auth/verify-email.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showAuthMessage(result.message, 'success');
            
            // Показываем debug информацию для демонстрации
            if (result.debug_link) {
                const debugInfo = document.getElementById('debugInfo');
                const debugLink = document.getElementById('debugLink');
                if (debugInfo && debugLink) {
                    debugLink.href = result.debug_link;
                    debugLink.textContent = result.debug_link;
                    debugInfo.style.display = 'block';
                }
            }
            
        } else {
            showAuthMessage(result.message, 'error');
        }
    } catch (error) {
        console.error('Verify email error:', error);
        showAuthMessage('Ошибка соединения с сервером', 'error');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Обновляем инициализацию
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    setupAuthForms();
    setupPasswordRecovery(); // Добавляем эту строку
});