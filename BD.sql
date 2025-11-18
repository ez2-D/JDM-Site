CREATE DATABASE jdm_world CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE jdm_world;
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url VARCHAR(500),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL
);
CREATE TABLE cars (
    id INT PRIMARY KEY AUTO_INCREMENT,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year YEAR NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    body_type ENUM('Купе', 'Седан', 'Хэтчбек', 'Внедорожник', 'Универсал', 'Кабриолет') NOT NULL,
    engine VARCHAR(100) NOT NULL,
    power VARCHAR(50) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    model_3d_url VARCHAR(500),
    has_3d BOOLEAN DEFAULT FALSE,
    buy_link VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);
CREATE TABLE favorites (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    car_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorite (user_id, car_id)
);
CREATE TABLE views_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    car_id INT NOT NULL,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
);
INSERT INTO users (email, password_hash, username, first_name, last_name, phone) VALUES
('user1@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'jdm_lover', 'Иван', 'Петров', '+79161234567'),
('admin@jdmworld.ru', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'Админ', 'Админов', '+79031234567');
INSERT INTO cars (brand, model, year, price, body_type, engine, power, description, image_url, has_3d, buy_link) VALUES
('Nissan', 'Skyline R34 GT-R', 1999, 12500000.00, 'Купе', '2.6L RB26DETT', '280 л.с.', 'Легендарный японский спорткар, икона JDM культуры.', 'img/skyline-r-34-GT-R (1).jpg', TRUE, 'https://auto.drom.ru/nissan/skyline_gt-r/generation10/'),
('Toyota', 'Supra MK4', 1998, 15000000.00, 'Купе', '3.0L 2JZ-GTE', '320 л.с.', 'Знаменитый благодаря фильму ''Форсаж''.', 'img/supra-mk4 (1).jpg', TRUE, 'https://auto.drom.ru/toyota/supra/generation4/restyling1/'),
('Mazda', 'RX-7 FD3S', 1995, 6500000.00, 'Купе', '1.3L 13B-REW', '255 л.с.', 'Роторный двигатель, уникальный дизайн.', 'img/mazda-rx7 (1).jpg', TRUE, 'https://auto.drom.ru/mazda/rx-7/generation3/'),
('Honda', 'Civic Type R EK9', 1997, 3200000.00, 'Хэтчбек', '1.6L B16B', '185 л.с.', 'Первый Civic с маркировкой Type R.', 'img/civic-type-r-ek9 (1).jpg', TRUE, 'https://auto.drom.ru/honda/civic_type_r/generation1/'),
('Subaru', 'Impreza WRX STI', 2000, 4800000.00, 'Седан', '2.0L EJ207', '280 л.с.', 'Легенда раллийных соревнований.', 'img/imreza-wrx-sti (1).jpg', TRUE, 'https://auto.drom.ru/subaru/impreza_wrx_sti/generation2/restyling0/'),
('Mitsubishi', 'Lancer Evolution VI', 1999, 5200000.00, 'Седан', '2.0L 4G63T', '280 л.с.', 'Томми Мякинен edition.', 'img/lancer-evo-6 (1).jpg', TRUE, 'https://auto.drom.ru/mitsubishi/lancer_evolution/generation6/'),
('Nissan', 'Silvia S15', 2001, 4200000.00, 'Купе', '2.0L SR20DET', '250 л.с.', 'Культовый дрифт-кар.', 'img/silvia-s15 (1).jpg', TRUE, 'https://auto.drom.ru/nissan/silvia/generation7'),
('Toyota', 'Chaser JZX100', 1998, 3800000.00, 'Седан', '2.5L 1JZ-GTE', '280 л.с.', 'Легенда японских улиц.', 'img/chaser-jzx100 (1).jpg', TRUE, 'https://auto.drom.ru/toyota/chaser/generation6/'),
('Honda', 'NSX NA1', 1993, 18500000.00, 'Купе', '3.0L C30A', '270 л.с.', 'Японский суперкар с алюминиевым кузовом.', 'img/nsx (1).jpg', TRUE, 'https://auto.drom.ru/honda/nsx/generation1/'),
('Nissan', '180SX', 1996, 2800000.00, 'Купе', '1.8L SR20DET', '205 л.с.', 'Популярный дрифт-кар и проект для тюнинга.', 'img/180sx (1).jpg', TRUE, 'https://auto.drom.ru/nissan/180sx');